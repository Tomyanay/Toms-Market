
import express from 'express'
import {body,param,validationResult} from 'express-validator'
import { pool } from '../DB.js'
import { categories } from '../Data/HomeData.js'

export const Adminroute=express.Router()

/* Users */

Adminroute.get('/users',async (req,res)=>{
  
    const {user}=req.query
    const searchTerm:string =`%${user}%`

    try{
      const users=await pool.query("SELECT username FROM users WHERE role != 'Admin' AND username ILIKE $1 ",[searchTerm])
      if(users.rowCount===0){return res.status(200).json({message:'No users found'})}
      else {return res.status(200).send(users.rows)}
    }
    catch(error){
      console.error('Admin user',error)
      res.status(500).json({message:'Internal Server Error'})
    }
})

Adminroute.post('/setrole',
  body('username').notEmpty().withMessage('Username is required').isLength({min:2,max:20}).withMessage('Username must be between 2 and 20 characters'),
  async (req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){return res.status(400).json({message:errors.array()[0]?.msg})}

    const {username}=req.body
    const client=await pool.connect()

    try{

      const userexists=await client.query("SELECT username FROM users WHERE username=$1 AND role!='Admin' ",[username])
      if(userexists.rowCount===0){return res.status(403).json({message:'User must exist and not be admin'})}

      await client.query("UPDATE users SET role = 'Admin' WHERE username=$1",[username])
      res.status(200).json({message:'User was updated'})
    }

    catch(error){res.status(500).json({message:'Internal Server Error'})}
    finally{client.release()}
})


Adminroute.delete('/deleteuser/:username',
  param('username').notEmpty().withMessage('Username is required').isLength({min:2,max:20}).withMessage('Username must be between 2 and 20 characters'),
  async(req,res)=>{

  const errors=validationResult(req)
  if(!errors.isEmpty()){return res.status(400).json({message:errors.array()[0]?.msg})}

  const {username}=req.params
  const client=await pool.connect()

  try{
    await client.query('BEGIN')

    const userexists=await client.query("SELECT username FROM users WHERE username=$1 AND role!='Admin' ",[username])
  
    if(userexists.rowCount===0){
      await client.query('ROLLBACK')
      return res.status(403).json({message:'username is invalid'})}
 
    await client.query(`
      UPDATE products 
      SET reviews = (
      SELECT COALESCE(jsonb_agg(elem), '[]'::jsonb)
      FROM jsonb_array_elements(reviews) AS ELEM 
      WHERE elem->>'reviewerName' <> $1::text)`,[username])

    await client.query('DELETE FROM users WHERE username=$1',[username])

    await client.query('COMMIT');
    res.status(200).json({message:'User was Deleted'})
    }

  catch(error){
    console.error('Admin Delete User',error)
    await client.query('ROLLBACK')
    res.status(500).json({message:'Internal Server Error'})
    }

  finally{client.release()}
})

/* Products */

Adminroute.get('/products',async (req,res)=>{
 
    const {product}=req.query
    const searchTerm:string =`%${product}%`

    try{
      const users=await pool.query("SELECT product_id,title,category,price,newprice,rating,description,images,amount FROM products WHERE title ILIKE $1 ",[searchTerm])
      if(users.rowCount===0){return res.status(200).json({message:'No products found'})}
      else {return res.status(200).send(users.rows)}
    }
    catch(error){
      console.error('Admin Get Products',error)
      res.status(500).json({message:'Internal Server Error'})
    }
})


