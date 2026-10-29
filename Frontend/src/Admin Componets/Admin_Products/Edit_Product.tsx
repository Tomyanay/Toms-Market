
import {api} from "../../Utilities/Api_Route";
import axios from "axios"

import type { AdminProducts } from "../AdminTypes"
import { Geners } from "../Admin_Data"
import {useForm, type SubmitHandler} from 'react-hook-form'
import { Globalstore } from "../../Utilities/Global_Store"

import RefreshCheck from "../../Utilities/Refresh_Check";

function Edit_Product({product,setChosenItem,setaction}:{product:AdminProducts,setChosenItem:React.Dispatch<React.SetStateAction<AdminProducts>>,
 setaction:React.Dispatch<React.SetStateAction<boolean>>}){

    const {register,handleSubmit,setError,formState:{errors,isSubmitting}}=useForm<AdminProducts>({defaultValues:product})

    const Set_Product:SubmitHandler<AdminProducts>=async (data)=>{
        if(data.price<=data.newprice){setError('price',{message:'Current Price must be bigger then the sale price'})}
        if(data.newprice>=data.price){setError('newprice',{message:'Sale price must be smaller then the Current price'})}
        if(!/\.(jpg|jpeg|png|webp|avif|gif|svg)(\?.*)?$/i.test(data.images)){setError('images',{message:'Invalid Image URL'})}
        
        try{
            const currentToken=Globalstore.getState().accesstoken
            await api.put('/Admin/updateproduct',{...data},{headers:{Authorization:`Bearer ${currentToken}`}})
            setaction(sa=>!sa)
            setChosenItem({title:'',rating:0,price:'',newprice:'',images:'',product_id:0,category:'',description:'',amount:0})
        }

        catch(error){ 
         if(axios.isAxiosError(error)){
           if(error.response?.status===401){
             const restore= await RefreshCheck()
             if(restore){Set_Product(data)}}}
         else{console.log('Admin Edit Product',error)}
         return ''
        }
    }

  return (
   <div className="p-2">
     <form  onSubmit={handleSubmit(Set_Product)}>

       <section className="flex flex-col my-3">
         <label htmlFor="name" className="text-xl mb-1 font-semibold">Product name</label>
         <input className="h-10 border-2 Border_Color pl-2 outline-0 rounded-lg Border_Hover"
          {...register('title',{required:'this field is required',
           minLength:{value:3, message:'name must be between 3 and 255 character'},
           maxLength:{value:255,message:'name must be between 3 and 255 characters '}
          })}
          type="text" 
          id="name" 
          placeholder='Enter Product Name' 
          autoComplete='off' />
         {errors.title && (<p className="Red_Text_Color my-1 select-none">{errors.title.message}</p>)}
        </section>

        <section className="flex flex-col my-3">
          <label htmlFor="rating" className="text-xl mb-1 font-semibold">Product rating</label>
          <input className="h-10 border-2 Border_Color pl-2 outline-0 rounded-lg Border_Hover"
           {...register('rating',{required:'this field is required',
             min:{value:1,message:'rating must be between 1 and 5'},
             max:{value:5,message:'rating must be between 1 and 5'},
             validate: (value) => {
             return !isNaN(Number(value)) || "rating must be a valid number!"}   
           })}
           type="text" 
           id="rating" 
           placeholder='Enter Product Rating' 
           autoComplete='off' />
          {errors.rating && (<p className="Red_Text_Color my-1 select-none">{errors.rating.message}</p>)}
        </section>

        <section className="flex flex-col my-3">
          <label htmlFor="price"  className="text-xl mb-1 font-semibold">Product price</label>
          <input className="h-10 border-2 Border_Color pl-2 outline-0 rounded-lg Border_Hover"
           {...register('price',{required:'this field is required',
             min:{value:0, message:'price must be between 0 and 100,000$'},
             max:{value:100000,message:'price must be between 0 and 100,000$'},
             validate: (value) => {
             return !isNaN(Number(value)) || "price must be a valid number!"}
           })}
           type="text" 
           id="price" 
           placeholder='Enter Product price' 
           autoComplete='off' />
          {errors.price && (<p className="Red_Text_Color my-1 select-none">{errors.price.message}</p>)}
        </section>

        <section className="flex flex-col my-3">
          <label htmlFor="newprice" className="text-xl mb-1 font-semibold">Product Sale price</label>
          <input className="h-10 border-2 Border_Color pl-2 outline-0 rounded-lg Border_Hover"
          {...register('newprice',{required:'this field is required',
             min:{value:0, message:'Sale price must be between 0 and 100,000$'},
             max:{value:100000,message:'Sale price must be between 0 and 100,000$'},
             validate: (value) => {
             return !isNaN(Number(value)) || "Sale price must be a valid number!"}
          })}
             type="text" 
             id="newprice" 
             placeholder='Enter Product Sale price' 
             autoComplete='off' />
            {errors.newprice && (<p className="Red_Text_Color my-1 select-none">{errors.newprice.message}</p>)}
        </section>

        <section className="flex flex-col my-3">
           <label htmlFor="images" className="text-xl mb-1 font-semibold">Product image</label>
           <input className="h-10 border-2 Border_Color pl-2 outline-0 rounded-lg Border_Hover"
           {...register('images',{required:'this field is required',
              minLength:{value:3, message:'name must be between 3 and 255 character'},
              maxLength:{value:255,message:'name must be between 3 and 255 characters'}
            })}
            type="text" 
            id="images" 
            placeholder='Enter Product image URL' 
            autoComplete='off' />
           {errors.images && (<p className="Red_Text_Color my-1 select-none">{errors.images.message}</p>)}
        </section>

        <section className="flex flex-col my-3">
           <label htmlFor="amount" className="text-xl mb-1 font-semibold">Product amount</label>
           <input className="h-10 border-2 Border_Color pl-2 outline-0 rounded-lg Border_Hover"
           {...register('amount',{required:'this field is required',
               min:{value:10, message:'amount must be between 10 and 500'},
               max:{value:500,message:'amount must be between 10 and 500'},
               validate: (value) => {
              return !isNaN(Number(value)) || "amount must be a valid number!"}
            })}
            type="text" 
            id="amount" 
            placeholder='Enter Product amount' 
            autoComplete='off' />
           {errors.amount && (<p className="Red_Text_Color my-1 select-none">{errors.amount.message}</p>)}
        </section>

        <section className="flex flex-col my-3">
          <label htmlFor="Geners" className="text-xl mb-1 font-semibold">Product category</label>
          <select className="h-10 border-2 Border_Color pl-2 capitalize outline-0 rounded-lg Border_Hover"
            {...register('category')}
             id="Geners"
             autoComplete="off">
            {Geners.map((v)=><option className=" capitalize" key={v}>{v}</option>)}
          </select>
        </section>
     
        <section className="flex flex-col my-5">
         <label htmlFor="Description" className="text-xl mb-1 font-semibold">Product Description</label>
         <textarea 
          {...register('description',{required:'this field is required',
            minLength:{value:3, message:'description must be between 3 and 255 character'},
            maxLength:{value:255,message:'description must be between 3 and 255 characters '}
          })}
          id="Description"
          autoComplete='off' 
          placeholder="Enter Product description"
          className=" resize-none NoScrollbar h-30 border-2 Border_Color pt-0.5 px-1.5 outline-0 rounded-lg Border_Hover"> 
         </textarea>
            {errors.description && (<p className="Red_Text_Color my-1 select-none">{errors.description.message}</p>)}
        </section>

        <div className='mt-5'>
          <button className='border-2 Border_Color rounded-xl w-full h-10 Border_Hover text-xl mb-5 Accent_Color font-semibold select-none'>{isSubmitting ? 'Loading...' : 'Submit'}</button>
          <button onClick={()=>setChosenItem({title:'',rating:0,price:'',newprice:'',images:'',product_id:0,category:'',description:'',amount:0})} 
           className='border-2 Border_Color rounded-xl w-full h-10 Border_Hover text-xl mb-5 Red_Text_Color  font-semibold select-none'>Back To Products
          </button>
        </div> 

     </form>
   </div>
  )
}

export default Edit_Product