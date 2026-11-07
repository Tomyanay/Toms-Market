

export type AdminShop={
    option:{User:boolean,Products:boolean,'New Product':boolean}
    ChooseOption:(type:string)=>void
}


export type user={
    username:string
}


export type AdminProducts={
    title:string,
    rating:number,
    price:string,
    newprice:string,
    images:string,
    product_id:number,
    category:string,
    description:string,
    amount:number
}

export type NewProduct={
    title:string,
    rating:number,
    price:string,
    images:string,
    category:string,
    description:string,
    amount:number
}