Adminroute.put('/updateproduct',
  body('product_id').exists().withMessage('Product_id is required').isNumeric().withMessage('Product_id must be a number'),
  body('title').notEmpty().withMessage('title is required').isLength({min:3,max:255}).withMessage('title must be between 3 and 255 characters'),
  body('rating').notEmpty().withMessage('rating is required').isNumeric().withMessage('Rating must be a number').isFloat({min:1,max:5}).withMessage('Rating must be between 1 and 5'),
  body('price').notEmpty().withMessage('price is required').isNumeric().withMessage('price must be a number').isFloat({min:0,max:100000}).withMessage('price must be between 0-100,000$'),
  body('newprice').notEmpty().withMessage('newprice is required').isNumeric().withMessage('newprice must be a number').isFloat({min:0,max:100000}).withMessage('newprice must be between 0-100,000$'),
  body('images').notEmpty().withMessage('images is required').isLength({min:3,max:255}).withMessage('images must be between 3 and 255 characters'),
  body('category').notEmpty().withMessage('category is required').isIn(categories).withMessage('Invalid category'),
  body('description').notEmpty().withMessage('description is required').isLength({min:3,max:255}).withMessage('description must be between 3 and 255 characters'),
  body('amount').notEmpty().withMessage('amount is required').isNumeric().withMessage('amount must be a number').isFloat({min:10,max:500}).withMessage('amount must be between 10 and 500'),
  async (req,res)=>{
  
  const errors=validationResult(req)
  if(!errors.isEmpty()){return res.status(400).json({message:errors.array()[0]?.msg})}

  const {product_id,title,rating,price,newprice,images,category,description,amount}=req.body

   if(price<=newprice){return res.status(400).json({message:'Price must be bigger then the  newprice'})}
   if(!/\.(jpg|jpeg|png|webp|avif|gif|svg)(\?.*)?$/i.test(images)){return res.status(400).json({message:'Invalid Image URL'})}
  
  try{
    await pool.query(`
     UPDATE products 
     SET title=$1,rating=$2,price=$3,newprice=$4,images=$5,category=$6,description=$7,amount=$8 WHERE product_id=$9 `,
     [title,rating,price,newprice,images,category,description,amount,product_id]) 
     
    res.status(200).send('Update Done successfuly')
  }

  catch(error){
    console.error('Admin Edit Products',error)
    return res.status(500).json({message:'Internal Server Error'})
  }
})


Adminroute.delete('/deleteproduct/:product_id',
 param('product_id').exists().withMessage('Product_id is required').isNumeric().withMessage('Product_id must be a number'),
 async (req,res)=>{

 const errors=validationResult(req)
 if(!errors.isEmpty()){return res.status(400).json({message:errors.array()[0]?.msg})}

 const {product_id}=req.params

 try{
   await pool.query('DELETE FROM products WHERE product_id=$1',[product_id])
   res.status(200).send('Product was deleted successfuly')
 }

 catch(error){
  console.error('Admin Delete Products',error)
  res.status(500).json({message:'Internal Server Error'})
  } 
})

Adminroute.post('/addproduct',
  body('title').notEmpty().withMessage('title is required').isLength({min:3,max:255}).withMessage('title must be between 3 and 255 characters'),
  body('rating').notEmpty().withMessage('rating is required').isNumeric().withMessage('Rating must be a number').isFloat({min:1,max:5}).withMessage('Rating must be between 1 and 5'),
  body('price').notEmpty().withMessage('price is required').isNumeric().withMessage('price must be a number').isFloat({min:0,max:100000}).withMessage('price must be between 0-100,000$'),
  body('images').notEmpty().withMessage('images is required').isLength({min:3,max:255}).withMessage('images must be between 3 and 255 characters'),
  body('category').notEmpty().withMessage('category is required').isIn(categories).withMessage('Invalid category'),
  body('description').notEmpty().withMessage('description is required').isLength({min:3,max:255}).withMessage('description must be between 3 and 255 characters'),
  body('amount').notEmpty().withMessage('amount is required').isNumeric().withMessage('amount must be a number').isFloat({min:10,max:500}).withMessage('amount must be between 10 and 500'),
  async (req,res)=>{
  
  const errors=validationResult(req)
  if(!errors.isEmpty()){return res.status(400).json({message:errors.array()[0]?.msg})}

  const {title,rating,price,images,category,description,amount}=req.body

  if(!/\.(jpg|jpeg|png|webp|avif|gif|svg)(\?.*)?$/i.test(images)){return res.status(400).json({message:'Invalid Image URL'})}

  try{
   await pool.query(`
     INSERT INTO products(title,rating,price,newprice,images,category,description,amount)
     VALUES($1,$2,$3,0.00,$4,$5,$6,$7)`,[title,rating,price,images,category,description,amount]) 
     
   res.status(200).send('Item was created Successfuly!!')
  }

  catch(error){
    console.error('Admin Add Products',error)
    return res.status(500).json({message:'Internal Server Error'})}
})