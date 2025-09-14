// src/middleware/authMiddleware.ts
// src/middleware/authMiddleware.ts
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config();
export interface AuthRequest extends Request {
  user?: { userId: string; role: string };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    return res.status(500).json({ message: "JWT secret not configured" });
  }
  try {
    const decoded = jwt.verify(token, jwtSecret) as { userId: string; role: string };
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
  }


  export function requireRole(roles: string[]) {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
      console.log('Auth Request User:', req.user);  // Add this line for debugging
  
      if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }
      next();
    };
  }
  
  
