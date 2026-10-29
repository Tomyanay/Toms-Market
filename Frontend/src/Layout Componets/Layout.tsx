
import { FaRegUser } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";

import { Outlet,Link} from "react-router-dom";

import {AnimatePresence} from 'motion/react'

import { Globalstore } from "../Utilities/Global_Store";
import { layout_store } from "./Layout_Shop";

import { useEffect, useState } from "react";

import RefreshCheck from "../Utilities/Refresh_Check";

import Search from "./Search Componets/Search"
import UserOptions from "./UserOptions";
import Cart from "../Order/Cart";

function Layout() {

   const [usermenu,setusermenu]= useState(false)
   const {user}=Globalstore()
   const {showcart,setshowcart,NewCart,setCart}=layout_store()
  
   useEffect(()=>{
     if(user.isdark){document.documentElement.classList.add('dark')}
     else{document.documentElement.classList.remove('dark')}
   },[user.isdark])

   useEffect(()=>{
    async function CheckUser() {await RefreshCheck()} 
    CheckUser()
   },[])

  return (
    <div onClick={()=>setusermenu(false)} className='m-2 border-3 rounded-lg Border_Color'>
       <div className="text-2xl lg:text-3xl flex flex-col sm:flex-row sm:justify-between items-center py-3.5 border-b-3 Border_Color Outer_Section_Background sticky top-0 z-10">

          <Link to={'/'}><h1 className="ml-2 cursor-pointer whitespace-nowrap mb-3 sm:mb-0 select-none text-3xl lg:text-4xl Title_color">Tom's Market</h1></Link>

          <Search/>

          <div className="flex items-center">

           <section className="absolute sm:static left-0 top-8 ">
              <FaCartShopping title="View Order" className="text-3xl lg:text-4xl  cursor-pointer Text_Hover ml-2 sm:mr-10 lg:mr-15" onClick={()=>setshowcart(true)} />
           </section>

           <AnimatePresence>
            {showcart &&(
             <>
              <Cart setshowcart={setshowcart} NewCart={NewCart} setCart={setCart} />
              <div className="fixed inset-0 bg-black/80 z-40"/>
             </>)}
           </AnimatePresence>

           <div className=" absolute sm:static -right-3 top-8">
            <section onClick={(e)=>{e.stopPropagation();setusermenu(true)}} className=" mr-2 cursor-pointer Text_Hover relative">
              <FaRegUser className="mr-2 text-3xl lg:text-4xl"/>
            </section>
            <AnimatePresence>
              {usermenu && (<UserOptions/>)}
            </AnimatePresence>
           </div>
          </div>    
       </div>

       <Outlet/>

    </div>
  )
}
export default Layout