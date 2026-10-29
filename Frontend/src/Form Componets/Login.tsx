
import { api } from "../Utilities/Api_Route";
import axios from "axios";

import {useForm} from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form';

import { Link } from 'react-router-dom';

import { useNavigate } from 'react-router-dom'
import {useState} from 'react';

import { IoMdEye,IoMdEyeOff} from "react-icons/io";

import type { Login_User_Type } from './Formtypes';

import { Globalstore } from "../Utilities/Global_Store";

import { Set_Screen_Mode } from '../Utilities/Set_Screen_Mode';

function Login() {

  const nav=useNavigate()

  const [type,settype]=useState({password:'password'})
  const [ishovered,sethovered]=useState({password:false})

  const {register,handleSubmit,setError,formState:{errors,isSubmitting}}=useForm<Login_User_Type>()
  
  const {setuser,getaccesstoken}=Globalstore()

  const media=window.matchMedia("(prefers-color-scheme:dark)")

  const Change_Screen_Mode=Set_Screen_Mode()

  const Login:SubmitHandler<Login_User_Type>= async (data)=>{
    try{
      const response=await api.post('/user/login',{username:data.Username,password:data.Password})
      const Data=response.data
      setuser(Data.username,Data.role,Data.isdark)
      getaccesstoken(Data.accesstoken as string)
      document.documentElement.classList.remove('dark')
      media.removeEventListener("change",Change_Screen_Mode)
      nav('/')
    }
   
    catch(error){
       if(axios.isAxiosError(error)){
        if(error.response?.status===401){return setError('root',{message:error.response.data.message})}
        else if(error.response?.status===500){return setError('root',{message:error.response.data.message})}
       if(error instanceof Error){return setError('root',{message:error.message})}
       }}
  }
  return (
    <div className="h-screen flex justify-center items-center">
      <form onSubmit={handleSubmit(Login)} className='Inner_Section_Background p-9 border-3 Border_Color rounded-lg mx-5'>

        <h1 className='text-2xl font-semibold text-center Accent_Color'>Login to the market</h1>

        <div className='flex flex-col my-2'>
         <label className='text-xl mb-1 font-semibold' htmlFor="username">Username</label>

         <input type="text" className='h-10 border-2 Border_Color pl-2 outline-0 rounded-lg Border_Hover' 
           {...register('Username',{required:'Field is required',
           minLength:{value:2,message:'Username must be between 2 and 20 characters'},
           maxLength:{value:20,message:'Username must be between 2 and 20 characters'}})}
          id='username'  
          placeholder='Enter Username' 
          autoComplete='off' />
          {errors.Username &&(<p className='Red_Text_Color my-1 select-none '>{errors.Username.message}</p>)}
        </div>

        <div className='flex flex-col my-2'>
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
           {errors.Password &&(<p className='Red_Text_Color my-1 select-none '>{errors.Password.message}</p>)}
        </div>
        
        {errors.root &&(<p className='Red_Text_Color mt-5 select-none text-center '>{errors.root.message}</p>)}
       
        <div className='mt-5'>
          <button className='border-2 Border_Color rounded-xl w-full h-10 Border_Hover text-xl mb-5 Accent_Color font-semibold select-none'>{isSubmitting ? 'Loading...' : 'Submit'}</button>
        </div>  
           
        <Link to={'/newuser'} className='Secondary_Text_Color hover:underline text-lg select-none'>Create a new user if you dont have one</Link>
      </form>

    </div>
  )
}
export default Login