

import { create } from "zustand";

import type { Store } from "./Home types";

export const Home_Store=create<Store>((set)=>({
    category:'All',
    setcategory:(categoryname)=>set({category:categoryname}),

    SortedName:'title',
    SortedType:'base',
    SetSort:(NewName, NewType)=>set({SortedName:NewName,SortedType:NewType}), 

    page:1,
    setpage:(newpage)=>set({page:newpage}),

    index:0,
    setindex:(newindex)=>set({index:newindex}),

    Enablecategory:false,
    Set_Enable_Category:(newenable)=>set({Enablecategory:newenable})

}))