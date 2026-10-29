
import { api } from '../Utilities/Api_Route';
import axios from 'axios';

import {useForm} from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form';

import {motion} from 'motion/react'

import { MdLightMode,MdDarkMode} from "react-icons/md";
import { IoMdEye,IoMdEyeOff} from "react-icons/io";

import { Globalstore } from '../Utilities/Global_Store';

import type { Change_User_Info } from './Layout_types';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import  RefreshCheck  from '../Utilities/Refresh_Check';

function Change_User({setuseroptions,ChangeLighting}:{setuseroptions:React.Dispatch<React.SetStateAction<boolean>>,ChangeLighting:()=>void}) {

    const {user,setuser,cleartoken,clearuser}=Globalstore()

    const [type,settype]=useState({password:'password'})
    const [ishovered,sethovered]=useState({password:false})

    const [DoneMessage,setDonemessage]=useState('')

    const {register,handleSubmit,setError,formState:{errors,isSubmitting}}=useForm<Change_User_Info>({defaultValues:{Username:user.username}})

    const nav=useNavigate()

    const Changeuser:SubmitHandler<Change_User_Info>=async(data)=>{
      try{
        const currentToken=Globalstore.getState().accesstoken
        const response=await api.put('/user/update',{username:data.Username,password:data.Password},{headers:{'Authorization':`Bearer ${currentToken}`}})
        const message=response.data
        setDonemessage(message.message)
        setuser(data.Username,user.role,user.isdark)
      }
   
      catch(error){
       setDonemessage('')
       if(axios.isAxiosError(error)){
         if(error.response?.status===409){setError('Username',{message:'User with that name already exists'})}
         else if(error.response?.status===401){
            const restore=await RefreshCheck()
            if(restore){Changeuser(data)}}}
       else{console.log('Change User',error)}
       return ''
      }
  }

    async function DeleteUser() {
      try{
        const currentToken=Globalstore.getState().accesstoken
        await api.delete(`/user/delete/${user.username}`,{headers:{Authorization:`Bearer ${currentToken}`}}) 
        cleartoken()
        clearuser()
        nav('/login')
      }

      catch(error){
        if(axios.isAxiosError(error)){
          if(error.response?.status===401){
            const restore=await RefreshCheck()
            if(restore){DeleteUser()}}}
        else{console.log(error)}
        return ''
       }
     }

    return (
      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.5,ease:'easeInOut'}} exit={{opacity:0}}
         onClick={()=>setuseroptions(false)}className="fixed inset-0 z-50 flex justify-center items-center ">
     
        <motion.div onClick={(e)=>e.stopPropagation()} initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.5,ease:'easeInOut'}}
          className="Inner_Section_Background border-3 Border_Color rounded-xl w-170 md:w-200  mx-4 relative">

         {!user.isdark &&(<MdDarkMode onClick={ChangeLighting} className=" text-gray-400 m-1 text-3xl cursor-pointer top-2 right-2 absolute select-none "/>)}
         {user.isdark &&(<MdLightMode onClick={ChangeLighting} className=" text-yellow-400 m-1 text-3xl cursor-pointer top-2 right-2 absolute select-none"/>)}

         <form onSubmit={handleSubmit(Changeuser)} className='p-8 mt-6 mx-3'>

          <h1 className='text-2xl font-semibold Accent_Color mb-6'>Change User and Password</h1>

          <div className='flex flex-col my-4 mx-2'>
            <label className='text-xl mb-1 font-semibold' htmlFor="username">Username</label>
            <input type="text" className='h-10 border-2 Border_Color pl-2 outline-0 rounded-lg Border_Hover' 
             {...register('Username',{required:'Field is required',
              minLength:{value:2,message:'Username must be between 2 and 20 characters'},
              maxLength:{value:20,message:'Username must be between 2 and 20 characters'}})}
              id='username'  
              placeholder='Enter Username' 
              autoComplete='off' />
             {errors.Username &&(<p className='Red_Text_Color pl-1 my-1 select-none '>{errors.Username.message}</p>)}
          </div>

          <div className='flex flex-col my-4 mx-2'>
            <label className='text-xl mb-1 font-semibold' htmlFor="password">Password</label>

           <section onMouseEnter={()=>sethovered(sh=>({...sh,password:true}))} onMouseLeave={()=>{sethovered(sh=>({...sh,password:false}))}}
            className='h-10 border-2 Border_Color relative rounded-lg Border_Hover'>
            <input type={type.password} className='h-full w-full pl-2 outline-0' 
              {...register('Password',{required:'Field is required',
              minLength:{value:8, message:'Password must be between 8 and 25 characters'},
              maxLength:{value:25, message:'Password must be between 8 and 25 characters'}})}
              id='password' 
              placeholder='Enter Password'
              autoComplete="off" />
              {(ishovered.password && type.password==='password') && (
                <IoMdEye className='absolute top-2.5 right-1 text-lg cursor-pointer' onClick={()=>settype(st=>({...st,password:'text'}))}/>)}
              {(ishovered.password && type.password==='text') &&(
                <IoMdEyeOff className='absolute top-2.5 right-1 text-lg cursor-pointer' onClick={()=>settype(st=>({...st,password:'password'}))}/>)}
           </section>
           {errors.Password &&(<p className='Red_Text_Color pl-1 my-1 select-none '>{errors.Password.message}</p>)}
          </div>

          <div className='mt-5'>
            <button className='border-2 Border_Color rounded-xl w-full h-10 Border_Hover text-xl my-5 Accent_Color font-semibold select-none'>{isSubmitting ? 'Loading...' : 'Submit'}</button>
          </div>

          {DoneMessage!=='' && (<p className='text-center Green_Text_Color font-semibold my-5 text-lg lg:text-xl'>{DoneMessage}</p>)}

          <div>
           <p className=' Red_Text_Color mb-2 pl-1 select-none'>Once you delete your user, there is no going back</p>
           <button type="button" onClick={DeleteUser} className='border-2 Border_Color rounded-xl w-full h-10 Border_Hover text-xl Red_Text_Color font-semibold select-none'>Delete User</button>
          </div> 
         </form>   
         
        </motion.div>
      </motion.div>
  )
}

export default Change_User