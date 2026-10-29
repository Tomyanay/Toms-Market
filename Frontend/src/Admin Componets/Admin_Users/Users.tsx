
import { api } from "../../Utilities/Api_Route";
import axios from "axios"

import { useQuery } from "@tanstack/react-query"
import { Globalstore } from "../../Utilities/Global_Store";

import type { user } from "../AdminTypes";

import  RefreshCheck from "../../Utilities/Refresh_Check";

import Found_Users from "./Found_Users";
import Admin_Search from "../Admin_Global/Admin_Search";

import { useState } from "react";


function Users() {

   const [allusers,getusers]=useState<user[]>([]) //All of our client users
    
   const [searchedAdminUser,setSearchedAdminUser]=useState('') //The item we search for currently

   const [action,setaction]=useState(false)
    
   const [notfoundmessage,setnotfoundmessage]=useState('') //Not finding what we want to
    
   async function GetAllUsers(){
      try{
        const currentToken=Globalstore.getState().accesstoken
        const users=await api.get(`/Admin/users/?user=${searchedAdminUser}`,{headers:{Authorization:`Bearer ${currentToken}`}})
        if(typeof(users.data.message)==='string'){
          setnotfoundmessage(users.data.message)
          getusers([])}

        else{
          getusers(users.data)
          setnotfoundmessage('')}
         
        return ''
      }

       catch(error){
         if(axios.isAxiosError(error)){
           if(error.response?.status===401){
           const restore= await RefreshCheck()
           if(restore){GetAllUsers()}}}
         else{console.log('Admin Get Users',error)}
         return ''
        }
     }

  async function SetRole(username:string){
      try{
          const currentToken=Globalstore.getState().accesstoken
          await api.post('/Admin/setrole',{username:username},{headers:{Authorization:`Bearer ${currentToken}`}})
          setSearchedAdminUser('')
          setaction(sa=>!sa)
      } 

      catch(error){
        if(axios.isAxiosError(error)){
          if(error.response?.status===401){
          const restore= await RefreshCheck()
          if(restore){SetRole(username)}}}
        else{console.log('Admin Role Users',error)}
        return ''
       }
     }


  async function DeleteUser(username:string) {
      try{
         const currentToken=Globalstore.getState().accesstoken
         await api.delete(`/Admin/deleteuser/${username}`,{headers:{Authorization:`Bearer ${currentToken}`}})
         setSearchedAdminUser('')
         setaction(sa=>!sa)
       }

      catch(error){
        if(axios.isAxiosError(error)){
          if(error.response?.status===401){
          const restore= await RefreshCheck()
          if(restore){DeleteUser(username)}}}
        else{console.log('Admin Delete User',error)}
        return ''
      }
    }


  const {isLoading}=useQuery({queryKey:['Admin_Users',searchedAdminUser,action],queryFn:GetAllUsers}) 

  return (
    <div>
       <h1 className="text-xl font-semibold Accent_Color">All client Users</h1>
       <Admin_Search searchedAdmin={searchedAdminUser} setSearchedAdmin={setSearchedAdminUser} message="Search for Users"/>

       {(!isLoading && allusers.length>0) && (
       <>
        <section className="text-center"> 
         <p className="Secondary_Text_Color text-base pb-2.5 ">Press the "Promote" button to give the chosen user admin privlages and the "Delete User" button to delete the chosen user </p> 
         <p className="Red_Text_Color font-bold text-base pb-2"> <span className="text-lg"> Warning!!!</span> The actions of giving a user admin privlages is inreverseable!!!</p>   
        </section>

        <section className=" border-3 Border_Color rounded-xl my-2 max-h-screen overflow-y-auto NoScrollbar"> 
             {allusers.sort((a,b)=>a.username.localeCompare(b.username)).map((v)=><Found_Users SetRole={SetRole} DeleteUser={DeleteUser} key={v.username} user={v}/>)}   
        </section>
      </>)}

      {(!isLoading && allusers.length===0) &&(<p className="Non_Data_State">{notfoundmessage}</p>)} 
      {isLoading && allusers.length===0 &&(<p className="Non_Data_State">Loading Users...</p>)}
    </div>
  )
}

export default Users