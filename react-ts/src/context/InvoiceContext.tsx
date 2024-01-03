import React, { useEffect, createContext, useContext, useReducer,  useState} from "react";
import axiosClient from "../axiosClient";
import { useSearchParams } from "react-router-dom";
import { Invoice, Customer, Link_ } from "../types/InvoiceTypes";


type StateType = {
    invoices: Invoice[],
    invoice_links?: Link_[],
    customers?: Customer[],
    errors?:any,
    updateErrors?: any,
}

type ActionType = {
    type: 'INITIAL_INVOICE' | 'SEARCH_INVOICE' |'ADD_INVOICE' | 'UPDATE_INVOICE' |'DELETE_INVOICE',
    payload: StateType
}

const INITIAL_STATE ={
    invoices:[],
    invoice_links:[],
    customers:[],
    errors:null,
    updateErrors:null,
}

type InvoiceContextInit = {
    state:StateType, 
    getInvoices:(url?:string) => Promise<void>;
    searchInvoices:(e:React.FormEvent<HTMLFormElement>, search:string) => Promise<void>;
    filterInvoices:(filter:number) => Promise<void>;
    addInvoice:(e: React.FormEvent<HTMLFormElement>, invoice:Invoice) => Promise<void>;
    getInvoice:(id:number) => Invoice;
    updateInvoice:(e: React.FormEvent<HTMLFormElement>, invoice:Invoice) => Promise<void>;
    deleteInvoice:(e: React.MouseEvent<HTMLParagraphElement, MouseEvent>, id:number) => void;
    loading?: boolean,
    adding?: boolean,
    updating?: boolean,
    setClearAdding:(value:boolean) => void,
    clearAdding?: boolean,
    clearSearch?: boolean
}

const reducer = (state:StateType, action:ActionType) => {
    switch (action.type) {
        case "INITIAL_INVOICE":
           return {
                ...state, ...{invoices: action.payload.invoices, customers: action.payload.customers, invoice_links: action.payload.invoice_links}
           }

        case "SEARCH_INVOICE":
            return {
                    ...state, ...{invoices: action.payload.invoices, invoice_links: action.payload.invoice_links}
            }   

        case "ADD_INVOICE":
            return {
                ...state, ...{invoices: [ ...state.invoices,...action.payload.invoices], errors: action.payload.errors}
            } 
           
        case "UPDATE_INVOICE":
            
            if(action.payload.invoices.length > 0){
                let data = action.payload.invoices[0];
                return {
                    ...state, ...{invoices: state.invoices.map(invoice => invoice.id == data.id ? {...invoice, ...data}:invoice), updateErrors: action.payload.updateErrors}
                };
            }else{

                return {
                    ...state, updateErrors: action.payload.updateErrors
                };
            }
           
        case "DELETE_INVOICE": 
            if(action.payload.invoices.length > 0){
                let data = action.payload.invoices[0];
                return {
                    ...state, invoices: state.invoices.filter(invoice => invoice.id != data.id )
                };
            }else{
                return state;
            }
            
        default:
            return state;
    }
}

const createInvoiceContext = createContext({} as InvoiceContextInit);

export const useInvoiceContext = () => useContext(createInvoiceContext);

