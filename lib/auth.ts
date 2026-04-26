import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectDB } from "./mongodb";
import User from "./models/User";
import { MOCK_MODE, MOCK_USER, MOCK_TOKEN_USER_ID } from "./mockData";

const JWT_SECRET = process.env.JWT_SECRET || "digischool-super-secret-key-change-in-production";
const JWT_EXPIRES_IN = "7d";
const COOKIE_NAME = "digischool_token";

export function signToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
}

export async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded) return null;

  // In MOCK_MODE return a static user so the dashboard works without DB.
  if (MOCK_MODE && decoded.userId === MOCK_TOKEN_USER_ID) {
    return MOCK_USER;
  }

  await connectDB();
  const user = await User.findById(decoded.userId).select("-password");
  return user;
}

export { COOKIE_NAME, JWT_SECRET };
