
import {FaMagnifyingGlass} from "react-icons/fa6";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Search() {

  const [Searcheditem,setSearched]=useState('')
  const nav=useNavigate()

  function FindItem(FormData:FormData){
      const item=FormData.get('Search') as string
      if(item.trim()!==''){nav(`/Search/?product=${item}`)} 
  }

  return (
    <form action={FindItem}>
        <div className="relative text-base sm:text-xl h-10 w-70 lg:w-90 border-3 Border_Color rounded-xl">
          <FaMagnifyingGlass className="absolute Accent_Color text-base sm:text-xl top-2.5 sm:top-2 left-1.5"/>
          <button type='button'
           className=" bg-transparent select-none absolute top-1.5 sm:top-1 right-1 text-base sm:text-xl Red_Text_Color Text_Hover "
           onClick={()=>setSearched('')}>X</button>
          <input 
          className="w-[94%] h-full pl-7 font-Inter outline-0  "
          placeholder="Search for Groceries"
          autoComplete="off"
          name="Search"
          maxLength={40}
          value={Searcheditem}
          onChange={(e)=>{setSearched(e.target.value)}}
          type="text" />
        </div>
    </form>
  )
}

export default Search