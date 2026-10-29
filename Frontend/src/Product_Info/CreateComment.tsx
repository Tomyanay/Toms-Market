
import type { AddComment } from "./Product types";
import { FaStar } from "react-icons/fa";

function CreateComment({properties,setproperties,CreateUpdateComment}:{properties:AddComment,
setproperties: React.Dispatch<React.SetStateAction<AddComment>>,CreateUpdateComment:(FormData:FormData)=>void}) {
  return (
    <section className="my-5 Outer_Section_Background mx-2 rounded-lg ">
      <h1 className=" Orange_Text_Color text-lg font-semibold pt-2 ml-3">{`${properties.exists ? 'Edit' : 'Add'}`} comment</h1> 
      <form className="mx-3.5" action={CreateUpdateComment} >
        <div className=" flex justify-center items-center mt-1 mb-1.5 ">
           {new Array(5).fill('').map((_,i)=><FaStar onClick={()=>setproperties(sp=>({...sp,rating:i+1}))} key={i}
           className={`${properties.rating>= i+1 ? 'text-yellow-300' : ''} cursor-pointer text-2xl mx-1.5`}/>)}
        </div>
    
        <div>
           <textarea 
              onChange={(e)=>{if(properties.comment.length<=500){setproperties(sp=>({...sp,comment:e.target.value}))}}} 
              value={properties.comment} 
              maxLength={500}
              required
              name="Comment"
              className=" outline-0 resize-none border-2 Border_Hover normal-case Border_Color rounded-lg pt-0.5 px-1.5 text-lg h-30 mt-5 w-full NoScrollbar">
            </textarea> 
            <p className={`${properties.comment.length===500 ? 'Red_Text_Color' : 'Secondary_Text_Color'} text-end `}>{properties.comment.length}/500</p>
        </div>
    
        <button type='submit' className='border-2 Border_Color rounded-xl h-10 Border_Hover w-full my-5 text-lg  Accent_Color font-semibold select-none'>Submit</button>    
                 
      </form>
    </section>  
  )
}

export default CreateComment