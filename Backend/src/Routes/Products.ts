
import express  from "express";
import { pool } from '../DB.js'
import CheckAccess from "../Middleware/accesstoken.js";
import { body,query,param,validationResult} from 'express-validator'
import { categories,sortdata,sortype } from "../Data/HomeData.js";
import type { reviewperson } from "../types.js";

export const Product_Route=express.Router() 

Product_Route.get('/search',
   query('product').notEmpty().withMessage('product is required')
  ,async (req,res)=>{
   const errors=validationResult(req)

   if(!errors.isEmpty()){return res.status(400).json({message:errors.array()[0]?.msg})}

   const {product}=req.query

   const searchTerm:string = `%${product}%`;

   try{
      const result= await pool.query(`
        SELECT * FROM products 
        WHERE title ILIKE $1 OR category ILIKE $1`,[searchTerm])
      if(result.rowCount===0){return res.status(200).json({message:`No Product was found with the name "${product}" `})}

      return res.status(200).send(result.rows)
   }

   catch(error){
    console.log('Search',error)
    return res.status(500).json({message:'Internal server error '})
  }
})

Product_Route.get('/getproducts',
   query('category').notEmpty().withMessage('category is required').isIn(categories).withMessage('Invalid category'),
   query('sort').notEmpty().withMessage('sort is required').isIn(sortdata).withMessage('Invalid Sort Name'),
   query('order').notEmpty().withMessage('order is required').isIn(sortype).withMessage('Invalid order Type'),

  async(req,res)=>{

    const errors=validationResult(req)
    if(!errors.isEmpty()){return res.status(400).json({message:errors.array()[0]?.msg})}

    const {category,sort,order}=req.query

    /* Checking condition again only when we are using forced sql injection */
    if(!sortdata.includes(sort) || !sortype.includes(order)){return res.status(400).json({message:'Invalid sort name or order type'})}

    try{      
        if(category==='All'){ 
          if(order==='base'){
            const products=await pool.query('SELECT * FROM products')
            res.status(200).send(products.rows)
            return
          }
          
          else {
            const products=await pool.query(`
            SELECT *,CASE WHEN newprice>0 THEN newprice ELSE price END AS currentprice FROM products
            ORDER BY ${sort} ${order}`)
            res.status(200).send(products.rows)
            return}
        }

        else{
          if(order==='base'){
            const products=await pool.query('SELECT * FROM products WHERE category = $1',[category])
            res.status(200).send(products.rows)
            return}

          else {
            const products=await pool.query(`
            SELECT *,CASE WHEN newprice>0 THEN newprice ELSE price END AS currentprice FROM products
            WHERE category = $1
            ORDER BY ${sort} ${order}`,[category])
            res.status(200).send(products.rows)
            return}
          }
        }

    catch(error){
      console.error('GetItems Home',error)
      return res.status(500).json({message:'Internal server error'})
    }
}) 

Product_Route.get('/quantity/:Product_id',
 param('Product_id').exists().withMessage('Product_id is required').isNumeric().withMessage('Product_id must be a number'),
 CheckAccess,async (req,res)=>{

    const errors=validationResult(req)
    if(!errors.isEmpty()){return res.status(400).json({message:errors.array()[0]?.msg})}
    
    const {Product_id}=req.params
    const user_id=req.user?.user_id

    try{
     const result = await pool.query(`
        SELECT c.quantity 
        FROM products p 
        LEFT JOIN Cart c ON p.product_id = c.product_id AND c.user_id = $1 
        WHERE p.product_id = $2`, [user_id,Product_id]);
  
     if(result.rowCount===0){return res.status(400).json({message:'Invalid Id'})}
     if(!result.rows[0].quantity){return res.status(200).send(0)}
     else{return res.status(200).send(result.rows[0].quantity)}
    }
    catch(error){
      console.error('Get quantity',error)
      return res.status(500).json({message:'Internal server error'})
    }
})


