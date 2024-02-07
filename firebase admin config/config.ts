import admin from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import env from "../utils/envalid";

const app = initializeApp({
  credential: admin.credential.cert(
    env.FIREBASE_SERVICE_KEY.replace(/\\n/g, "\n")
  ),
});

export const auth = getAuth(app);
