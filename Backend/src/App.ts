
import express from 'express'

import cookieParser from 'cookie-parser'
import cors from 'cors'

import { checkDatabaseConnection } from './DB.js'

import CheckAccess from './Middleware/accesstoken.js'
import Checkrole from './Middleware/Checkrole.js'

import { User_Router } from './Routes/Users.js'
import { Product_Route } from './Routes/Products.js'
import { Adminroute } from './Routes/Admin.js'

import dotenv from 'dotenv'
dotenv.config()

export const app=express()

app.use(express.json())

app.use(cookieParser())

app.use(cors({origin:String(process.env.FRONTEND_URL),credentials:true})) 

checkDatabaseConnection()

app.use('/user',User_Router)
app.use('/product',Product_Route)
app.use('/Admin',CheckAccess,Checkrole,Adminroute)
