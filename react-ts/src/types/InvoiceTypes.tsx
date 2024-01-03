export type Link_ = {
    url: string,
    label: string,
    active: boolean,
}

export type Customer = {
    id?: number,
    first_name: string,
    last_name?:string,
    email?:string,
    address?:string,
}

export interface Product{
    id: number,
    item_code: string,
    description: string,
    unit_price: number,
}

export type InvoiceItem = {
    id?:number
    product: Product,
    unit_price: number,
    quantity: number,
}

export interface Invoice {
    id: number,
    number:string,
    customer: Customer,
    date:string,
    due_date:string,
    references:string,
    terms_and_conditions:string,
    sub_total:number,
    discount:number,
    total:number,
    cartItems:InvoiceItem[],
}

export interface Company {
    id?:number,
    name: string,
    phone: string,
    email: string,
    address: string,
    image: string | ArrayBuffer,
}








