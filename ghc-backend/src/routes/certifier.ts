import { Router } from "express";
import { authMiddleware, requireRole } from "../middleware/auth";
import { PrismaClient } from "@prisma/client";
import { z } from "Zod";
import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth";
const certifierRouter = Router();
const prisma = new PrismaClient();

const certifierKycSchema = z.object({
  fullName: z.string(),
  licenseNumber: z.string(),
  qualification: z.string().optional(),
  document: z.string().url(),
});

certifierRouter.post(
  "/kyc",
  authMiddleware,
  requireRole(["CERTIFIER"]),
  async (req:AuthRequest, res:Response) => {
    try {
      const parsed = certifierKycSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          message: "Invalid information",
          errors: parsed.error,
        });
      }

      const { fullName, licenseNumber, qualification, document } = parsed.data;

      const kyc = await prisma.certifierKyc.create({
        data: {
          userId: req.user!.userId, // from authMiddleware
          fullName,
          licenseNumber,
          qualification,
          document,
          approvedAt: null, // super admin approves later
        },
      });

      res.status(201).json({
        message: "Certifier KYC submitted",
        kyc,
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  }
);

export default certifierRouter;
