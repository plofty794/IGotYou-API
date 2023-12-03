import admin from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import applicationDetails from "./igotyou-399523-firebase-adminsdk-dape5-6a0d653f21.json";

const app = initializeApp({
  credential: admin.credential.cert(JSON.stringify(applicationDetails)),
});

export const auth = getAuth(app);
