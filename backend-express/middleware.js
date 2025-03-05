import { prisma } from "./db.js";
import jwt from 'jsonwebtoken'
export const middleware=async (req,res,next)=>{
    

        const header=req.headers;
        const authorization=header.authorization;
        if (!authorization) {
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }
        console.log(authorization);
        const token =authorization.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "Unauthorized: Invalid token format" });
        }
        const  decoded=jwt.decode(token);
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

        res.cookie("auth_token", token, {
            httpOnly: true, // Prevents access from JavaScript (security feature)
            secure: process.env.NODE_ENV === "production", // Ensures cookies are sent over HTTPS in production
            sameSite: "Strict", // Prevents CSRF attacks
            maxAge: 60 * 60 * 1000 // Cookie expiration (1 hour)
        });


        next();
    

}