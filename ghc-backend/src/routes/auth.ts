import { Router } from "express";
import dotenv from "dotenv"
import {email, z} from "Zod"
import { Prisma, Role } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
// import { password } from "bun";
// import { parse } from "path";
const auhtRouter = Router();
const prisma = new PrismaClient();
dotenv.config()

const registerSchema = z.object({
    email : z.email(),
    password : z.string().min(6),
    name : z.string(),
    role : z.enum(["CONSUMER","PRODUCER","CERTIFIER"])
});


auhtRouter.post("/register",async (req,res)=>{
    try{
    const parsedData = registerSchema.safeParse(req.body);
    

    if (!parsedData.success) {
        return res.status(400).json({
            message: "Validation failed",
            // errors: parsedData.error.errors,
        });
    }

    const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);
    const user  = await prisma.user.create({
        data : {
            email : parsedData.data.email,
            password : hashedPassword,
            role: parsedData.data.role,
            authProvider :  "LOCAL",
            status  : parsedData.data.role === "CONSUMER" ? "ACTIVE" : "PENDING",
            name : parsedData.data.name
        }
    })

   
    res.status(201).json({ message: "User registered successfully" ,user});
    }catch(e:any){
        res.status(400).json({ error: e.message });
    }
})


auhtRouter.post("/login",async (req,res)=>{
    const {email,password} = req.body ;
    const user  = await prisma.user.findUnique({where:{email}});
    if(!user||!user.password){
        return res.status(401).json({
            message : "all credentilas is required "
        })
    }

    const valid = await bcrypt.compare(password,user.password);
    if(!valid){
        return res.status(401).json({
            message : "Invalid Credentials "
        })
    }

    if (!process.env.JWT_SECRET) {
        return res.status(500).json({ message: "JWT secret not configured" });
    }

    const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET
    );

    res.status(200).json({
        message: "Login successful",
        token,
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name
        }
    });
});
export default auhtRouter;