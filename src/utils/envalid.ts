import { cleanEnv, email, num, port, str, url } from "envalid";
import { config } from "dotenv";

config();

export default cleanEnv(process.env, {
  MONGO_COMPASS_URI: str(),
  PORT: port(),
  SALT: num(),
  CLOUDINARY_CLOUD_NAME: str(),
  CLOUDINARY_API_KEY: str(),
  CLOUDINARY_API_SECRET: str(),
  CLIENT_URL: url(),
  ADMIN_URL: url(),
  APP_PASSWORD: str(),
  ADMIN_EMAIL: email(),
});
