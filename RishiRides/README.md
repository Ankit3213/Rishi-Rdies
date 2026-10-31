# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Passenger account API

The app's authentication API is in `server/` and stores accounts in MongoDB. Run it from `RishiRides/` for local development:

```bash
cd server
npm install
docker compose up -d mongodb
npm run dev
```

For local web use, the Expo app defaults to the auth API at `http://localhost:4000`. Start the auth API and MongoDB before signup/login. For a phone or emulator, set `EXPO_PUBLIC_API_URL` in the app's local `.env` to the API URL reachable by that device (for example `http://10.0.2.2:4000` for an Android emulator). Keep the MongoDB URI and JWT secret only in `server/.env`; never put either in an `EXPO_PUBLIC_` variable or commit them.

For local development with Docker, start MongoDB with `cd server && docker compose up -d mongodb`, then start the API with `cd server && npm run dev`. Local development defaults to MongoDB at `127.0.0.1:27017` and the OTP simulator; the simulator displays a six-digit test code in the verification screen and does **not** email it. A random development-only JWT secret is generated on each server start. To deliver real OTPs to Gmail, copy `server/.env.example` to `server/.env`, configure a Google SMTP App Password, set `OTP_PROVIDER=email-smtp`, and keep a stable random `JWT_SECRET` there. Never use development defaults in production.

Signup stores the Gmail/email and mobile number with a **scrypt password hash**, never the plaintext password. Login requires the matching email, mobile number, and password, then verifies a one-time code sent to the registered Gmail address. OTP challenges are stored as keyed hashes, expire after five minutes, and are limited to five attempts. For Gmail delivery, set `OTP_PROVIDER=email-smtp` and configure `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=465`, `SMTP_SECURE=true`, `SMTP_USER`, `SMTP_PASSWORD`, and `SMTP_FROM` in `server/.env`. Use a Google App Password (with 2-Step Verification enabled); never put it in app variables or commit it. The local development simulator remains available with `OTP_PROVIDER=simulator` and displays its code in the app. Twilio Verify remains available with `OTP_PROVIDER=twilio-verify`. Production must use a real delivery provider and MongoDB TLS. Use a MongoDB user limited to the application's database, enable encryption at rest and backups in the MongoDB deployment, and use HTTPS for the public API.

Passenger login and signup also support Google OAuth. The app uses Expo AuthSession to request a Google ID token, which the server verifies before creating an app session. For web, create a Web OAuth client ID in Google Cloud Console, allow the web app's origin and exact OAuth redirect URL, and set `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` in the app's local `.env`. The app uses `AuthSession.makeRedirectUri()` for its callback; for a local Expo web server at `http://localhost:8081`, add `http://localhost:8081` under **Authorized JavaScript origins** and `http://localhost:8081/` under **Authorized redirect URIs** for the Web client. If the site is opened on a different host or port, use those exact values instead. For native builds, also create iOS and Android OAuth clients for `com.rishirides.app` and set their corresponding `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` and `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID`. Add the accepted client IDs as a comma-separated list in `GOOGLE_OAUTH_CLIENT_IDS` in `server/.env`; the server validates Google ID tokens against these audiences. Copy `.env.example` to `.env` for the app and `server/.env.example` to `server/.env`, then restart Expo so it reloads the client IDs. OAuth client IDs are public identifiers, not secrets; never put Google client secrets in the app. New Google users provide a mobile number once to create their passenger account. Native Google redirects should be tested in an Expo development build configured with the matching client IDs and app signing details.

## Get started

1. Install dependencies with `npm install`.
2. Start MongoDB and the auth API using the steps above.
3. Start the app with `npx expo start --web`.

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
