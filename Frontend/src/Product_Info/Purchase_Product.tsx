
import type { itemtype } from "../Home Componets/Home types"

function Purchase_Product({product,quantity,isUpdating,isshowingword,setshowingword,ChangeQuantity}:
{product:itemtype,quantity:number,isUpdating:boolean,isshowingword:boolean,ChangeQuantity:(type:string)=>void,setshowingword:React.Dispatch<React.SetStateAction<boolean>>}) {

  return (
    <div className="mt-5 mb-10 relative">
       <h1 className="Accent_Color text-xl font-semibold ml-1.5">purchase</h1>

       <section className=" flex justify-between mt-2.5 font-semibold text-lg">
         <p className={`${product.amount>0 ? 'Orange_Text_Color' : 'Red_Text_Color '} ml-1.5 `}>{product.amount} items left</p>
         <p className="Orange_Text_Color mr-1.5 ">{parseFloat(product.newprice) ? product.newprice : product.price}$</p>
       </section>

       <section className="flex justify-center items-center text-4xl my-5 select-none">  
         <button 
           onClick={()=>{ChangeQuantity('-')}}
           disabled={quantity===0 || product.amount===0 && quantity===0 || isUpdating} 
           className={`mx-3 ${quantity===0 || product.amount===0 && quantity===0 || isUpdating ? 'Secondary_Text_Color cursor-not-allowed' : 'Orange_Text_Color cursor-pointer'} 
           Bg_Hover border-2 Border_Color rounded-full w-10 h-10 flex items-center justify-center `}>
            -
         </button>

          <p onMouseEnter={()=>setshowingword(true)} onMouseLeave={()=>setshowingword(false)} className="Accent_Color">
           {quantity}
           {isshowingword &&(<span className="text-lg Secondary_Text_Color ml-1">items</span>)}
          </p>

          <button 
           onClick={()=>{ChangeQuantity('+')}}
           disabled={product.amount===0  || quantity===0 && product.amount===0 || quantity>=product.amount || isUpdating}
           className={`mx-3 Bg_Hover ${product.amount===0 || quantity===0 && product.amount===0 || quantity>=product.amount || isUpdating ? 'Secondary_Text_Color cursor-not-allowed' : 
           'Orange_Text_Color cursor-pointer'} border-2 Border_Color rounded-full w-10 h-10 items-center justify-center `}>
            +
          </button>
       </section> 

        {product.amount===0 &&(<p className='text-center Red_Text_Color font-semibold text-lg md:text-xl my-5 select-none'>Out of stock</p>)} 

    </div>
  )
}

export default Purchase_Product