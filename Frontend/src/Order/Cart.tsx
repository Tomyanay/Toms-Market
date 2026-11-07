
import {motion} from 'motion/react'

import { api } from "../Utilities/Api_Route";
import axios from "axios";

import { useQuery } from "@tanstack/react-query";

import { Globalstore } from "../Utilities/Global_Store";

import { FaCartShopping } from "react-icons/fa6";
import { useState } from "react";

import type { cartproduct } from "./Cart_types";
import Cart_Products from "./Cart_Products";

import  RefreshCheck from '../Utilities/Refresh_Check';


function Cart({setshowcart,NewCart,setCart}:{setshowcart:(veriable:boolean)=>void,NewCart:boolean,setCart:(veriable:boolean)=>void}) {

  const [message,setmessage]=useState('') // message if the cart is empty
  const [cartproduct,setcartproduct]=useState<cartproduct[]>([]) // All of my products
  const [TotalCost,setTotalcost]=useState(0) //Total product cost
  const [FinalOrder,setOrder]=useState('') // Message when we order

  async function GetCart() {
    try{
     const currentToken=Globalstore.getState().accesstoken
     const response=await api.get('/product/cart',{headers:{Authorization:`Bearer ${currentToken}`}})
     const products=response.data
  
     if(typeof(products.message)==='string'){
      setcartproduct([])
      setmessage(products.message)}

     else{
      setcartproduct(products)
      setTotalcost(products[0].totalprice)
      setmessage('')}

     return '' 
  }
    catch(error){
      if(axios.isAxiosError(error)){
        if(error.response?.status===401){
          const restore= await RefreshCheck()
          if(restore){GetCart()}}}
      else{console.log('Get Cart',error)}
      return ''
     }
   }

  const {isLoading,isError}=useQuery({queryKey:['Cart',NewCart],queryFn:GetCart}) 

  async function RemoveFromcart(product_id:number){
    try{
      const currentToken=Globalstore.getState().accesstoken
      await api.delete(`/product/removecartproducts/${product_id}`,{headers:{Authorization:`Bearer ${currentToken}`}})
      setCart(!NewCart)
    }

    catch(error){
      if(axios.isAxiosError(error)){
        if(error.response?.status===401){
           const restore= await RefreshCheck()
           if(restore){RemoveFromcart(product_id)}}}
      else{console.log('Remove From Cart',error)}
      return ''
     }
   }

  async function Order() {
     try{
       const currentToken=Globalstore.getState().accesstoken
       const response=await api.delete('/product/order',{headers:{Authorization:`Bearer ${currentToken}`}})
       const checkorder:{message:string}=response.data
       setCart(!NewCart)
       setOrder(checkorder.message)  
     }

    catch(error){
      if(axios.isAxiosError(error)){
        if(error.response?.status===409){setOrder(error.response.data.message)}
        if(error.response?.status===401){
          const restore= await RefreshCheck()
          if(restore){Order()}}}
      else{console.log('Order',error)}
      return ''
     }   
   }

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.7,ease:'easeInOut'}} exit={{opacity:0}}
     className="fixed inset-0 z-50" onClick={()=>setshowcart(false)}>

     <motion.div onClick={(e)=>e.stopPropagation()} initial={{x:-250}} animate={{x:0}} transition={{duration:.5, ease:'easeInOut'}}  exit={{x:-250}}
     className={`Inner_Section_Background border-4 border-l-0 my-0.5 Border_Color rounded-r-lg w-75 sm:w-100 lg:w-150 h-190 `}>

      <section className="Orange_Text_Color text-lg sm:text-xl lg:text-2xl  font-semibold flex items-center justify-between my-2 pb-2 border-b-2 Border_Color">
        <h1 className="ml-1 select-none">Ordered Products</h1>
         <FaCartShopping className="mr-1"/>
      </section>

      {(!isLoading && !isError) && (
      <>
       {(message!=='' && FinalOrder ==='') && (<p className="Non_Data_State select-none Accent_Color">{message}</p>)}
       {message === '' && (
          <>
            <p className='Accent_Color font-semibold text-lg lg:text-xl ml-1 line-clamp-1'>Total Cost: {TotalCost}$</p>
           
            <section className='max-h-140 overflow-y-auto NoScrollbar '>
              {cartproduct.map((v)=><Cart_Products key={v.product_id} product={v} RemoveFromcart={RemoveFromcart}/>)}
            </section>

            <section className='text-center'>
              <button onClick={()=>Order()} 
               className=' border-2 Border_Color mb-5 mx-2 px-13 sm:px-20 cursor-pointer h-10 Text_Hover select-none rounded-xl Border_Hover text-xl mt-5 Accent_Color font-semibold'>
               Order Products
              </button>
            </section>
          </>)}
      </>)}
       {FinalOrder!=='' &&(<p 
       className={`text-xl lg:text-2xl mx-5 flex justify-center ${cartproduct.length===0 && 'h-[inherit]'} items-center font-semibold select-none Accent_Color`}>{FinalOrder}
       </p>)}
       {isLoading &&(<p className="Non_Data_State">Loading Cart...</p>)}
       {isError &&(<p className="Non_Data_State">Internal server error</p>)}
     </motion.div> 
    </motion.div>
  )
}

export default Cart