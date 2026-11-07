
import {motion} from 'motion/react'
import { Home_Store } from "./Homestore";

function Categorys({value}:{value:{categoryname:string,url:string}}) {

  const {category,setcategory,setpage,setindex}=Home_Store()

  return (
    <motion.div initial={{opacity:0,y:-250}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-250}}  transition={{duration:.5,ease:'easeInOut'}}
     onClick={()=>{setcategory(value.categoryname);setpage(1);setindex(0)}} 
     className={`border-3 ${value.categoryname===category ? 'Green_Text_Color' : 'Border_Color Border_Hover Text_Hover'} h-20
     w-full flex items-center justify-center text-lg lg:text-xl text-center font-bold Text_Shadow  Orange_Text_Color  cursor-pointer rounded-lg `}
     style={{backgroundImage:`url(${value.url})`,backgroundRepeat:'no-repeat',backgroundPosition:'center', backgroundSize:'cover'}}>

      <p className='italic select-none'>{value.categoryname}</p>

    </motion.div>
  )
}

export default Categorys