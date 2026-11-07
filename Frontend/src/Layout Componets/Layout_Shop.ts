
import { create } from "zustand";
import type { LayoutStore } from "./Layout_types";

export const layout_store=create<LayoutStore>((set)=>({
        showcart:false,
        setshowcart:(veriable)=>set({showcart:veriable}),
        
        NewCart:false,
        setCart:(veriable)=>set({NewCart:veriable})
}))