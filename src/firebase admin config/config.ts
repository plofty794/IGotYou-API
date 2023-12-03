import admin from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import env from "../utils/envalid";

const app = initializeApp({
  credential: admin.credential.cert(env.GOOGLE_APPLICATION_CREDENTIALS),
});

export const auth = getAuth(app);
