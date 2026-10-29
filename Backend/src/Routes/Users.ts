
import express from 'express'

import { pool } from '../DB.js'

import { body,param,validationResult} from 'express-validator'

import { nanoid } from 'nanoid'

import  bcrypt   from 'bcrypt'

import dotenv from 'dotenv'

import jwt from 'jsonwebtoken'

import CheckAccess from '../Middleware/accesstoken.js'

import crypto from 'crypto'

dotenv.config()

export const User_Router=express.Router()

User_Router.post('/add_user',
 body('username').notEmpty().withMessage('Username is required').isLength({min:2,max:20}).withMessage('Username must be between 2 and 20 characters'),
 body('password').notEmpty().withMessage('Password is required').isLength({min:8,max:25}).withMessage('Password must be between 8 and 25 characters'),
 async(req,res)=>{

  const errors=validationResult(req)
  if(!errors.isEmpty()){return res.status(400).json({message:errors.array()[0]?.msg})}

  const {username,password}=req.body
  const user_id=nanoid()

  const hashedPassword=await bcrypt.hash(password,10)

  const client=await pool.connect()

  try{
   const Username_Duplicate= await client.query('SELECT username FROM users WHERE username=$1',[username])
   if(Username_Duplicate.rowCount!==0){return res.status(409).json({message:'username already exists'})}

   await client.query('INSERT INTO users(user_id,username,password) VALUES($1,$2,$3)',[user_id,username,hashedPassword])
   return res.status(200).json({message:'User was added'})}

  catch(error){
    console.error('New User',error)
    return res.status(500).json({message:'Internal server error'})}

  finally{client.release()}
})

User_Router.post('/login',
     body('username').notEmpty().withMessage('Username is required').isLength({min:2,max:20}).withMessage('Username must be between 2 and 20 characters'),
     body('password').notEmpty().withMessage('Password is required').isLength({min:8,max:25}).withMessage('Password must be between 8 and 25 characters'),
     async (req,res)=>{
     
     const errors=validationResult(req)
     if(!errors.isEmpty()){return res.status(400).json({message:errors.array()[0]?.msg})}

     const {username,password}=req.body
    
     const client=await pool.connect()

     try{
      const Results=await client.query('SELECT user_id,password,role,is_dark FROM users WHERE username=$1',[username])
      if(Results.rows.length===0){return res.status(401).json({message:'Invalid username or password'})}
      if(!await bcrypt.compare(password,Results.rows[0].password)){return res.status(401).json({message:'Invalid username or password'})}
    
      if(!process.env.ACCESS_TOKEN_SECRET||!process.env.REFRESH_TOKEN_SECRET){throw new Error("Tokens secret keys do not exist")}

      const user_id=Results.rows[0].user_id
      
      const AccessToken=jwt.sign({user_id},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'15m'})
      const RefreshToken=jwt.sign({user_id},process.env.REFRESH_TOKEN_SECRET,{expiresIn:'15d'})

      const hashedtoken=crypto.createHash('sha256').update(RefreshToken).digest('hex') /* Hashing the token so it will be more secure and harder to find  */

      await client.query('DELETE FROM refresh_table WHERE user_id=$1',[user_id]) 
      await client.query(`INSERT INTO refresh_table(user_id,token,expired_at) values($1,$2, NOW() + INTERVAL '15 days')`,[user_id,hashedtoken])
    
      res.cookie('Refresh_Token',RefreshToken,{httpOnly:true,sameSite:'lax',secure:false,maxAge:1000 * 60 * 60 * 24 * 15})
      
      return res.status(200).json({
       username:username,
       role:Results.rows[0].role,
       isdark:Results.rows[0].is_dark,
       accesstoken:AccessToken})
  }
     catch(error){
        console.error('Login',error)
        return res.status(500).json({message:'Internal server error'})}
     finally{client.release()}
})


User_Router.post('/refresh',async (req,res)=>{
    const RefreshToken=req.cookies.Refresh_Token

    if(!RefreshToken){return res.status(401).json({message:'token does not exist'})}

    const client=await pool.connect()

    try{

      if(!process.env.REFRESH_TOKEN_SECRET){throw new Error("Refresh Token secret key does not exists")}

      const decoded=jwt.verify(RefreshToken,process.env.REFRESH_TOKEN_SECRET)

      const user=decoded as {user_id:string}
      const user_id=user.user_id /* Getting user id for creating the new access token */
      
      const hashedtoken=crypto.createHash('sha256').update(RefreshToken).digest('hex')  /* Getting our hashed token to check if exists already */

      const IsRefreshExist=await client.query('SELECT user_id FROM refresh_table WHERE token = $1 AND user_id= $2 ',[hashedtoken,user_id]) 
    
      if(IsRefreshExist.rows.length===0){return res.status(401).json({message:'Refresh token doesnt belong to any user'})} /* Checking if our token exists for our user */

      if(!process.env.ACCESS_TOKEN_SECRET){throw new Error("Access Token secret key does not exists")}

      const AccessToken=jwt.sign({user_id},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'15m'}) /* Creating the new access token */

      const userinfo=await client.query('SELECT username,role,is_dark FROM users WHERE user_id=$1',[user_id])
    
      return res.status(200).json({accesstoken:AccessToken,
       username:userinfo.rows[0].username,
       role:userinfo.rows[0].role,
       isdark:userinfo.rows[0].is_dark})
    }
    catch(error){
      console.error('Refresh',error)
      return res.status(401).json({message:'Refresh token is invalid or expired'})}

    finally{client.release()}
})