Product_Route.post('/changequantity',CheckAccess,
   body('Product_id').exists().withMessage('product_id is required').isNumeric().withMessage('Product_id must be a number'),
   body('type').notEmpty().withMessage('type is required').isIn(['+', '-']).withMessage('Operator must be either + or -'),async (req,res)=>{
  
   const errors=validationResult(req)
   if(!errors.isEmpty()){return res.status(400).json({message:errors.array()[0]?.msg})}

   const {Product_id,type}=req.body
   const user_id=req.user?.user_id

   const client=await pool.connect()

   const userProduct=await client.query(`
    SELECT c.quantity,p.amount FROM products AS p 
    LEFT JOIN Cart AS c ON p.product_id = c.product_id AND c.user_id=$1
    WHERE p.product_id=$2`,[user_id,Product_id])

    if(userProduct.rowCount===0){return res.status(400).json({message:'Invalid Id'})}

    const Product_Info=userProduct.rows[0]
    
   try{
     await client.query('BEGIN')
   
     if(type==='+'){
       if(Product_Info.amount===0){
        await client.query('ROLLBACK');
        return res.status(403).json({message:'Out of Stock'})}

       if(Product_Info.quantity===null){
          await client.query('INSERT INTO Cart(user_id,product_id,quantity) VALUES($1,$2,1)',[user_id,Product_id])
          await client.query('COMMIT');
          res.status(200).json({quantity:1})}

       else{
          const quantity=await client.query('UPDATE Cart SET quantity=quantity+1 WHERE user_id=$1 AND product_id=$2  RETURNING quantity',[user_id,Product_id])
          await client.query('COMMIT');
          res.status(200).send(quantity.rows[0])}
     }

     else{
       if(Product_Info.quantity===null || Product_Info.amount===0 && Product_Info.quantity===0){
        await client.query('ROLLBACK')
        return res.status(403).json({message:'Action cannot be done'})
      }

         if(Product_Info.quantity===1){
           await client.query('DELETE FROM Cart WHERE user_id=$1 AND product_id=$2 ',[user_id,Product_id])
           await client.query('COMMIT');
           res.status(200).json({quantity:0})}

         else {
          const quantity=await client.query('UPDATE Cart SET quantity=quantity-1 WHERE user_id=$1 AND product_id=$2  RETURNING quantity',[user_id,Product_id])
          await client.query('COMMIT');
          res.status(200).send(quantity.rows[0])}}}

   catch (error){
    console.error('Change Quantity',error)
    await client.query('ROLLBACK')
    return res.status(500).json({message:'Internal server error'})}

   finally{client.release()}
})


Product_Route.post('/setcomment',CheckAccess,
  body('rating').exists().withMessage('Rating is required').isNumeric().withMessage('Rating must be a number').isFloat({min:1,max:5}).withMessage('Rating must be between 1-5'),
  body('comment').notEmpty().withMessage('Comment is required').isLength({min:1,max:500}).withMessage('Comment must be between 1 and 500 characters'),
  body('product_id').exists().withMessage('product_id is required').isNumeric().withMessage('Product_id must be a number'),
  body('reviewerName').notEmpty().withMessage('reviewerName is required').isLength({min:2,max:20}).withMessage('reviewerName must be between 2 and 20 characters'),
  body('role').notEmpty().withMessage('role is required').isIn(['Client','Admin']).withMessage('role can only be Client or Admin'),

  async (req,res)=>{

    const errors=validationResult(req)
    if(!errors.isEmpty()){return res.status(400).json({message:errors.array()[0]?.msg})}

    const {comment,rating,role,product_id,reviewerName}=req.body

    const client=await pool.connect()
    
    const user_id=req.user?.user_id

    try{
     
      const userexists=await client.query('SELECT username FROM users WHERE user_id=$1',[user_id]) // Checks if the user wrote the right name of the reviewer 
      if(userexists.rowCount===0){return res.status(401).json({message:'username is invalid'})}

      const commentexists=await client.query(`SELECT EXISTS 
       (SELECT 1 FROM products CROSS JOIN LATERAL jsonb_array_elements(reviews) 
       AS elem WHERE product_id = $1 
       AND elem->>'reviewerName' = $2)`,[product_id,reviewerName])

      if(commentexists.rows[0].exists){
        await client.query(`
         UPDATE products 
         SET reviews = (
         SELECT jsonb_agg(
         CASE 
            WHEN elem->>'reviewerName' = $4 THEN jsonb_build_object(
              'date', NOW(),
              'rating', $1::int,
              'comment', $2::text,
              'role',$3::text,
              'reviewerName', $4::text)
              ELSE elem
            END)
        FROM jsonb_array_elements(reviews) AS elem)
        WHERE product_id = $5`, [rating, comment,role,reviewerName, product_id]);
        return res.status(200).send('Row was succesfuly updated')
      }

      else{ 
        await client.query(`UPDATE products 
          SET reviews = COALESCE(reviews, '[]'::jsonb) || jsonb_build_array(
          jsonb_build_object(
          'date',NOW(),
          'rating',$1::int,
          'comment',$2::text,
          'role',$3::text,
          'reviewerName',$4::text))
          WHERE product_id = $5::int`,[rating,comment,role,reviewerName,product_id])
          return res.status(200).send('Row was succesfuly added')
      }
    }
    catch(error){
      console.error('Set Comment',error)
      return res.status(500).json({message:'Internal Server Error'})}

    finally{client.release()}
})

