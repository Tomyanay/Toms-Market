
import {createBrowserRouter,RouterProvider,Route,createRoutesFromElements}  from 'react-router-dom'

import Error from './Error Componets/Error'
import NewUserForm from './Form Componets/NewUserForm'
import Layout from './Layout Componets/Layout'
import Login from './Form Componets/Login'
import Admin_Main from './Admin Componets/Admin_Global/Admin_Main'
import Home from './Home Componets/Home'
import Result from './Layout Componets/Search Componets/Result'

import AdminLoader from './Admin Componets/AdminLoader'

 const router=createBrowserRouter(createRoutesFromElements(
    <Route path='/' errorElement={<Error/>}>
       <Route element={<Layout/>}>
         <Route index element={<Home/>}/>
         <Route path='/Search' element={<Result/>}/>
         <Route path='/Admin' element={<Admin_Main/>} loader={AdminLoader} />
       </Route>
      
       <Route path='/newuser' element={<NewUserForm/>}/>
       <Route path='/login' element={<Login/>}/> 
       
    </Route>
 ))

function App(){

  return( 
    <>
    <RouterProvider router={router}/>
    </>
  )
}
export default App