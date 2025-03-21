import { prisma } from "./db.js";
import jwt from 'jsonwebtoken'
import cookieParser from "cookie-parser"; 
export const middleware=async (req,res,next)=>{
    

        const token=req.cookies.auth_token;
        // if (!authorization) {
        //     return res.status(401).json({ error: "Unauthorized: No token provided" });
        // }
        // console.log(authorization);
        // const token =authorization.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "Unauthorized: Invalid token format" });
        }
        const  decoded=jwt.verify(token,process.env.JWT_SECRET);
        console.log(decoded)
        if (!decoded || !decoded.email) {
            return res.status(401).json({ error: "Unauthorized: Invalid token data" });
        }
        const email=decoded.email;
        console.log(decoded+"error");
        console.log(token);
        console.log(email);
        const user=await prisma.user.findUnique({where:{
            email:email
        }})
        if (!user) {
            return res.status(401).json({ error: "Unauthorized: User not found" });
        }

        

        next();
    

}