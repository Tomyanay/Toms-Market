
import { Globalstore } from "../Utilities/Global_Store"

import RefreshCheck from "../Utilities/Refresh_Check";

import axios from "axios";
import { api } from "../Utilities/Api_Route";

async function AdminLoader(){
    try{await api.get('/user/access',{headers:{Authorization:`Bearer ${Globalstore.getState().accesstoken}`}})}

    catch(error){
     if(axios.isAxiosError(error)){
        if(error.response?.status===401){
          const restore=await RefreshCheck()
          if(restore){AdminLoader()}}   
        else if(error.response?.status===403){throw window.location.href='/'}
        else {throw window.location.href='/'}
      }

     else{console.log('Admin Error',error)}
    }
}

export default AdminLoader