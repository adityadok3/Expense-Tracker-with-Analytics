import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AuthenticatedUser } from "../types";

export function generateAccessToken(user: AuthenticatedUser): string {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    env.JWT_SECRET,
    { expiresIn: "1h" }
  );
}

export function generateRefreshToken(userId: string): string {
  return jwt.sign({ userId }, env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
}

export function verifyAccessToken(token: string): AuthenticatedUser {
  return jwt.verify(token, env.JWT_SECRET) as AuthenticatedUser;
}

export function verifyRefreshToken(token: string): { userId: string } {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as { userId: string };
}
