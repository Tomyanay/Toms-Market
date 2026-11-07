
import pkg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const {Pool}=pkg

export const pool=new Pool({connectionString:process.env.ConnectionString})

export async function checkDatabaseConnection() {
  try {
    await pool.query('SELECT 1')
    console.log('Database connection successful')} 
  catch (error) {
    if(error instanceof Error){console.log('Database connection failed:', error.message)}
    else{console.log('Database connection failed:',error)}
   }
}
