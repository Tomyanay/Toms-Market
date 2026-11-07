
import type { user } from "../AdminTypes";
import {motion} from 'motion/react'

import { FaRegUser } from "react-icons/fa";
import { TiUserDelete } from "react-icons/ti";
import { RiUserStarFill } from "react-icons/ri";

function Found_Users({user,SetRole,DeleteUser}:{user:user,SetRole:(username:string)=>void,DeleteUser:(username:string)=>void}) {

  return (
    <motion.div initial={{opacity:0,x:-250}} animate={{opacity:1,x:0}} transition={{duration:.5,ease:'easeInOut'}} 
       className="Card_Hover px-1 mx-1 my-1.5 py-2 font-semibold rounded-lg text-sm sm:text-lg grid grid-cols-3">

      <section className="Orange_Text_Color flex items-center  ">
        <FaRegUser className="mr-1"/>
        <p title={user.username} className="line-clamp-1">{user.username}</p>
      </section>

        <section className="flex items-center Accent_Color select-none cursor-pointer Text_Hover justify-center ">
          <RiUserStarFill className="mr-1"/>
          <p onClick={()=>SetRole(user.username)} 
          title="Click to give Admin privlages" 
          className="">Promote</p>
        </section>
 

      <section onClick={()=>DeleteUser(user.username)} className="flex items-center justify-center Red_Text_Color cursor-pointer Text_Hover select-none">
        <TiUserDelete className="mr-1"/>
        <p>Delete</p>
      </section>
    </motion.div>
  )
}

export default Found_Users