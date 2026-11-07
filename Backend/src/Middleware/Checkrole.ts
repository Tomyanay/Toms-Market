
import type { Request,NextFunction,Response } from "express";
import { pool } from "../DB.js";

async function Checkrole(req:Request,res:Response,next:NextFunction){
    try{
      const user=req.user?.user_id
      const isAdmin=await pool.query('SELECT role FROM users WHERE user_id=$1',[user])
      if(isAdmin.rowCount===0){return res.status(404).json({message:'User was not found'})}
      if(isAdmin.rows[0].role!=='Admin'){return res.status(403).json({message:'Unauthorized User'})}
      next()
    }
    
    catch(error){return res.status(500).json({message:'Internal Server Error'})}     
}

export default Checkrole