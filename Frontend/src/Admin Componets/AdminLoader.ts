
import { Globalstore } from "../Utilities/Global_Store"
import { redirect } from 'react-router-dom';

function AdminLoader(){
    const userrole=Globalstore.getState().user.role
    if(userrole!=='Admin'){throw redirect('/')}
    return ''
}

export default AdminLoader