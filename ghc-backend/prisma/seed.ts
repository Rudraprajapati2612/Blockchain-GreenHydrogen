import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

const prisma = new PrismaClient();
dotenv.config();

async function main() {
  if (!process.env.SuperAdmin_Email || !process.env.SuperAdmin_Password) {
    throw new Error(" SuperAdmin_Email or SuperAdmin_Password not set in .env");
  }

  const password = await bcrypt.hash(process.env.SuperAdmin_Password, 10);

  await prisma.user.upsert({
    where: { email: process.env.SuperAdmin_Email },
    update: {}, // do nothing if already exists
    create: {
      email: process.env.SuperAdmin_Email,
      password,
      role: "SUPER_ADMIN",
      authProvider: "LOCAL",
      status: "ACTIVE",
      name: "Super Admin",
    },
  });

  console.log("✅ Super Admin seeded!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
