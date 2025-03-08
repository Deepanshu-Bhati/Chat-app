import { WebSocketServer } from "ws";
const wss =new WebSocketServer({port:8080});
const users=new Map();
import cors from 'cors'


import jwt from 'jsonwebtoken';
import express, { json } from 'express';
import { middleware } from "./middleware.js";
import {prisma} from './db.js';
const app=express();
app.use(express.json());
app.use(cors())

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




wss.on('connection',(ws)=>{
    ws.on('error',(error)=>{
        console.log("error is detected"+error);

    })

    ws.on('message',async(message,isBinary)=>{
        const msg=isBinary?message:message.toString();
        const data=JSON.parse(msg);
        const userId=data.userId;
        const senderId=data.senderId;
        await prisma.message({
        
        })
        if(data.type==="register"){

            users.set(userId,ws);
            const web= users.get(userId);
            web.send('user is now connected')
            console.log("user is created with userId "+ userId)
        }
        if(data.type === 'sentmessage'){
            const User=users.get(userId)
            User.send(JSON.stringify(data.message))
        }

    })
    console.log("user is connected");
})

app.listen(3000,()=>{
    console.log(`app is running on the port http://localhost:3000`)
})