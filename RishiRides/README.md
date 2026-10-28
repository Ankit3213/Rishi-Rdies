# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Passenger account API

The app's authentication API is in `server/` and stores accounts in MongoDB. Configure and run it from `RishiRides/`:

```bash
cd server
npm install
cp .env.example .env
# Set a private MongoDB URI and a random JWT_SECRET of at least 32 characters in .env.
npm run dev
```

Set `EXPO_PUBLIC_API_URL` in the app's local `.env` to the API URL reachable by the device (for example `http://10.0.2.2:4000` for an Android emulator or `http://localhost:4000` for a web browser). Keep the MongoDB URI and JWT secret only in `server/.env`; never put either in an `EXPO_PUBLIC_` variable or commit them.

Signup stores the Gmail/email and mobile number with a **scrypt password hash**, never the plaintext password. Login requires the matching email, mobile number, and password, then verifies a one-time code sent to the registered Indian mobile number. OTP challenges are stored as keyed hashes, expire after five minutes, and are limited to five attempts. Local development uses a temporary OTP simulator and displays its code in the app; production must use Twilio Verify and MongoDB TLS. Use a MongoDB user limited to the application's database, enable encryption at rest and backups in the MongoDB deployment, and use HTTPS for the public API.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
