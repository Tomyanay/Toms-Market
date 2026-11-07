
import type { IconType } from "react-icons/lib"

export type AddComment={
    comment:string,
    rating:number,
    exists:boolean
}

export type sort={
    sort:string,
    type:string,
    icon:IconType
}