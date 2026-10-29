
import { api } from "../Utilities/Api_Route";
import axios from "axios";

import type { itemtype,reviewperson} from "../Home Componets/Home types"
import type { AddComment } from "./Product types";

import {motion} from 'motion/react'
import { FaStar } from "react-icons/fa";

import Purchase_Product from "./Purchase_Product";
import CreateComment from "./CreateComment";
import Reviews from "./Reviews";

import Sale from '../Utilities/assets/sale-icon.webp'

import {useEffect, useState } from "react";
import { Globalstore } from "../Utilities/Global_Store";

import  RefreshCheck from "../Utilities/Refresh_Check";

function Product_Info({product,setProductChange,setshowproduct}:
{product:itemtype,setProductChange:React.Dispatch<React.SetStateAction<boolean>>,
setshowproduct:React.Dispatch<React.SetStateAction<boolean>>}) {

  const [isshowingword,setshowingword]=useState(false) //Show the word "items"
  
  const {user}=Globalstore()

  const [isUpdating, setIsUpdating] = useState(false); //Prevent user from clicking the purchase button while it is active
  const [quantity,setquantity]=useState(0) //Amount of item the user has ordered

  const [comments,setcomments]=useState<reviewperson[]>(product.reviews) //all of our review to show instant change
  
  const [properties,setproperties]=useState<AddComment>({rating:1,comment:'',exists:false}) //For current user comment and edit


  async function GetQuantity() {
      if(isUpdating){return}
      const currentToken = Globalstore.getState().accesstoken;
      try{
        const response=await api.get(`/product/quantity/${product.product_id}`,{headers:{Authorization:`Bearer ${currentToken}`}})  
        setquantity(response.data)}

      catch(error){
        if(axios.isAxiosError(error)){
          if(error.response?.status===401){
            const restore= await RefreshCheck()
            if(restore){GetQuantity()}}}
        else{console.log('Get Quantity',error)}
        return ''
       } 
     }       
 
  async function ChangeQuantity(type:string){
      const currentToken = Globalstore.getState().accesstoken
      setIsUpdating(true)

      try{
         const response=await api.post('/product/changequantity',{Product_id:product.product_id,type:type},{headers:{Authorization:`Bearer ${currentToken}`}})
         setquantity(response.data.quantity)
        }

      catch(error){
        if(axios.isAxiosError(error)){
          if(error.response?.status===401){
            const restore= await RefreshCheck()
            if(restore){ChangeQuantity(type)}}}
        else{console.log('Change Quantity',error)}
        return ''

        }
      finally{setIsUpdating(false)}
     }
 
  async function CreateUpdateComment(Formdata:FormData){
    const comment=Formdata.get('Comment') as string
    if(comment.trim()===''){return} //Preventing creation of empty comments

    if(comments.find((v)=>v.reviewerName===user.username)){
       setcomments(sc=>sc.map((v)=>v.reviewerName===user.username 
       ? {...v,reviewerName:user.username,rating:properties.rating,comment:comment,date:new Date().toISOString(),role:user.role} : v))}

    else{setcomments(sc=>[...sc,{reviewerName:user.username,rating:properties.rating,comment:comment,date:new Date().toISOString(),role:user.role}])}
   

    try{
      const currentToken=Globalstore.getState().accesstoken
      await api.post('/product/setcomment',{rating:properties.rating,comment:comment,product_id:product.product_id,reviewerName:user.username,role:user.role},
      {headers:{Authorization:`Bearer ${currentToken}`}})
       setProductChange(sc=>!sc)  
    }

    catch(error){
      if(axios.isAxiosError(error)){
        if(error.response?.status===401){
           const restore=await RefreshCheck()
           if(restore){CreateUpdateComment(Formdata)}}}
      else{console.log('Create Update Comment',error)}
      return ''
     }
    }

  async function DeleteCommand(reviewerName:string) {
      setcomments(sc=>sc.filter((v)=>v.reviewerName!==reviewerName))
      try{
        const currentToken=Globalstore.getState().accesstoken
        await api.delete(`/product/deletecomment/${reviewerName}/${product.product_id}`,{headers:{Authorization:`Bearer ${currentToken}`}})
        setProductChange(sc=>!sc) 
       }
         
      catch(error){
        if(axios.isAxiosError(error)){
          if(error.response?.status===404){setProductChange(sc=>!sc)}
          if(error.response?.status===401){
             const restore=await RefreshCheck()
             if(restore){DeleteCommand(reviewerName)}}}
             else{console.log('Delete Comment',error)}
        return ''
      }
    }
  
  /* Way for the user to see the comment state aka did he sent one and can edit it or not */
  useEffect(()=>{
    function CheckProperties(){
       const commentscopy=[...comments]
       const review=commentscopy.find((v)=>v.reviewerName===user.username)
       if(review){setproperties(sp=>({...sp,rating:review.rating,comment:review.comment,exists:true}))}
       else{setproperties(sp=>({...sp,rating:1,comment:'',exists:false}))}
      }

      CheckProperties()
     },[comments,user.username])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(()=>{GetQuantity()},[])

  return (
     <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.5,ease:'easeInOut'}} exit={{opacity:0}}
      onClick={()=>setshowproduct(false)} className="fixed inset-0 z-50 flex justify-center items-center ">
  
      <motion.div onClick={(e)=>e.stopPropagation()} initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.5,ease:'easeInOut'}}
        className="Inner_Section_Background border-3 Border_Color rounded-xl overflow-y-auto NoScrollbar w-170 md:w-200 h-250 mx-4 relative">

        <section className=" flex items-center justify-between">
          <h1 className="Accent_Color text-xl font-semibold m-1.5">{product.title}</h1>
          <section className=" flex items-center select-none text-xl ">
            <p className="Orange_Text_Color font-semibold ">{product.rating}</p>
            <FaStar className="text-yellow-300 mx-0.5 "/>
          </section>
        </section>

        <p className="ml-1.5 Orange_Text_Color font-semibold  text-lg" >{product.category}</p>

        <article className="flex justify-center items-center">
          <img draggable={false} className="w-90 h-90 rounded-xl my-5 select-none" src={product.images} alt={`${product.title} Image`} />
        </article>
       
       {parseFloat(product.newprice)>0 &&(<img className=" absolute w-20 h-20 top-14.5 right-0.5" src={Sale} alt="Sale Image" />)}
       
        <div>
          <h1 className="Accent_Color text-xl font-semibold ml-1.5 ">Description</h1>
          <p className=" Secondary_Text_Color mx-1.5 mt-1.5 ">{product.description}</p>
        </div>

        <Purchase_Product product={product} quantity={quantity} isUpdating={isUpdating} isshowingword={isshowingword} setshowingword={setshowingword} ChangeQuantity={ChangeQuantity}/>

        <div>
         <h1 className="Accent_Color text-xl font-semibold mb-3 ml-1.5">Reviews by Users</h1>

         <CreateComment CreateUpdateComment={CreateUpdateComment} properties={properties} setproperties={setproperties} />

         {comments.length>0 &&(
         <section className=" mx-1.5 mb-5 rounded-lg">
            {comments.sort((a,b)=>b.date.localeCompare(a.date)).map((v,i)=><Reviews key={i} reviewer={v} index={i} length={comments.length} DeleteCommand={DeleteCommand}/>)}
         </section>)}

         {comments.length===0 && (<p className="Non_Data_State text-lg">No reviews for this item yet</p>)}
        </div>

      </motion.div>
     </motion.div>
  )}

export default Product_Info