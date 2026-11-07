
import type { AdminProducts } from "../AdminTypes"
import { TiDelete } from "react-icons/ti";
import {motion} from 'motion/react'
import type React from "react";

function Found_Products({product,setChosenItem,DeleteProduct}:
{product:AdminProducts,setChosenItem:React.Dispatch<React.SetStateAction<AdminProducts>>,DeleteProduct:(product_id:number)=>void}) {
  
  return (
    <motion.div initial={{opacity:0,x:-250}} animate={{opacity:1,x:0}} transition={{duration:.5,ease:'easeInOut'}}
      title={product.title}onClick={()=>setChosenItem(product)} 
      className="Card_Hover mx-1 my-1.5 py-2 font-semibold rounded-xl text-sm sm:text-lg cursor-pointer grid grid-cols-3">
      
      <section className="ml-2 flex items-center justify-center">
       <img draggable={false} src={product.images} className="select-none w-15 h-15 rounded-xl sm:w-25 sm:h-25" alt={`${product.title} Image`} />
      </section>
      
      <section className="flex items-center justify-center text-center Orange_Text_Color">
        <h1 className="line-clamp-1 sm:line-clamp-none">{product.title}</h1>
      </section>

      <section onClick={(e)=>{e.stopPropagation();DeleteProduct(product.product_id)}}
       className="flex justify-center items-center Red_Text_Color cursor-pointer Text_Hover select-none">
       <TiDelete className="mr-1"/>
       <p>Delete</p>
      </section>
    </motion.div>
  )
}

export default Found_Products