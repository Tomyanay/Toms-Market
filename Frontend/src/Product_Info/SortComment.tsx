
import type { sort } from "./Product types"

function SortComment({value,SortComments,ordertype}:{value:sort,SortComments:(type:string)=>void,ordertype:string}) {
  return (     
    <section onClick={()=>SortComments(value.type)} className={`flex items-center ${ordertype===value.type ? 'Green_Text_Color' : 'Orange_Text_Color'} Text_Hover cursor-pointer`}>
      <value.icon className="mx-0.5 Secondary_Text_Color"/>
      <p>{value.sort}</p>
    </section>
  )
}
export default SortComment