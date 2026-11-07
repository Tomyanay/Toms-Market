
import { Globalstore } from "../Utilities/Global_Store";
import { api } from "../Utilities/Api_Route";
import axios from "axios";

async function RefreshCheck() {
  try {
    const response = await api.post('/user/refresh')
    const Data = response.data
    Globalstore.getState().getaccesstoken(Data.accesstoken)
    Globalstore.getState().setuser(Data.username, Data.role, Data.isdark)
    return true
  } 
    
  catch (error) {
   
     console.log('Refresh Error', error);

     if (axios.isAxiosError(error) && (error.response?.status === 401)) {
      Globalstore.getState().cleartoken();
      Globalstore.getState().clearuser();
      window.location.href = '/login'}
     else {console.error('Non-auth error during refresh, keeping session state.')}
  }
}

export default RefreshCheck;