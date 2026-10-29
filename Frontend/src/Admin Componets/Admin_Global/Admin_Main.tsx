
import { RiAdminFill } from "react-icons/ri";

import Users from "../Admin_Users/Users";
import Create_Product from "../Admin_Create_Product/Create_Product";
import All_Products from "../Admin_Products/All_Products";

import { Admin_Options } from "../Admin_Data";

import { Adminshop } from "../Admin_Shop";

import {motion} from 'motion/react'


function Admin_Main() {

  const {option,ChooseOption}=Adminshop()

  return (
     <div className="Inner_Section_Background">
       <section className="flex items-center text-2xl font-semibold p-1 ">
         <RiAdminFill className="Secondary_Text_Color"/>
         <h1 className="mx-0.5 Orange_Text_Color">Admin Options</h1>
       </section>
        
       <section className=" mx-[5%] md:mx-[25%] 2xl:mx-[35%] my-5 flex justify-between items-center">
         {Admin_Options.map((o,i)=>(
          <motion.div whileHover={{scale:1.05}} transition={{type:'spring',stiffness:120}} 
            key={i} 
            className=" text-center rounded-xl Card_Hover ">
            <button 
             onClick={()=>{ChooseOption(o)}} 
             className={`${option[o as keyof typeof option]  ?  'Green_Text_Color' : 'Accent_Color '} text-lg lg:text-xl xl:text-2xl Text_Hover font-semibold p-1.5 `}>{o}</button>
          </motion.div>
          ))}
       </section>

       <section className="p-5 md:mx-[15%] lg:mx-[20%] xl:mx-[25%] 2xl:mx-[30%] ">
          {option.User &&(<Users/>)}
          {option.Products &&(<All_Products/>)}
          {option["New Product"] &&(<Create_Product/>)}
       </section>   
     </div>
  )
}

export default Admin_Main