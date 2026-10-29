
import { Globalstore } from "../Utilities/Global_Store";
import { api } from "../Utilities/Api_Route";

 async function RefreshCheck(){
    try{
        const response=await api.post('/user/refresh')
        const Data=response.data
        Globalstore.getState().getaccesstoken(Data.accesstoken)
        Globalstore.getState().setuser(Data.username,Data.role,Data.isdark)
        return true
      }

     catch(error){
        console.log('Refresh Error',error)
        Globalstore.getState().cleartoken()
        Globalstore.getState().clearuser()
        window.location.href='/login'
        return false}
}

export default RefreshCheck