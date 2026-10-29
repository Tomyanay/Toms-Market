
import { api } from '../../Utilities/Api_Route';

import { useQuery } from "@tanstack/react-query";

import { useSearchParams } from 'react-router-dom' 

import Products from '../../Utilities/Global_Componets/Products';
import Product_Info from '../../Product_Info/Product_Info';

import type { itemtype } from '../../Home Componets/Home types';

import {AnimatePresence} from 'motion/react'

import {useState} from "react";

import { layout_store } from '../Layout_Shop';

function Result() {

  const [searchParams] = useSearchParams()

  const [products,SetProducts]=useState<itemtype[]>([]) //All of the existing products
    
  const [product,SetProduct]=useState<itemtype>({title:'',rating:0,price:'',newprice:'',images:'',product_id:0,category:'',description:'',reviews:[],amount:0}) // A specific product to see more info of
    
  const [showproduct,setshowproduct]=useState(false) //Shows product info window

  const [issearcing,setsearching]=useState(true) //Check if the user has searched for something

  const [notfound,setnotfound]=useState('') //If the we didnt find anything in the search

  const [ProductChange,setProductChange]=useState(false) //Calls the api fetch once more when we change something about the Product or select one

  const {NewCart}=layout_store()

  const searcheditem=searchParams.get('product')

  function About_Product(product:itemtype){
      setshowproduct(true)
      SetProduct(product)
  }

  async function GetResult() {
    if(searcheditem!==null && searcheditem!==''){
     setsearching(true)
     const response=await api.get(`/Product/search/?product=${searcheditem}`)
     const result=response.data
     if(result.message){setnotfound(result.message)}
     else{SetProducts(result);setnotfound('')}
     return ''
    }

    else{setsearching(false);return ''}

  }
  const {isLoading,isError,error}=useQuery({queryKey:['Search',searcheditem,NewCart,ProductChange],queryFn:GetResult})


  return (
    <div className={` Inner_Section_Background`}>
        {(!isLoading && issearcing && notfound==='' && products.length>0) && (
        <>
         <section className='p-3'>
          <p className='text-2xl font-semibold Orange_Text_Color'>{products.length} Results for "{searcheditem}"</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6  gap-3 mt-2">
            {products.map((v)=><Products key={v.product_id} product={v} Eventfunc={About_Product}/>)}
          </div>
         </section>
        </>)} 

        <AnimatePresence>
         {(showproduct) &&(
         <>
          <Product_Info product={product} setProductChange={setProductChange} setshowproduct={setshowproduct}/>
          <div className="fixed inset-0 bg-black/80 z-40"/>
         </>)}
        </AnimatePresence>

        {(isLoading && issearcing)  &&(<p className='Non_Data_State'>Searching for {searcheditem}...</p>)}
        {(!isLoading && issearcing && notfound!=='')  &&(<p className='Non_Data_State'>{notfound}</p>)}
        {isError &&(<p className='Non_Data_State'>{error.message}</p>)}
        {(!isLoading && !issearcing)  &&(<p className='Non_Data_State'>Type what you want to search in the entry and press Enter</p>)}
    </div>
  )
}

export default Result