User_Router.delete('/signout', async (req,res)=>{
    const RefreshToken=req.cookies.Refresh_Token /* Checking if our token exists */
    if(!RefreshToken){return res.status(401).json({message:'There is no refresh token'})}

    /* Deleting the token from our DB and the cookie */
    try{
         const hashedtoken=crypto.createHash('sha256').update(RefreshToken).digest('hex')
         await pool.query('DELETE FROM refresh_table WHERE token=$1',[hashedtoken])

         res.clearCookie('Refresh_Token',{httpOnly:true,sameSite:'lax',secure:false})
         return res.status(200).json({message:'Sign out was succesfull'})
        }

    catch(error){
      console.error('Signout',error)
      return res.status(500).json({message:'Internal server error'})
    }
})

User_Router.patch('/lightmode',CheckAccess,async (req,res)=>{
     const user=req.user
     const {lightmode}=req.body
       
     if(typeof lightmode!=='boolean'){return res.status(400).json({message:'Lightmode must be a boolean'})}
       try{
         await pool.query('UPDATE users SET is_dark=$1 WHERE user_id=$2 ',[lightmode,user?.user_id])
         return res.status(200).json({message:'Light mode was updated'})
       }
       catch(error){
        console.error('Light Mode',error)
        return res.status(500).json({message:'Internal server error'})
      }
   })    


User_Router.put('/update',CheckAccess,
 body('username').notEmpty().withMessage('Username is required').isLength({min:2,max:20}).withMessage('Username must be between 2 and 20 characters'),
 body('password').notEmpty().withMessage('Password is required').isLength({min:8,max:25}).withMessage('Password must be between 8 and 25 characters'),
 async (req,res)=>{

  const errors=validationResult(req)
  if(!errors.isEmpty()){return res.status(400).json({message:errors.array()[0]?.msg})}

  const {username,password}=req.body

  const hashedpassword=await bcrypt.hash(password,10)
  
  const user_id=req.user?.user_id
  
  const client=await pool.connect()

 try{

   const Username_Duplicate= await client.query('SELECT username FROM users WHERE username=$1',[username])
   if(Username_Duplicate.rowCount!==0){return res.status(409).json({message:'username already exists'})}

    await client.query('UPDATE users SET username=$1,password=$2 WHERE user_id=$3',[username,hashedpassword,user_id])
    res.status(200).json({message:'User Update was Successfull'})
 }

 catch(error){
    console.error('Update User',error)
    return res.status(500).json({message:'Internal Server Error'})
}

 finally{client.release()}
  
})


User_Router.delete('/delete/:username',CheckAccess,
  param('username').notEmpty().withMessage('Username is required').isLength({min:2,max:20}).withMessage('Username must be between 2 and 20 characters'),
  async(req,res)=>{

  const errors=validationResult(req)
  if(!errors.isEmpty()){return res.status(400).json({message:errors.array()[0]?.msg})}

  const {username}=req.params
  const user_id=req.user?.user_id

  const client=await pool.connect()

  try{
    await client.query('BEGIN')

    const userexists=await client.query('SELECT user_id FROM users WHERE username=$1 AND user_id=$2',[username,user_id])

    if(userexists.rowCount===0){
      await client.query('ROLLBACK')
      return res.status(401).json({message:'username is invalid'})}
      
    await client.query(`
      UPDATE products 
      SET reviews = (
      SELECT COALESCE(jsonb_agg(elem), '[]'::jsonb)
      FROM jsonb_array_elements(reviews) AS ELEM 
      WHERE elem->>'reviewerName' <> $1::text)`,[username])

    await client.query('DELETE FROM users WHERE username=$1',[username])

    res.clearCookie('Refresh_Token',{httpOnly:true,sameSite:'lax',secure:false})

    await client.query('COMMIT');
    res.status(200).json({message:'User was Deleted'})
    }

  catch(error){
    await client.query('ROLLBACK');
    console.error('User Delete',error)
    res.status(500).json({message:'Internal Server Error'})
    }

  finally{client.release()}
})


