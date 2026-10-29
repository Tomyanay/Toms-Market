
import {FaMagnifyingGlass} from "react-icons/fa6";

function Admin_Search({searchedAdmin,setSearchedAdmin,message}:
{searchedAdmin:string,setSearchedAdmin:React.Dispatch<React.SetStateAction<string>>,message:string}) {

  function Search(Formdata:FormData){
    const result=Formdata.get('search') as string
    setSearchedAdmin(result)
  }

  return (
    <form action={Search} className="relative text-base h-10 border-3 Border_Color rounded-xl my-3">
      <FaMagnifyingGlass className="absolute Accent_Color text-base sm:text-xl top-2.5 sm:top-2 left-1.5"/>
      <p className=" bg-transparent select-none absolute top-1.5 sm:top-1 right-1 text-base sm:text-xl Red_Text_Color Text_Hover "
         onClick={()=>setSearchedAdmin('')}>X</p>
      <input className="w-[94%] h-full pl-7 font-Inter outline-0 "
        placeholder={message}
        autoComplete="off"
        name="search"
        value={searchedAdmin}
        onChange={(e)=>{setSearchedAdmin(e.target.value)}} 
        type="text" />
    </form>
  )
}

export default Admin_Search