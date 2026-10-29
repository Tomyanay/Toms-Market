
import { api } from "../Utilities/Api_Route";
import axios from "axios";

import {useForm} from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form';

import { Link } from 'react-router-dom';

import { useNavigate } from 'react-router-dom'
import {useState } from 'react';

import { IoMdEye,IoMdEyeOff} from "react-icons/io";

import type { New_User_Type } from './Formtypes';

import {Set_Screen_Mode} from "../Utilities/Set_Screen_Mode";

function NewUserForm() {

  const nav=useNavigate()

  const [type,settype]=useState({password:'password',repeatepassword:'password'}) //Show/hide password
  const [ishovered,sethovered]=useState({password:false,repeatepassword:false}) // seeing/hiding the eye

  const {register,handleSubmit,formState:{errors,isSubmitting},setError}=useForm<New_User_Type>()

  Set_Screen_Mode()

  const NewUser:SubmitHandler<New_User_Type>= async (data)=>{
    try{
      if(data.Password!==data.Repeat_Password){return setError('Repeat_Password',{message:'Passwords must be the same'})}
      await api.post('/user/add_user',{username:data.Username,password:data.Password})
      nav('/login')
    }

    catch(error){
      if(axios.isAxiosError(error)){
        if(error.response?.status===409){return setError('Username',{message:error.response?.data.message})}
        else if(error.response?.status===500){return setError('root',{message:error.response?.data.message})}}
      if(error instanceof Error){return setError('root',{message:error.message})} }
  }

  return (
    <div className='h-screen flex justify-center items-center'>
      <form onSubmit={handleSubmit(NewUser)} className='Inner_Section_Background p-9 border-3 Border_Color rounded-lg mx-5'>

        <h1 className='text-2xl font-semibold text-center Accent_Color'>Create a new user</h1>

        <div className='flex flex-col my-2'>
          <label className='text-xl mb-1 font-semibold' htmlFor="username">Username</label>

          <input className='h-10 border-2 Border_Color pl-2 outline-0 rounded-lg Border_Hover'
            {...register('Username',{required:'Field is required',
            minLength:{value:2,message:'Username must be between 2 and 20 characters'},
            maxLength:{value:20,message:'Username must be between 2 and 20 characters'}})}
           type="text"
           id='username' 
           placeholder='Enter Username' 
           autoComplete="off"/>
           {errors.Username &&(<p className='Red_Text_Color my-1 select-none '>{errors.Username.message}</p>)}
        </div>

        <div className='flex flex-col my-2 '>
          <label className='text-xl mb-1 font-semibold' htmlFor="password">Password</label>

          <section onMouseEnter={()=>sethovered(sh=>({...sh,password:true}))} onMouseLeave={()=>{sethovered(sh=>({...sh,password:false}))}} 
            className='h-10 border-2 Border_Color relative rounded-lg Border_Hover'>
            <input className='h-full w-full pl-2 outline-0' 
              {...register('Password',{required:'Field is required',
              minLength:{value:8, message:'Password must be between 8 and 25 characters'},
              maxLength:{value:25, message:'Password must be between 8 and 25 characters'}})}
             type={type.password}
             id='password' 
             placeholder='Enter Password'
             autoComplete="off"/>
             {(ishovered.password && type.password==='password') && (
              <IoMdEye className='absolute top-2.5 right-1 text-lg cursor-pointer' onClick={()=>settype(st=>({...st,password:'text'}))}/>)}

             {(ishovered.password && type.password==='text') &&(
              <IoMdEyeOff className='absolute top-2.5 right-1 text-lg cursor-pointer' onClick={()=>settype(st=>({...st,password:'password'}))}/>)}
          </section>
          {errors.Password &&(<p className='Red_Text_Color my-1 select-none'>{errors.Password.message}</p>)}
        </div>

        <div className='flex flex-col my-2 '>
          <label className='text-xl mb-1 font-semibold' htmlFor="Repeat">Repeat Password</label>

          <section onMouseEnter={()=>sethovered(sh=>({...sh,repeatepassword:true}))} onMouseLeave={()=>{sethovered(sh=>({...sh,repeatepassword:false}))}}
            className='h-10 border-2 Border_Color relative rounded-lg Border_Hover'>
            <input className='h-full w-full pl-2 outline-0 '
              {...register('Repeat_Password',{required:'Field is required',
              minLength:{value:8, message:'Password must be between 8 and 25 characters'},
              maxLength:{value:25, message:'Password must be between 8 and 25 characters'}})}
            type={type.repeatepassword} 
            id='Repeat'
            placeholder='Repeat Password'
            autoComplete="off"/>
            {(ishovered.repeatepassword && type.repeatepassword==='password') && (
              <IoMdEye className='absolute top-2.5 right-1 text-lg cursor-pointer' onClick={()=>settype(st=>({...st,repeatepassword:'text'}))}/>)}

            {(ishovered.repeatepassword && type.repeatepassword==='text') &&(
              <IoMdEyeOff className='absolute top-2.5 right-1 text-lg cursor-pointer' onClick={()=>settype(st=>({...st,repeatepassword:'password'}))}/>)}
         </section>
         {errors.Repeat_Password &&(<p className='Red_Text_Color my-1 select-none'>{errors.Repeat_Password.message}</p>)}
        </div>
        
         {errors.root &&(<p className='Red_Text_Color mt-5 select-none text-center'>{errors.root.message}</p>)}

        <div className='mt-5'>
            <button className='border-2 Border_Color rounded-xl w-full h-10 Border_Hover select-none text-xl mb-5 Accent_Color font-semibold'>{isSubmitting ? 'Loading...' : 'Submit'}</button>
        </div>

         <Link to={'/login'} className='Secondary_Text_Color hover:underline text-lg select-none'>Already have a user? click here to login</Link>
      </form>

    </div>
  )
}

export default NewUserForm