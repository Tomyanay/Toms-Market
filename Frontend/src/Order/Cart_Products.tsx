

import { useState } from "react";
import type { cartproduct } from "./Cart_types"
import {motion} from 'motion/react'

function Cart_Products({product,RemoveFromcart}:{product:cartproduct,RemoveFromcart:(product_id:number)=>void}) {

    const [exit,setexit]=useState(false)

  return (
    <motion.div initial={{opacity:0,x:-250}} animate={{opacity:1,x:0}} transition={{duration:.5,ease:'easeInOut'}}
     onMouseEnter={()=>setexit(true)} onMouseLeave={()=>setexit(false)}
      className=" rounded-lg mx-1 my-3 xl:mx-3 py-1 relative Card_Hover Text_Hover Outer_Section_Background">

         {exit && (<p onClick={()=>{RemoveFromcart(product.product_id)}}className="Red_Text_Color text-lg font-semibold absolute right-1 top-0 cursor-pointer">X</p>)}

         <section className={`flex justify-between ${product.amount===0 && 'mt-6'} items-center select-none text-base lg:text-lg `}>
          <img draggable={false} className=" w-20 h-20 mx-2 rounded-xl" src={product.images} alt="product image" />
          <p title={product.title}>{product.quantity} X {product.title}</p>
          <p className=" mx-3 Orange_Text_Color text-center italic">{parseFloat(product.price)*product.quantity}$</p>
         </section>

         {product.amount===0 && (<p className=" Red_Text_Color font-semibold text-sm lg:text-base text-center mx-[35%] select-none ">Out of stock</p>)}
       
    </motion.div>
  )
}

export default Cart_Products