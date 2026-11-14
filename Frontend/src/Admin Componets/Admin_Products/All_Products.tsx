
import { api } from "../../Utilities/Api_Route";
import axios from "axios"

import { useQuery } from "@tanstack/react-query"
import { Globalstore } from "../../Utilities/Global_Store";

import  RefreshCheck  from "../../Utilities/Refresh_Check";

import Admin_Search from "../Admin_Global/Admin_Search";
import Found_Products from "./Found_Products";
import Edit_Product from "./Edit_Product";

import type { AdminProducts } from "../AdminTypes";

import { useState } from "react";

function All_Products() {

    const [allproducts,getproducts]=useState<AdminProducts[]>([]) //All of our client users
      
    const [searchedAdminProduct,setSearchedAdminProduct]=useState('') //The item we search for currently
  
    const [action,setaction]=useState(false)

    const [ChosenItem,setChosenItem]=useState<AdminProducts>({title:'',rating:0,price:'',newprice:'',images:'',product_id:0,category:'',description:'',amount:0})
      
    const [notfoundmessage,setnotfoundmessage]=useState('') //Not finding what we want to
      
   async function GetAllProducts() {
     try{
      const currentToken=Globalstore.getState().accesstoken
      const products=await api.get(`/admin/products/?product=${searchedAdminProduct}`,{headers:{Authorization:`Bearer ${currentToken}`}})
      if(typeof(products.data.message)==='string'){
        setnotfoundmessage(products.data.message)
        getproducts([])}

      else{
        getproducts(products.data)
        setnotfoundmessage('')}
      return ''
    }

     catch(error){
      if(axios.isAxiosError(error)){
        if(error.response?.status===401){
          const restore= await RefreshCheck()
          if(restore){GetAllProducts()}}
        else{throw error}  
       }    
      else{console.log('Admin Get Products',error)}
      return ''
     }
   }

    
   async function DeleteProduct(product_id:number) {
      try{
        const currentToken=Globalstore.getState().accesstoken
        await api.delete(`/admin/deleteproduct/${product_id}`,{headers:{Authorization:`Bearer ${currentToken}`}})
        setaction(sa=>!sa)
      }

      catch(error){
        if(axios.isAxiosError(error)){
          if(error.response?.status===401){
            const restore=await RefreshCheck()
            if(restore){DeleteProduct(product_id)}}}
        else{console.log('Admin Delete Product',error)}
        return ''
       }
     }

    const {isLoading,isError,error}=useQuery({queryKey:['Admin_Products',searchedAdminProduct,action],queryFn:GetAllProducts}) 
    
  return (
   <>
    {(!isLoading && !isError) &&(
     <div>
       <h1 className=" text-xl lg:text-2xl font-semibold Accent_Color">All Products</h1>

       {ChosenItem.title==='' &&(
       <>
        <Admin_Search searchedAdmin={searchedAdminProduct} setSearchedAdmin={setSearchedAdminProduct} message="Search for Products"/>
        {(allproducts.length>0) && ( 
         <>
          <section className=" border-3 Border_Color rounded-xl my-2 max-h-screen overflow-y-auto NoScrollbar"> 
             {allproducts.sort((a,b)=>a.title.localeCompare(b.title)).map((v)=><Found_Products key={v.product_id} product={v} DeleteProduct={DeleteProduct} setChosenItem={setChosenItem}/>)}     
          </section>
         </>
        )}
      </>)}

      {ChosenItem.title!=='' &&(<Edit_Product product={ChosenItem} setChosenItem={setChosenItem} setaction={setaction}/>)}
    </div>)}
    {isLoading && allproducts.length===0 &&(<p className="Non_Data_State">Loading Products...</p>)}
    {(!isLoading && allproducts.length===0) &&(<p className="Non_Data_State">{notfoundmessage}</p>)} 
    {isError &&(<p className="Non_Data_State -mt-20">{error.message}</p>)}
   </>
  )
}

export default All_Products