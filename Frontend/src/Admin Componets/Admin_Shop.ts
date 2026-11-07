

import { create } from "zustand";

import type { AdminShop } from "./AdminTypes";

export const Adminshop=create<AdminShop>((set)=>({
    option:{User:true,Products:false,'New Product':false},
    
    ChooseOption:(type)=>set((state)=>{
        const options={...state.option}
        for(const key in options){
            if(type===key){options[type as keyof typeof options]=true}
            else{options[key as keyof typeof options]=false}}
        return {option:options}
    }),

}))