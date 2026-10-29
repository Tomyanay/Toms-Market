
import type { itemtype } from "../../Home Componets/Home types"
import {motion} from 'motion/react'
import { FaStar } from "react-icons/fa";
import Sale from '../assets/sale-icon.webp'


function Products({product,Eventfunc}:{product:itemtype,Eventfunc:(product:itemtype)=>void}) {
  return (
    <motion.div onClick={()=>{Eventfunc(product)}} initial={{opacity:0}} animate={{opacity:1}} whileHover={{scale:1.04}} transition={{duration:.5,ease:'easeInOut'}}
        style={{backgroundImage:`url("${encodeURI(product.images)}")`,backgroundRepeat:'no-repeat',backgroundSize:'contain', backgroundPosition:'center'}}
         className="Outer_Section_Background italic  Card_Hover border-3 Border_Color Border_Hover rounded-xl relative cursor-pointer h-65 flex flex-col justify-end ">
        <section className="text-lg sm:text-xl select-none">
          <h1 className="line-clamp-1 font-semibold Accent_Color mx-1 Text_Shadow ">{product.title}</h1>
          <section className=" flex items-center ">
            <p className=" Orange_Text_Color mx-1">{product.rating}</p>
            <FaStar className="text-yellow-300 mx-0.5 "/>
          </section>
        </section>
        
        {parseFloat(product.newprice)>0 &&(<img className=" absolute w-15 h-15 sm:w-20 sm:h-20 top-0 right-0" src={Sale} alt="Sale Image"/>)}

        <section className=" flex justify-around items-center text-lg sm:text-xl  select-none">
            <p className={`${parseFloat(product.newprice)>0 ? 'line-through Secondary_Text_Color' : 'text-center font-semibold Green_Text_Color '}`}>{product.price}$</p>
            {parseFloat(product.newprice)>0 && (<p className="text-center font-semibold Green_Text_Color">{product.newprice}$</p>)}
        </section>       
    </motion.div>
  )
}

export default Products