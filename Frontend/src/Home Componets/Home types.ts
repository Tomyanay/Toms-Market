

export type Store={
    category:string,
    setcategory:(categoryname:string)=>void,

    SortedName:string
    SortedType:string,
    SetSort:(NewName:string,NewType:string)=>void,

    page:number,
    setpage:(newpage:number)=>void

    index:number,
    setindex:(newindex:number)=>void,

    Enablecategory:boolean,
    Set_Enable_Category:(newenable:boolean)=>void
}

export type itemtype={
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

export type reviewperson={
    rating:number,
    comment:string,
    reviewerName:string,
    role:string,
    date:string
}