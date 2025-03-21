import { WebSocketServer } from "ws";
import { v4 as uuidv4 } from "uuid";
const wss =new WebSocketServer({port:8080});
const users=new Map();
import cors from 'cors'


import jwt from 'jsonwebtoken';
import express, { json } from 'express';
import { middleware } from "./middleware.js";
import {prisma} from './db.js';
const app=express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",  // ✅ Your frontend URL
    credentials: true,  // ✅ Allows cookies to be sent/received
  }));

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

app.post('/Signup',async (req,res)=>{
    const {email,firstname,lastname,password}=req.body;
    console.log(email+firstname+lastname+password);
    

    try{
   
        const user=await prisma.user.create({data:{
            email,firstname,lastname,password}})
            console.log(user);
            
            res.status(200).json({message:"user is created succesfully"});
        }catch(error){
            res.status(402).json({message:"user is present with this name "})
        }

})

app.post('/login',async (req,res)=>{
    const {email,password}=req.body;
    const user= await prisma.user.findUnique({where:{
        email:email
    }})
    try{

        if(user.email){
            
            const token=jwt.sign({email:email},SECRET_KEY);
            console.log(token);
            res.setHeader("Authenticate",`bearer ${token}`);

            res.cookie("auth_token", token, {
                httpOnly: true,
                secure: false,
                sameSite: "Strict",
                maxAge: 60 * 60 * 1000 // 1 hour
            });
            res.status(200).json({
                message:"user is login ",
                token:token
            })
        }
    }catch(err){
        res.status(403).json({message:"enter correct details "})
    }
})



app.get('/',middleware,(req,res)=>{
    
    res.send("user is connected");
})


const client=new Map();
wss.on('connection',(ws,req)=>{
    const userId = req.url.split("?userId=")[1]; 
    Map.put(userId,ws);

    ws.on('message',(data,isBinary)=>{
        const msg=isBinary?data:data.toString()
        console.log(msg);
    })
})

app.listen(3001,()=>{
    console.log(`app is running on the port http://localhost:3000`)
})