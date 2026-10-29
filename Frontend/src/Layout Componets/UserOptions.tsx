
import { MdLightMode,MdDarkMode} from "react-icons/md";
import { PiSignOut } from "react-icons/pi";
import { RiAdminFill,RiUserFill} from "react-icons/ri";

import {motion,AnimatePresence} from 'motion/react'

import { Globalstore } from "../Utilities/Global_Store";
import Change_User from "./Change_User";

import { api } from "../Utilities/Api_Route";
import axios from "axios";

import RefreshCheck  from "../Utilities/Refresh_Check";
import { useNavigate } from "react-router-dom";
import { useState } from "react";


function UserOptions() {  

  const {user,setuser,cleartoken,clearuser}=Globalstore()

  const [useroption,setuseroptions]=useState(false)

  const nav=useNavigate()

  async function ChangeLighting(){
    try{
      const currentToken=Globalstore.getState().accesstoken
      await api.patch('/user/lightmode',{lightmode:!user.isdark},{headers:{Authorization:`Bearer ${currentToken}`}})
      setuser(user.username,user.role,!user.isdark)    
    }

    catch(error){
      if(axios.isAxiosError(error)){
        if(error.response?.status===401){
          const restore= await RefreshCheck()
          if(restore){ChangeLighting()}}}
     else{console.log('LightMode Error',error)}}
  }


  async function Signout(){
      try{
         await api.delete('/user/signout')
         cleartoken()
         clearuser()
         nav('/login')}

      catch(error){
         console.log('Signout Error',error)
         cleartoken()
         clearuser()
         nav('/login')}
  }

  return (
    <motion.div onClick={(e)=>e.stopPropagation()} initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:.5,ease:'easeInOut'}} exit={{opacity:0,y:30}}
     className=" absolute right-1 top-9 sm:top-14 Inner_Section_Background border-3 Border_Color rounded-lg z-10 w-60 ">
       <section className=" border-b-2 Border_Color ">
         <p className="my-1 text-xl ml-3 mr-1 ">{user.username}</p>
       </section>

       <div className="flex flex-col text-xl ">

        <section className="flex items-center cursor-pointer p-1.5 Bg_Hover select-none" onClick={ChangeLighting}>
          {!user.isdark &&(<MdDarkMode className=" text-gray-400 mx-1"/>)}
          {user.isdark &&(<MdLightMode className=" text-yellow-400 mx-1"/>)}
          <p className="ml-1">{user.isdark ? 'Light Mode' : 'Dark Mode'}</p>
        </section>
        
        <section className="flex items-center cursor-pointer p-1.5 Bg_Hover select-none" onClick={()=>setuseroptions(true)} >
          <RiUserFill className="mx-1"/>
          <p className="ml-1">User Options</p>
        </section>

        {user.role==='Admin' && (
        <section className="flex items-center cursor-pointer p-1.5 Bg_Hover select-none" onClick={()=>{nav('/Admin')}} >
          <RiAdminFill className="mx-1"/>
          <p className="ml-1">Admin Options</p>
        </section>)}

        <section className="flex items-center cursor-pointer p-1.5 Bg_Hover border-t-2 Border_Color hover:rounded-b-lg select-none" onClick={Signout}>
          <PiSignOut className="mx-1 Red_Text_Color"/>
          <p className="ml-1">Sign out</p>
        </section>

        <AnimatePresence>
          {useroption && (
             <>
              <Change_User setuseroptions={setuseroptions} ChangeLighting={ChangeLighting} />
              <div className="fixed inset-0 bg-black/80 z-40"/>
             </>)}     
        </AnimatePresence>

       </div>
    </motion.div>
  )
}

export default UserOptions

