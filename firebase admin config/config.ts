import admin from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const app = initializeApp({
  credential: admin.credential.cert(
    "C:/Users/Administrator01/Downloads/igotyou-399523-firebase-adminsdk-dape5-6a0d653f21.json"
  ),
});

export const auth = getAuth(app);
