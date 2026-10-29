
import type {reviewperson} from "../Home Componets/Home types"
import { FaStar } from "react-icons/fa";
import { Globalstore } from "../Utilities/Global_Store";

function Reviews({reviewer,index,length,DeleteCommand}:{reviewer:reviewperson,index:number,length:number,DeleteCommand:(reviewername:string)=>void}) {

  const {user}=Globalstore()

  return (
    <div className={`mx-3.5 py-2.5 overflow-y-auto NoScrollbar max-h-95  ${index+1<length ?'border-b-2 border-secondary dark:border-dark-secondary' : ''}`}>
        <div className="flex">
          <section className="mx-2 mb-15 rounded-lg transition-colors mt-2.5">
           <div className="bg-linear-to-br from-accent to-accent/80 dark:from-dark-accent dark:to-dark-accent/80 text-white dark:text-gray-900 
             rounded-full w-9 h-9 flex justify-center items-center shadow-sm border border-black/10 dark:border-white/10 ">
             <p className="font-bold text-sm tracking-wide select-none">{reviewer.reviewerName.slice(0,1)}</p>
           </div>    
          </section> 

          <section className="w-full">

            <section className="flex items-center justify-between">
              <p className=" text-[19px]  Orange_Text_Color tracking-tight ">{reviewer.reviewerName}</p>
              <p className=" Secondary_Text_Color">{reviewer.role}</p>
            </section>

            <div className=" flex items-center mt-1 mb-1.5 ">
              {new Array(5).fill('').map((_,i)=><FaStar key={i} className={`${reviewer.rating>=i+1 ? 'text-yellow-300' : ''} text-lg mx-px `}  />)}
            </div>

            <p className="text-base normal-case wrap-break-word pl-0.5 ">{reviewer.comment}</p>

            <section className="flex items-center justify-between mt-1.5 mr-1.5">
             <p className=" Secondary_Text_Color">{new Date(reviewer.date).toLocaleDateString()}</p>
             {(user.username===reviewer.reviewerName || (user.role==='Admin' && reviewer.role!=='Admin')) &&(
              <button onClick={()=>{DeleteCommand(reviewer.reviewerName)}} className="Red_Text_Color font-semibold Text_Hover select-none cursor-pointer "> Delete comment</button>)}
            </section>

          </section>  
        </div>
    </div>
  )
}

export default Reviews