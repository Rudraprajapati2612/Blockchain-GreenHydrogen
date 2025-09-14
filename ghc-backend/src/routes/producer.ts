import { Router } from "express";
import { authMiddleware, requireRole } from "../middleware/auth";
import { PrismaClient } from "@prisma/client";
import { z } from "Zod";
import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth";
const producerRouter = Router();
const prisma = new PrismaClient();

const producerKycSchema = z.object({
  plantName: z.string(),
  location: z.string(),
  document: z.string().url(),
//   certifierId: z.string().uuid(), // certifier assigned to this producer
});

producerRouter.post(
    "/kyc",
    authMiddleware,
    requireRole(["PRODUCER"]),
    async (req:AuthRequest, res:Response) => {
      try {
        const producerKycSchema = z.object({
          plantName: z.string(),
          location: z.string(),
          document: z.string().url(),
        });
  
        const parsed = producerKycSchema.safeParse(req.body);
        if (!parsed.success) {
          return res.status(400).json({
            message: "Invalid information",
            errors: parsed.error.format(),
          });
        }
  
        const { plantName, location, document } = parsed.data;
  
        const kyc = await prisma.producerKyc.create({
          data: {
            userId: req.user!.userId,  // Correct foreign key reference
            plantName,
            location,
            document,
            approvedAt: null,          // Pending approval
            approvedBy: null,
          },
        });
  
        res.status(201).json({
          message: "Producer KYC submitted for admin approval",
          kyc,
        });
      } catch (e: any) {
        res.status(500).json({ error: e.message });
      }
    }
  );
  

export default producerRouter;
