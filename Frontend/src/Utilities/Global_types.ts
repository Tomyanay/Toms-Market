

export type GlobalStore={
   user:userinfo
   setuser:(username:string,role:string,isdark:boolean)=>void,
   clearuser:()=>void
   
   accesstoken:string,
   getaccesstoken:(Token:string)=>void,
   cleartoken:()=>void
}

export type userinfo={
    username:string,
    role:string,
    isdark:boolean
}