Product_Route.delete('/deletecomment/:reviewerName/:product_id',CheckAccess
,param('reviewerName').notEmpty().withMessage('reviewerName is required').isLength({min:2,max:20}).withMessage('reviewerName must be between 2 and 20 characters')
,param('product_id').exists().withMessage('product_id is required').isNumeric().withMessage('id must be a number')
,async (req,res)=>{

    const errors=validationResult(req)
    if(!errors.isEmpty()){return res.status(400).json({message:errors.array()[0]?.msg})}

    const {reviewerName,product_id}=req.params

    const user_id=req.user?.user_id

    const client=await pool.connect()

    try{

      await client.query('BEGIN')

      const userexists=await client.query('SELECT username,role FROM users WHERE user_id=$1',[user_id])

      if(userexists.rowCount===0){
        await client.query('ROLLBACK');
        return res.status(401).json({message:'username is invalid'})
      }

      const user=userexists.rows[0]

      const reviews = await client.query('SELECT reviews FROM products WHERE product_id = $1', [product_id])

      if(reviews.rowCount===0){
        await client.query('ROLLBACK');
        return res.status(400).json({ message:'Product not found'})
      }

      const review:reviewperson[]=reviews.rows[0].reviews || []
      const target_reviewer=review.find((v)=>v.reviewerName===reviewerName)

      if(!target_reviewer){
        await client.query('ROLLBACK');
        return res.status(404).json({message:'Review was not found'})
      }

      const checkname=target_reviewer.reviewerName===user.username
      const checkrole=user.role==='Admin' && target_reviewer.role!=='Admin'

      if(!checkrole && !checkname){
        await client.query('ROLLBACK');
        return res.status(403).json({message:'Unauthorized to delete this comment'})
      }

      await client.query(`
       UPDATE products 
       SET reviews = (
       SELECT COALESCE(jsonb_agg(elem), '[]'::jsonb)
       FROM jsonb_array_elements(reviews) AS elem
       WHERE elem->>'reviewerName' <> $1::text)
       WHERE product_id = $2::int`, [reviewerName, product_id]);

       await client.query('COMMIT')

       res.status(200).send('Comment was successfuly deleted')}

    catch(error){
      await client.query('ROLLBACK')
      console.error('Delete comment',error)
      return res.status(500).json({message:'Internal Server Error'})
    }

    finally{client.release()}
})


Product_Route.get('/cart',CheckAccess,async (req,res)=>{

  const user_id=req.user?.user_id

  try{
    const Cart=await pool.query(`
    SELECT title,price,images,product_id,quantity,amount,SUM(totalprice) OVER(PARTITION BY user_id) AS totalprice FROM (
    SELECT p.title,p.price,p.images,p.product_id,p.amount,c.quantity,c.user_id, CASE WHEN p.newprice>0 THEN p.newprice * c.quantity ELSE p.price*c.quantity END AS totalprice FROM Cart AS c
    INNER JOIN products AS p ON p.product_id=c.product_id) t
    WHERE user_id=$1`,[user_id])
    
    if(Cart.rowCount===0){return res.status(200).json({message:'Your cart is Empty'})}
    
    res.status(200).send(Cart.rows)}

  catch(error){
    console.error('Get Cart',error)
    return res.status(500).json({message:'Internal server error'})}
})


Product_Route.delete('/removecartproducts/:product_id',
 param('product_id').exists().withMessage('product_id is required').isNumeric().withMessage('Product_id must be a number'),
 CheckAccess,async (req,res)=>{

   const errors=validationResult(req)
   if(!errors.isEmpty()){return res.status(400).json({message:errors.array()[0]?.msg})}

   const {product_id}=req.params
   const user_id=req.user?.user_id

   const client=await pool.connect()
   
   try{
       const TestDeleteItems= await client.query('DELETE FROM Cart WHERE user_id=$1 AND product_id=$2 RETURNING *',[user_id,product_id])
       if(TestDeleteItems.rowCount===0){return res.status(401).json({message:'Invalid Id'})}
       res.status(200).json({message:'Product Was Removed from cart'})   
   }
   catch(error){
    console.error('Remove Cart product',error)
    return res.status(500).json({message:'Internal server error'})
  }
   finally{client.release()}
})


Product_Route.delete('/order',CheckAccess,async (req,res)=>{
    const user_id=req.user?.user_id
    
    const client=await pool.connect()
    try{
      await client.query('BEGIN')
      const CartProducts=await client.query(`
        SELECT p.product_id,p.amount,c.quantity FROM Cart AS c
        INNER JOIN products AS p ON p.product_id=c.product_id AND c.user_id=$1`,[user_id])
      
      for(const v of CartProducts.rows){
        if(v.amount===0){
          await client.query('ROLLBACK')
          return res.status(409).json({message:'This order cannot be done one or more products in your cart is out of stock'})
        }
        if(v.amount<v.quantity){
          await client.query('ROLLBACK')
          return res.status(409).json({message:'This order cannot be done you have ordered more units then there are of with one or more of your products'})}

        await client.query(`UPDATE products SET amount=amount-$1 WHERE product_id=$2`,[v.quantity,v.product_id])
      }

      await client.query('DELETE FROM Cart WHERE user_id=$1',[user_id])

      await client.query('COMMIT')
      res.status(200).json({message:'Order was sent successfuly '})
    }
    catch(error){
      await client.query('ROLLBACK')
      console.error('Order',error)
      return res.status(500).json({message:'Internal server error'})}
    
    finally{client.release()}
})