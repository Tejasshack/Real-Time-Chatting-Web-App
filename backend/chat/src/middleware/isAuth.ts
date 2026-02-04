import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

interface AuthJwtPayload extends JwtPayload {
  id: string;
  email: string;
}

/*
  🔒 Verify JWT only (NO DB)
*/
const verifyToken = (token: string): AuthJwtPayload => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  const decoded = jwt.verify(token, secret);

  if (
    typeof decoded !== "object" ||
    decoded === null ||
    !("id" in decoded) ||
    !("email" in decoded)
  ) {
    throw new Error("Invalid token payload");
  }

  return decoded as AuthJwtPayload;
};

/*
  🔐 Chat Service Auth Middleware
*/
export const isAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyToken(token as string);

    // ✅ Attach decoded identity ONLY
    req.user = {
      id: payload.id,
      email: payload.email,
    };

    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
