
import { Link } from 'react-router-dom'
import notfound from './assets/404 Error-amico.png'

import {Set_Screen_Mode} from '../Utilities/Set_Screen_Mode'

function Error() {

  Set_Screen_Mode()

  return (
    <div className='flex flex-col h-screen justify-center items-center'>
      <img className='w-150 h-150 select-none border-3 Border_Color Border_Hover rounded-lg' src={notfound} alt="Error Image" draggable={false} />
      <p className='Secondary_Text_Color mx-2 my-5 xl:mx-0 text-xl xl:text-2xl text-center'>404 - Page was not found <br/>press 
      <Link className='Red_Text_Color Text_Hover font-semibold' to={'/'}> This</Link> to go back to Home </p>
   </div>)}

export default Error