import { auth } from "../firebase admin config/config";

export async function verifyAccessToken(accessToken: string) {
  try {
    const decodedToken = await auth.verifyIdToken(accessToken, true);
    return decodedToken;
  } catch (err) {
    return err;
  }
}
