
import {create} from 'zustand'
import { persist } from "zustand/middleware"
import type { GlobalStore } from './Global_types'


export const Globalstore=create<GlobalStore>()(persist((set)=>({
     user:{username:'',role:'',isdark:false},
     setuser:(username,role,isdark)=>set((state)=>({user:{...state.user,username:username,role:role,isdark:isdark}})),
     clearuser:()=>set((state)=>({user:{...state.user,username:'',role:'',isdark:false}})),
     
     accesstoken:'',
     getaccesstoken:(token)=>set({accesstoken:token}),
     
     cleartoken:()=>set({accesstoken:''})

}),{name:'Global'}))