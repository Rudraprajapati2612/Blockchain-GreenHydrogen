import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware ,requireRole} from "../middleware/auth";
// import { relative } from "path";
// import { catchall } from "zod/mini";
// import { error } from "console";
const superAdminRouter = Router()
const prisma = new PrismaClient();

superAdminRouter.post("/approve-producer/:kycId",authMiddleware,requireRole(["SUPER_ADMIN"]), async (req,res) =>{

        try{
        const {action} = req.body;

        const kycId = req.params.kycId;

        const adminId = (req as any).user.id;

        const kycDetails = await prisma.producerKyc.findUnique({where : {id : kycId}});


        if(!kycDetails){
            return res.status(401).json({
                message : "No Kyc details Found"
            })
        }

        if(action == "APPROVE"){
            await prisma.producerKyc.update({
                where : {id : kycId},
                data : {approvedAt : new Date(),approvedBy : adminId}
            })

            await prisma.user.update ({
                where : {id : kycDetails.userId},
                data : {status : "ACTIVE"}
            })

            return res.json({
                message : "Procedure Request is Approved"
            })
        }else if(action =="REJECT"){
            await prisma.user.update({
                where : {id : kycDetails.userId},
                data: {status:"REJECT"}
            })


            return res.json({
                message : "Procedure Request is Rejected"
            })
        }

        res.status(400).json({
            message : "Invalid Action"
        })

    }catch(e:any){
            res.status(403).json({
                error : e.message
            })
    }
})


superAdminRouter.post("/approve-certifier/:kycId",authMiddleware,requireRole(["SUPER_ADMIN"]),async (req,res)=>{
    try {
    const {action}  = req.body;

    const kycId = req.params.kycId;
    const adminId = (req as any).user.id;
    const certifierDetails = await prisma.certifierKyc.findUnique({where : {id : kycId}})
    if(!certifierDetails){
        return res.status(401).json({
            message : "No Kyc details Found"
        })
    }
    if(action=="APPROVE"){
     await prisma.certifierKyc.update({
        where : {id : kycId},
        data : {approvedAt : new Date(),approvedBy : adminId}
    })

    await prisma.user.update({
        where : {id : certifierDetails.userId},
        data : {status : "ACTIVE"}
    })

    return res.json({
        message : "Certifier Approval is Done"
    })
}else if(action == "REJECT"){
    await prisma.user.update({
        where : {id :certifierDetails.userId },
        data : {status : "REJECT"}
    })
    res.json({
        message : "Certifier Request is Rejected"
    })
}

    return res.status(403).json({
        message : "Invalid Request"
    })

}catch(e:any){
    res.status(403).json({
        error : e.message
    })
}
})

export default superAdminRouter;