import { cleanEnv, num, port, str, url } from "envalid";
import { config } from "dotenv";

config();

export default cleanEnv(process.env, {
  MONGO_COMPASS_URI: str(),
  PORT: port(),
  SALT: num(),
  GOOGLE_APPLICATION_CREDENTIALS: str(),
  CLOUDINARY_CLOUD_NAME: str(),
  CLOUDINARY_API_KEY: str(),
  CLOUDINARY_API_SECRET: str(),
  CLIENT_URL: url(),
  ADMIN_URL: url(),
});
