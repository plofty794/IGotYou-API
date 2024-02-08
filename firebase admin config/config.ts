import admin from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import env from "../utils/envalid";
import path from "path";

const app = initializeApp({
  credential: admin.credential.cert({
    clientEmail:
      "firebase-adminsdk-dape5@igotyou-399523.iam.gserviceaccount.com",
    privateKey: "6a0d653f2140e295eecae9fd97da268f8ebe9400",
    projectId: "igotyou-399523",
  }),
});

export const auth = getAuth(app);
