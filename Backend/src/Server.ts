
import dotenv from 'dotenv'
import { app } from './App.js'

dotenv.config()

const port=Number(process.env.PORT) || 3000

app.listen(port,()=>console.log('Server is Running'))
.on('error',(error)=>console.log(error.message))