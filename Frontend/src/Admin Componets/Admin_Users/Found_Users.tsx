
import type { user } from "../AdminTypes";
import {motion} from 'motion/react'

import { FaRegUser } from "react-icons/fa";
import { TiUserDelete } from "react-icons/ti";

function Found_Users({user,SetRole,DeleteUser}:{user:user,SetRole:(username:string)=>void,DeleteUser:(username:string)=>void}) {

  return (
    <motion.div initial={{opacity:0,x:-250}} animate={{opacity:1,x:0}} transition={{duration:.5,ease:'easeInOut'}} 
       className="Card_Hover mx-2 px-2 my-1.5 py-2 font-semibold rounded-xl text-sm sm:text-lg flex items-center justify-between">

      <section className="Orange_Text_Color flex items-center">
        <FaRegUser className="mr-2 sm:mr-1.5"/>
        <p>{user.username}</p>
      </section>

      <p onClick={()=>SetRole(user.username)} title="Click to give Admin privlages " className="Accent_Color select-none cursor-pointer Text_Hover  mr-5 sm:mr-0 ">Promote</p>

      <section onClick={()=>DeleteUser(user.username)} className="flex items-center Red_Text_Color cursor-pointer Text_Hover select-none ">
        <TiUserDelete className=" mr-2 sm:mr-1.5"/>
        <p>Delete User</p>
      </section>
    </motion.div>
  )
}

export default Found_Users