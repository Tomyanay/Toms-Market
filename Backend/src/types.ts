
export type PostgresError = Error & {
  code?: string
  constraint?: string
  detail?: string
}

import 'express'
declare global {namespace Express{interface Request {user?:{user_id:string}}}}
export {}


export type reviewperson={
    rating:number,
    comment:string,
    reviewerName:string,
    role:string,
    date:string
}