import { MongoClient, type Collection, type Db, type ObjectId } from 'mongodb';
import { config } from './config';

export type PassengerUser = {
  _id: ObjectId;
  name: string;
  email: string;
  googleSubject?: string;
  mobile: string;
  passwordHash: string;
  role: 'passenger';
  status: 'pending' | 'active' | 'suspended';
  createdAt: Date;
  updatedAt: Date;
};

export type OtpChallenge = {
  _id: string;
  userId: ObjectId;
  mobile: string;
  codeHash: string;
  expiresAt: Date;
  attempts: number;
  consumedAt: Date | null;
  createdAt: Date;
};

const client = new MongoClient(config.MONGODB_URI, {
  appName: 'rishirides-auth-api',
  serverSelectionTimeoutMS: 10_000,
});

let database: Db | undefined;

export async function connectDatabase(): Promise<Db> {
  if (!database) {
    await client.connect();
    database = client.db(config.MONGODB_DB);
    await Promise.all([
      database.collection<PassengerUser>('users').createIndexes([
        { key: { email: 1 }, unique: true, name: 'users_email_unique' },
        { key: { mobile: 1 }, unique: true, name: 'users_mobile_unique' },
        { key: { googleSubject: 1 }, unique: true, sparse: true, name: 'users_google_subject_unique' },
        { key: { status: 1, role: 1 }, name: 'users_status_role' },
      ]),
      database.collection<OtpChallenge>('otpChallenges').createIndexes([
        { key: { userId: 1, consumedAt: 1, createdAt: -1 }, name: 'otp_user_active' },
        { key: { expiresAt: 1 }, expireAfterSeconds: 0, name: 'otp_expiry_ttl' },
      ]),
    ]);
  }
  return database;
}

export async function closeDatabase(): Promise<void> {
  await client.close();
  database = undefined;
}

export async function getCollections(): Promise<{
  users: Collection<PassengerUser>;
  otpChallenges: Collection<OtpChallenge>;
}> {
  const db = await connectDatabase();
  return {
    users: db.collection<PassengerUser>('users'),
    otpChallenges: db.collection<OtpChallenge>('otpChallenges'),
  };
}
