
import { api } from "../Utilities/Api_Route";

import { useQuery } from "@tanstack/react-query";

import { Home_Store } from "./Homestore";
import { layout_store } from "../Layout Componets/Layout_Shop";

import type { itemtype} from "./Home types";
import { categories,Sorting } from "./Home data";

import Categorys from "./Categorys";
import Products from "../Utilities/Global_Componets/Products";
import Product_Info from "../Product_Info/Product_Info";

import {AnimatePresence} from 'motion/react'

import { useEffect, useState } from "react";

import {BiFirstPage,BiLastPage,BiChevronRight,BiChevronLeft,BiSolidCategoryAlt} from "react-icons/bi";
import { GoSortAsc,GoSortDesc} from "react-icons/go";
import { MdSort } from "react-icons/md";

function Home() {

  const [products,SetProducts]=useState<itemtype[]>([]) //ALl of the existing products
  
  const [product,SetProduct]=useState<itemtype>({title:'',rating:0,price:'',newprice:'',images:'',product_id:0,category:'',description:'',amount:0}) // A specific product to see more info of
  
  const [showproduct,setshowproduct]=useState(false) //Shows product info window
  
  const [sortoptions,setsortoptions]=useState(Sorting) //Show the sorting options

  const [notfound,setnotfound]=useState(false) //If we dont have any products to show
  
  const {category,SortedName,SortedType,SetSort,page,setpage,index,setindex,Enablecategory,Set_Enable_Category}=Home_Store()

  const {NewCart}=layout_store() //Used for refeshing the Products once 

  const Maxpage=products.length%24<=0 ? products.length/24 : Math.floor(products.length/24)+1

  function About_Product(product:itemtype){
        setshowproduct(true)
        SetProduct(product)
  }

  function Movepage(type:string,direction:string){
        if(type==='vanila'){
          if(direction==='left'){
              setpage(page-1)
              setindex(index-24)}
          else{
              setpage(page+1)
              setindex(index+24)}}
        else{
           if(direction==='left'){
              setpage(1)
              setindex(0)}

          else{
            setpage(Maxpage)
            setindex((24*Maxpage)-24)}}
     }
  
  async function GetProducts() {
      const response=await api.get(`/product/getproducts/?category=${category}&sort=${SortedName}&order=${SortedType}`)
      if(response.data.length===0){setnotfound(true)}
      else{setnotfound(false)}
      SetProducts(response.data)
      return ''  
  }

  const {isError,error,isLoading}=useQuery({queryKey:['Home',category,NewCart,SortedName,SortedType],queryFn:GetProducts})

  function SetOrder(order:string){
      if(order==='Sort by title'){return SetSort('title','asc')}
      if(order==='Sort by Price'){return SetSort('currentprice','asc')}
      if(order==='Sort by Rating'){return SetSort('rating','asc')}
      
      if(order==='A-Z'){return SetSort('title','desc')}
      if(order==='Cheapest'){return SetSort('currentprice','desc')}
      if(order==='Lowest Rated'){return SetSort('rating','desc')}
      
      if(order==='Z-A'){return SetSort('title','base')}
      if(order==='Most Expensive'){return SetSort('currentprice','base')}
      if(order==='Highest Rated'){return SetSort('rating','base')}
  }

  useEffect(()=>{

    function SetSortOrder(){
     const sortoptionscopy=[...sortoptions]
     const newsortoptionscopy=sortoptionscopy.map((v,i)=>{
        if(SortedName==='title' && SortedType==='asc' && v.Order==='Sort by title'){return {...v,Order:'A-Z',Icon:GoSortAsc}}
        if(SortedName==='currentprice' && SortedType==='asc' &&  v.Order==='Sort by Price'){return {...v,Order:'Cheapest',Icon:GoSortAsc}}
        if(SortedName==='rating' && SortedType==='asc' && v.Order==='Sort by Rating'){return {...v,Order:'Lowest Rated',Icon:GoSortAsc}}

        if(SortedName==='title' && SortedType==='desc' && v.Order==='A-Z'){return {...v,Order:'Z-A',Icon:GoSortDesc}}
        if(SortedName==='currentprice' && SortedType==='desc' && v.Order==='Cheapest'){return {...v,Order:'Most Expensive',Icon:GoSortDesc}}
        if(SortedName==='rating' && SortedType==='desc' && v.Order==='Lowest Rated'){return {...v,Order:'Highest Rated',Icon:GoSortDesc}}

        if(SortedName==='title' && SortedType==='base' && v.Order==='Z-A'){return {...v,Order:'Sort by title',Icon:MdSort}}
        if(SortedName==='currentprice' && SortedType==='base' && v.Order==='Most Expensive'){return {...v,Order:'Sort by Price',Icon:MdSort}}
        if(SortedName==='rating' && SortedType==='base' && v.Order==='Highest Rated'){return {...v,Order:'Sort by Rating',Icon:MdSort}}

        return {...v,Order:Sorting[i].Order,Icon:Sorting[i].Icon} })

    setsortoptions(newsortoptionscopy)
  }
    SetSortOrder() 

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[SortedName, SortedType])


  return (
    <div className=" Inner_Section_Background">
      <section className="p-5">
        <div className=" flex flex-col md:flex-row items-center justify-evenly  text-xl md:text-[22px] lg:text-2xl">
          <section className="flex items-center my-1.5 ">
            <BiSolidCategoryAlt className="Secondary_Text_Color mx-0.5 "/>
            <h1 onClick={()=>Set_Enable_Category(!Enablecategory)} className="font-semibold Orange_Text_Color cursor-pointer Text_Hover">Categories</h1>
          </section>
          {sortoptions.map((v)=>(
            <div onClick={()=>SetOrder(v.Order)} className="font-semibold Orange_Text_Color cursor-pointer Text_Hover flex items-center" key={v.Order}>
              <v.Icon className="Secondary_Text_Color mx-0.5 "/>
              <p className="my-1.5 md:my-0">{v.Order}</p>
            </div>))}
        </div>

        <AnimatePresence>
         {Enablecategory && (
          <div className=" p-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-9 gap-2 ">
           {categories.map((v)=><Categorys key={v.categoryname} value={v}/>)}
          </div>)}
        </AnimatePresence>

      </section>   

      <section className="p-3">
        <h1 className=" text-2xl font-semibold Orange_Text_Color">Products </h1>
        {(!isLoading && !isError && products.length>0) &&(
          <div className=" grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-3 mt-2 ">
           {products.slice(index,index+24).map((v)=><Products key={v.product_id} product={v} Eventfunc={About_Product}/>)}
         </div>)}
        {isLoading &&(<p className="Non_Data_State">Loading products...</p>)}
        {isError &&(<p className="Non_Data_State">{error.message}</p>)}
        {(notfound && !isLoading && !isError) &&(<p className="Non_Data_State">No Products Found</p>)}
      </section>

      {(products.length>0) && (
      <div className=" flex items-center justify-center py-3  scrollbar-width">
        <button type="button" onClick={()=>Movepage('Jump','left')} disabled={page==1}>
         <BiFirstPage className={`text-3xl xl:text-4xl ml-2 ${page===1 ? ' Secondary_Text_Color cursor-not-allowed' : 'cursor-pointer'}`}/>
        </button>

        <button type="button" onClick={()=>Movepage('vanila','left')} disabled={page==1}>
         <BiChevronLeft className={`text-3xl xl:text-4xl  ${page===1 ? ' Secondary_Text_Color cursor-not-allowed' : 'cursor-pointer'}`}/>
        </button>

        <p className="text-xl xl:text-2xl"> page {page} of {Maxpage}</p>

        <button type="button" onClick={()=>Movepage('vanila','right')} disabled={page*24>=products.length}>
         <BiChevronRight className={`text-3xl xl:text-4xl  ${page*24>=products.length ? ' Secondary_Text_Color cursor-not-allowed' : 'cursor-pointer'}`}/>
        </button>

        <button type="button" onClick={()=>{Movepage('Jump','right')}} disabled={page*24>=products.length}>
         <BiLastPage className={`text-3xl xl:text-4xl mr-2 ${page*24>=products.length ? ' Secondary_Text_Color cursor-not-allowed' : 'cursor-pointer'}`}/>
        </button>
      </div>)}
      
      <AnimatePresence>
       {(showproduct) &&(
       <>
        <Product_Info product={product} setshowproduct={setshowproduct}/>
        <div className="fixed inset-0 bg-black/80 z-40"/>
       </>)}
      </AnimatePresence>
    </div>
  )
}
export default Home