const InvoiceContext = ({ children }:{ children:React.ReactNode}) => {

    const [ state, dispatch ] = useReducer(reducer, INITIAL_STATE);

    const [loading, setLoading] = useState(false);
    const [adding, setAdding] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [clearAdding, setClearAdding] = useState(false);
    let [searchParams, setSearchParams] = useSearchParams();
    
    const [clearSearch, setClearSearch] = useState(false);

    useEffect(() => {
        getInvoices();
    }, []);

    const getInvoices = async(url?:string) => {
        setLoading(true);
        let active_url = url ? url:'/invoices';
        await axiosClient.get(active_url)
        .then(response =>{
            if(response.status === 200){
                let { invoices_ , customers_} = response.data;
               
                let invoices__ = invoices_.data.map((invoice:any) => {
                    return {
                        id: invoice.id,
                        number: invoice.number,
                        customer: {
                            id: invoice.customers.id,
                            first_name: invoice.customers.first_name,
                        },
                        date: invoice.date,
                        due_date: invoice.due_date,
                        references: invoice.references,
                        terms_and_conditions: invoice.terms_and_conditions,
                        sub_total: invoice.sub_total,
                        discount: invoice.discount,
                        total: invoice.total,
                        cartItems:invoice.invoice_items.map((invoice_item:any) =>{
                            return {
                                id: invoice_item.id,
                                product: {
                                    id: invoice_item.products.id,
                                    item_code: invoice_item.products.item_code,
                                    description: invoice_item.products.description,
                                    unit_price: invoice_item.products.unit_price,
                                },
                                unit_price: invoice_item.unit_price,
                                quantity: invoice_item.quantity,
                            }
                        })
                    }
                });

                dispatch({
                    type:'INITIAL_INVOICE',
                    payload:{invoices:invoices__, invoice_links: invoices_.links, customers: customers_}
                });
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
            }
        })
        .catch(error =>{
            if(error){
                console.log(error);
            }
        })
    }

    const searchInvoices = async(e:React.FormEvent<HTMLFormElement>, search:string,) => {
        e.preventDefault();
        setLoading(true);
        setSearchParams({s: search});
        setClearSearch(false);
        await axiosClient.get(`/invoices/?s=${search}`)
        .then(response =>{
            if(response.status === 200){    
                let { invoices_ } = response.data;

                let invoices__ = invoices_.data.map((invoice:any) => {
                    return {
                        id: invoice.id,
                        number: invoice.number,
                        customer: {
                            id: invoice.customers.id,
                            first_name: invoice.customers.first_name,
                        },
                        date: invoice.date,
                        due_date: invoice.due_date,
                        references: invoice.references,
                        terms_and_conditions: invoice.terms_and_conditions,
                        sub_total: invoice.sub_total,
                        discount: invoice.discount,
                        total: invoice.total,
                        cartItems:invoice.invoice_items.map((invoice_item:any) =>{
                            return {
                                id: invoice_item.id,
                                product: {
                                    id: invoice_item.products.id,
                                    item_code: invoice_item.products.item_code,
                                    description: invoice_item.products.description,
                                    unit_price: invoice_item.products.unit_price,
                                },
                                unit_price: invoice_item.unit_price,
                                quantity: invoice_item.quantity,
                            }
                        })
                    }
                });

                dispatch({
                    type:'SEARCH_INVOICE',
                    payload:{invoices: invoices__, invoice_links: invoices_.links}
                });
                setTimeout(() => {
                    setLoading(false);
                }, 1000);

                setClearSearch(true);
            }
        })
        .catch(error =>{
            console.log(error);
        })
    }

    const filterInvoices = async(filter:number) => {
        setLoading(true);
        await axiosClient.get(`/invoices/?f=${filter}`)
        .then(response =>{
            if(response.status === 200){    
                let { invoices_ } = response.data;
                let invoices__ = invoices_.data.map((invoice:any) => {
                    return {
                        id: invoice.id,
                        number: invoice.number,
                        customer: {
                            id: invoice.customers.id,
                            first_name: invoice.customers.first_name,
                        },
                        date: invoice.date,
                        due_date: invoice.due_date,
                        references: invoice.references,
                        terms_and_conditions: invoice.terms_and_conditions,
                        sub_total: invoice.sub_total,
                        discount: invoice.discount,
                        total: invoice.total,
                        cartItems:invoice.invoice_items.map((invoice_item:any) =>{
                            return {
                                id: invoice_item.id,
                                product: {
                                    id: invoice_item.products.id,
                                    item_code: invoice_item.products.item_code,
                                    description: invoice_item.products.description,
                                    unit_price: invoice_item.products.unit_price,
                                },
                                unit_price: invoice_item.unit_price,
                                quantity: invoice_item.quantity,
                            }
                        })
                    }
                });

                dispatch({
                    type:'SEARCH_INVOICE',
                    payload:{invoices: invoices__, invoice_links: invoices_.links}
                });
                setTimeout(() => {
                    setLoading(false);
                }, 1000);

                setClearSearch(true);
            }
        })
        .catch(error =>{
            console.log(error);
        })
    }

    const addInvoice = async( e: React.FormEvent<HTMLFormElement>, invoice:Invoice ) => {
        e.preventDefault();
        setAdding(true);
    
        const form = new FormData();
        form.append('number', `${invoice.number}`);
        form.append('customer_id', invoice.customer.id ? invoice.customer.id.toString():"");
        form.append('date', invoice.date);
        form.append('due_date', invoice.due_date);
        form.append('references', invoice.references);
        form.append('terms_and_conditions', invoice.terms_and_conditions);
        form.append('sub_total', invoice.sub_total ? invoice.sub_total.toString():"");
        form.append('discount', invoice.discount ? invoice.discount.toString():"");
        form.append('total', invoice.total ? invoice.total.toString():"");
        form.append('cartItems', JSON.stringify(invoice.cartItems));

        await axiosClient.post('/invoice', form)
        .then(response => {
            if(response.status == 201){
                const { invoice_ } = response.data;
                
                let data = {
                    id: invoice_.id,
                    number: invoice_.number,
                    customer: {
                        id: invoice_.customers.id,
                        first_name: invoice_.customers.first_name,
                    },
                    date: invoice_.date,
                    due_date: invoice_.due_date,
                    references: invoice_.references,
                    terms_and_conditions: invoice_.terms_and_conditions,
                    sub_total: invoice_.sub_total,
                    discount: invoice_.discount,
                    total: invoice_.total,
                    cartItems:invoice_.invoice_items.map((invoice_item:any) =>{
                        return {
                            id: invoice_item.id,
                            product: {
                                id: invoice_item.products.id,
                                item_code: invoice_item.products.item_code,
                                description: invoice_item.products.description,
                                unit_price: invoice_item.products.unit_price,
                            },
                            unit_price: invoice_item.unit_price,
                            quantity: invoice_item.quantity,
                        }
                    })
                }

                dispatch({
                    type:'ADD_INVOICE',
                    payload:{invoices:[data], errors:null}
                });

                window.toast.fire({
                    icon: 'success',
                    title: "New invoice is added successfully",
                });

                setTimeout(() => {
                    setClearAdding(true);
                    setAdding(false);
                }, 2000);
            }
        })
        .catch(res =>{
            if(res){
                if(res.response.status == 422){
                    dispatch({
                        type:'ADD_INVOICE',
                        payload:{invoices:[], errors: res.response.data.errors}
                    });
    
                    window.toast.fire({
                        icon: 'error',
                        title: res.response.data.message,
                    });
                }

                setTimeout(() => {
                    setAdding(false);
                }, 1000);
                console.log(res);
            }
        })
    }

    const getInvoice = (id: number):Invoice => {
        const invoice_ = state.invoices.filter(invoice => invoice.id == id);
        return invoice_[0];    
    }

    const updateInvoice = async(e:React.FormEvent<HTMLFormElement>, invoice:Invoice) => {
        e.preventDefault();

        setUpdating(true);
    
        const updateForm = new FormData();
        updateForm.append('number', `${invoice.number}`);
        updateForm.append('customer_id', invoice.customer.id ? invoice.customer.id.toString():"");
        updateForm.append('date', invoice.date);
        updateForm.append('due_date', invoice.due_date);
        updateForm.append('references', invoice.references);
        updateForm.append('terms_and_conditions', invoice.terms_and_conditions);
        updateForm.append('sub_total', invoice.sub_total ? invoice.sub_total.toString():"");
        updateForm.append('discount', invoice.discount ? invoice.discount.toString():"");
        updateForm.append('total', invoice.total ? invoice.total.toString():"");
        updateForm.append('cartItems', JSON.stringify(invoice.cartItems));
        updateForm.append('_method','put');

        await axiosClient.post('/invoice/' + invoice.id, updateForm)
        .then(response => {
            if(response.status == 201){
                const { invoice_ } = response.data;
                
                let data = {
                    id: invoice_.id,
                    number: invoice_.number,
                    customer: {
                        id: invoice_.customers.id,
                        first_name: invoice_.customers.first_name,
                    },
                    date: invoice_.date,
                    due_date: invoice_.due_date,
                    references: invoice_.references,
                    terms_and_conditions: invoice_.terms_and_conditions,
                    sub_total: invoice_.sub_total,
                    discount: invoice_.discount,
                    total: invoice_.total,
                    cartItems:invoice_.invoice_items.map((invoice_item:any) =>{
                        return {
                            id: invoice_item.id,
                            product: {
                                id: invoice_item.products.id,
                                item_code: invoice_item.products.item_code,
                                description: invoice_item.products.description,
                                unit_price: invoice_item.products.unit_price,
                            },
                            unit_price: invoice_item.unit_price,
                            quantity: invoice_item.quantity,
                        }
                    })
                }
            
                dispatch({
                    type:'UPDATE_INVOICE',
                    payload:{invoices:[data], updateErrors:null}
                });

                window.toast.fire({
                    icon: 'success',
                    title: "Invoice is updated successfully",
                });

                setTimeout(() => {
                    setUpdating(false);
                }, 2000);
            }
        })
        .catch(res =>{
            if(res){
                if(res.response.status == 422){
                    dispatch({
                        type:'UPDATE_INVOICE',
                        payload:{invoices:[], updateErrors: res.response.data.errors}
                    });
    
                    window.toast.fire({
                        icon: 'error',
                        title: res.response.data.message,
                    });
                }else if(res.response.status == 404){

                    dispatch({
                        type:'UPDATE_INVOICE',
                        payload:{invoices:[], updateErrors: null}
                    });

                    window.toast.fire({
                        icon: 'error',
                        title: res.response.data.message,
                    });
                }

                setTimeout(() => {
                    setUpdating(false);
                }, 1000);
        
            }
        })

    }

    const deleteInvoice = ( e: React.MouseEvent<HTMLParagraphElement, MouseEvent>, id: number ) => {  
        window.Swal.fire({
            title: 'Are you sure, You want to delete this invoice?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result:any) => {
            if (result.isConfirmed) {
                e.preventDefault();
                axiosClient.delete(`/invoice/${id}`)
                .then(response =>{
                    if(response && response.status == 200){
                        const { invoice_, message } = response.data;
                
                        let data = {
                            id: invoice_.id,
                            number: invoice_.number,
                            customer: {
                                id: invoice_.customers.id,
                                first_name: invoice_.customers.first_name,
                            },
                            date: invoice_.date,
                            due_date: invoice_.due_date,
                            references: invoice_.references,
                            terms_and_conditions: invoice_.terms_and_conditions,
                            sub_total: invoice_.sub_total,
                            discount: invoice_.discount,
                            total: invoice_.total,
                            cartItems:invoice_.invoice_items.map((invoice_item:any) =>{
                                return {
                                    id: invoice_item.id,
                                    product: {
                                        id: invoice_item.products.id,
                                        item_code: invoice_item.products.item_code,
                                        description: invoice_item.products.description,
                                        unit_price: invoice_item.products.unit_price,
                                    },
                                    unit_price: invoice_item.unit_price,
                                    quantity: invoice_item.quantity,
                                }
                            })
                        }

                        dispatch({ type: "DELETE_INVOICE", payload: {invoices: [data]} });
                        window.toast.fire({
                            icon: 'warning',
                            title:message,
                        });
                    }
                })
                .catch(error => {
                  if(error){
                    console.log(error);
                  }
                })
            }else{
              return false;
            }
        })  
    }

    const invoiceData = {
        state,
        getInvoices,
        searchInvoices,
        filterInvoices,
        addInvoice,
        getInvoice,
        updateInvoice,
        deleteInvoice,
        loading,
        adding,
        updating,
        clearAdding,
        setClearAdding,
        clearSearch
    }

    return (
        <createInvoiceContext.Provider value={invoiceData}>
            {
                children
            }
        </createInvoiceContext.Provider>   
    )
}

export default InvoiceContext