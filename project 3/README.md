# UD-1 Learning Platform Setup Guide

This README provides a step-by-step guide to set up and run the **UD-1 Learning Platform** project on your local machine.

---

## Prerequisites

Before starting, ensure you have the following installed on your system:

1. **Node.js (v16 or later)** and **npm (v8 or later)**  
   - Download and install from [Node.js Official Website](https://nodejs.org/).

2. **Git (for version control)**  
   - Download and install from [Git Official Website](https://git-scm.com/).

3. **Firebase Account (for backend services)**  
   - Set up a Firebase project at [Firebase Console](https://console.firebase.google.com/).

4. **Google Cloud API Key (for job fetching or other integrations)**  
   - Set up at [Google Cloud Console](https://console.cloud.google.com/).

---

## Step 1: Clone the Repository

Clone the project repository to your local machine:

```bash
git clone <repository-url>
```

---

## Step 2: Navigate to the Project Directory

Change into the project directory:

```bash
cd <project-directory>
```

For example:

```bash
cd ud-1-learning-platform
```

---

## Step 3: Install Dependencies

Install all required dependencies using npm:

```bash
npm install
```

This will install both dependencies and devDependencies listed in the `package.json` file.

---

## Step 4: Set Up Environment Variables

Create a `.env` file in the root of the project directory (if it doesn't already exist).  
Add the following environment variables to the `.env` file:

```env
FIREBASE_API_KEY=<your-firebase-api-key>
FIREBASE_AUTH_DOMAIN=<your-firebase-auth-domain>
FIREBASE_PROJECT_ID=<your-firebase-project-id>
FIREBASE_STORAGE_BUCKET=<your-firebase-storage-bucket>
FIREBASE_MESSAGING_SENDER_ID=<your-firebase-messaging-sender-id>
FIREBASE_APP_ID=<your-firebase-app-id>
FIREBASE_MEASUREMENT_ID=<your-firebase-measurement-id>
GOOGLE_CLOUD_API_KEY=<your-google-cloud-api-key>
FIREBASE_SERVICE_ACCOUNT_KEY_PATH=<path-to-your-service-account-key.json>
```

Replace `<your-...>` with the actual values from your Firebase and Google Cloud Console.

---

## Step 5: Set Up Firebase

Enable Firebase Services:

1. Go to the [Firebase Console](https://console.firebase.google.com/) and enable the following services:
   - **Authentication**: Enable email/password authentication.
   - **Firestore Database**: Set up Firestore in production mode or test mode.
   - **Storage**: Enable Firebase Storage for file uploads.

2. Download Firebase Admin SDK:
   - Go to the Firebase Console > Project Settings > Service Accounts.
   - Generate a new private key and download the `.json` file.
   - Save the file in a secure location and update the `FIREBASE_SERVICE_ACCOUNT_KEY_PATH` in the `.env` file.

---

## Step 6: Start the Development Server

Run the following command to start the development server:

```bash
npm run dev
```

This will start the Vite development server. Open your browser and navigate to:

```
http://localhost:5173
```

---

## Step 7: Set Up the Backend Server

Navigate to the `server/` directory:

```bash
cd server
```

Install backend dependencies:

```bash
npm install
```

Start the backend server:

```bash
npm start
```

The backend server will run on `http://localhost:5000`.

---

## Step 8: Set Up the LinkedIn Proxy Server

Navigate to the `linkedin-proxy/` directory:

```bash
cd linkedin-proxy
```

Install dependencies:

```bash
npm install
```

Start the LinkedIn proxy server:

```bash
npm start
```

The LinkedIn proxy server will run on `http://localhost:3000`.

---

## Step 9: Test the Application

Open your browser and navigate to the frontend URL:

```
http://localhost:5173
```

Test the following features:

1. **Authentication**: Sign up and log in as a user or admin.
2. **Courses**: View, enroll in, and download course content.
3. **Admin Dashboard**: Add, edit, and delete courses, manage users, and review job applications.
4. **Jobs**: View job opportunities and apply for jobs.

---

## Optional: Build for Production

To build the project for production, run:

```bash
npm run build
```

This will generate a `dist/` folder containing the production-ready files.

---

## Folder Structure

Here’s an overview of the project structure:

```
ud-1-learning-platform/
├── frontend/
├── server/
├── linkedin-proxy/
├── .env
├── package.json
├── README.md
```

---

## Troubleshooting

### Error: Missing Environment Variables

Ensure all required environment variables are set in the `.env` file.

### Error: Firebase Configuration

Verify that the Firebase project is correctly set up and the Admin SDK key is valid.

### Port Conflicts

If ports `5173`, `5000`, or `3000` are in use, update the respective configurations in `vite.config.ts`, `index.mjs`, or `server.js`.

### Dependency Issues

Delete `node_modules` and reinstall dependencies:

```bash
rm -rf node_modules
npm install
```

---

## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, Firebase Admin SDK
- **Database**: Firebase Firestore
- **Authentication**: Firebase Authentication
- **Build Tool**: Vite
- **Icons**: Lucide React

---

## Contributing

1. Fork the repository.
2. Create a new branch:

```bash
git checkout -b <branch-name>
```

3. Commit your changes:

```bash
git commit -m "Your commit message"
```

4. Push to the branch:

```bash
git push origin <branch-name>
```

5. Open a pull request.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.