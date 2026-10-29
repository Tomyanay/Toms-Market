
import type { Request,NextFunction,Response } from "express";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

 function CheckAccess(req:Request,res:Response,next:NextFunction) {

    const checkTokenAuth=req.headers.authorization
    if(!checkTokenAuth?.startsWith('Bearer ')){return res.status(401).json({message:'Access Token does not exist'})}

    const token=checkTokenAuth.split(' ')[1]
    if(!token){return res.status(401).json({message:'Access Token does not exist'})}

    if (!process.env.ACCESS_TOKEN_SECRET){
        console.error("CRITICAL: ACCESS_TOKEN_SECRET is missing in environment variables.");
        return res.status(500).json({message:'Internal Server Error'})
    }

    try{
        const decoded=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET) 
        req.user=decoded as {user_id:string} 
        next()
    }
    catch(error){return res.status(401).json({message:'Invalid or expired access token'})}
}
export default CheckAccess