import React, { useState, useEffect, createContext, useContext, useReducer } from 'react';
import { Customer, Link_ } from '../types/InvoiceTypes';
import axiosClient from '../axiosClient';


type StateType = {
    customers: Customer[],
    customer_links?: Link_[],
    errors?:any,
    updateErrors?: any,
  }
  
  type ActionType = {
    type: 'INITIAL_CUSTOMER' |'ADD_CUSTOMER' | 'UPDATE_CUSTOMER' |'DELETE_CUSTOMER',
    payload: StateType,
  }
  
  const INITIAL_STATE ={
    customers:[],
    customer_links:[],
    errors:{},
    updateErrors:{},
  }

  type CustomerContextInit = {
    state:StateType, 
    getCustomers:(url:string) => Promise<void>;
    addCustomer:(e: React.FormEvent<HTMLFormElement>, company:Customer) => Promise<void>;
    getCustomer:(id:number) => Customer;
    updateCustomer:(e: React.FormEvent<HTMLFormElement>, company:Customer) => Promise<void>;
    deleteCustomer:(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id:number | undefined) => void;
    loading: boolean,
    adding: boolean,
    clearAdding: boolean,
    setClearAdding: (input:boolean) => void;
    updating: boolean,
    deleting:number|undefined,
  }
  
  const reducer = (state:StateType, action:ActionType) => {
      switch (action.type) {
        case "INITIAL_CUSTOMER":
           return {
              ...state, ...{customers: action.payload.customers, customer_links: action.payload.customer_links}
           }
        case "ADD_CUSTOMER":
            return {
              ...state, ...{customers: [ ...state.customers, ...action.payload.customers ], errors: action.payload.errors}
            };
  
        case "UPDATE_CUSTOMER":
            if(action.payload.customers.length > 0){
                let data = action.payload.customers[0];
                return {
                    ...state, ...{customers: state.customers.map(customer => customer.id == data.id ? {...customer, ...data}:customer), updateErrors: action.payload.updateErrors}
                };
            }else{
                return {
                    ...state, updateErrors: action.payload.updateErrors
                };
            }
  
        case "DELETE_CUSTOMER":
            if(action.payload.customers.length > 0){
                let data = action.payload.customers[0];
                return {
                ...state, customers: state.customers.filter(customer =>customer.id != data.id )
                };
            }else{
                return state;
            }
          
        default:
            return state;
      }
  }
  
  const createCustomerContext = createContext({} as CustomerContextInit);
  
  export const useCustomerContext = () => useContext(createCustomerContext);
  

const CustomerContext = ( { children }:{ children:React.ReactNode} ) => {

    const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [adding, setAdding] = useState(false);
    const [clearAdding, setClearAdding] = useState(false);
    const [deleting, setDeleting] = useState<number|undefined>(undefined);
  
    useEffect(() => {  
        const initCustomers = async() => {
            setLoading(true);
            await axiosClient.get('/customers')
            .then(response =>{
                if(response.status === 200){
                  let { customers_ } = response.data;

                  let customers__ = customers_.data.map((customer:any) => {
                    return {
                        id: customer.id,
                        first_name: customer.first_name,
                        last_name: customer.last_name,
                        email: customer.email,
                        address: customer.address,
                    }
                  });

                  dispatch({
                    type:'INITIAL_CUSTOMER',
                    payload:{customers: customers__, customer_links: customers_.links}
                  });

                  setTimeout(() => {
                    setLoading(false);
                  }, 1000);
                }
            })
            .catch(error =>{
                console.log(error);
            })
        };

        initCustomers();
    }, []);

    const getCustomers = async(url:string) => {
        setLoading(true);
        await axiosClient.get(url)
        .then(response =>{
            if(response.status === 200){
              let { customers_ } = response.data;

              let customers__ = customers_.data.map((customer:any) => {
                return {
                    id: customer.id,
                    first_name: customer.first_name,
                    last_name: customer.last_name,
                    email: customer.email,
                    address: customer.address,
                }
              });

              dispatch({
                type:'INITIAL_CUSTOMER',
                payload:{customers: customers__, customer_links: customers_.links}
              });

              setTimeout(() => {
                setLoading(false);
              }, 1000);
            }
        })
        .catch(error =>{
            console.log(error);
        })
    };

    const addCustomer = async( e: React.FormEvent<HTMLFormElement>, customer:Customer ) => {
        e.preventDefault();
        setAdding(true);

        const customerForm = new FormData();
        customerForm.append('first_name', customer.first_name);
        customerForm.append('last_name', customer.last_name ? customer.last_name:"");
        customerForm.append('email', customer.email ? customer.email:"");
        customerForm.append('address', customer.address ? customer.address:"");
       
        await axiosClient.post('/customer', customerForm)
        .then(response => {
            if(response.status == 201){
                const { customer_ } = response.data;

                let data = {
                    id: customer_.id,
                    first_name: customer_.first_name,
                    last_name: customer_.last_name,
                    email: customer_.email,
                    address: customer_.address,
                }
  
                dispatch({
                    type:'ADD_CUSTOMER',
                    payload:{customers:[data], errors:null}
                });
  
                window.toast.fire({
                    icon: 'success',
                    title: "New Customer is added successfully",
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
                        type:'ADD_CUSTOMER',
                        payload:{customers:[], errors: res.response.data.errors}
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

    const getCustomer = (id:number):Customer => {
        let customer = state.customers.filter((customer) => customer.id == id);
        return customer[0];
    }

    const updateCustomer = async(e: React.FormEvent<HTMLFormElement>, customer:Customer ) => {
        e.preventDefault();
        setUpdating(true);

        const customerForm = new FormData();
        customerForm.append('first_name', customer.first_name);
        customerForm.append('last_name', customer.last_name ? customer.last_name:"");
        customerForm.append('email', customer.email ? customer.email:"");
        customerForm.append('address', customer.address ? customer.address:"");
        customerForm.append('_method','put');
  
        await axiosClient.post(`/customer/${customer.id}`, customerForm)
        .then(response => {
            if(response.status == 202){
                const { customer_ } = response.data;
                let data = {
                    id: customer_.id,
                    first_name: customer_.first_name,
                    last_name: customer_.last_name,
                    email: customer_.email,
                    address: customer_.address,
                }
                dispatch({
                    type:'UPDATE_CUSTOMER',
                    payload:{customers:[data], updateErrors:null}
                });
  
                window.toast.fire({
                    icon: 'success',
                    title: "Customer is updated successfully",
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
                        type:'UPDATE_CUSTOMER',
                        payload:{customers:[], updateErrors: res.response.data.errors}
                    });
    
                    window.toast.fire({
                        icon: 'error',
                        title: res.response.data.message,
                    });
                }else if(res.response.status == 404){

                    dispatch({
                        type:'UPDATE_CUSTOMER',
                        payload:{customers:[], updateErrors: null}
                    });

                    window.toast.fire({
                        icon: 'error',
                        title: res.response.data.message,
                    });
              }
  
                setTimeout(() => {
                  setUpdating(false);
                }, 1000);
                console.log(res);
            }
        })
    }

    const deleteCustomer = ( e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id:number | undefined) => {
  
        window.Swal.fire({
          title: 'Are you sure, You want to delete this Customer?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
        }).then(async(result:any) => {
            if (result.isConfirmed) {

              e.preventDefault();
              setDeleting(id);

              await axiosClient.delete(`/customer/${id}`)
              .then(response =>{
                  if(response && response.status == 200){
                        const { customer_, message } = response.data;
                
                        let data = {
                                id: customer_.id,
                                first_name: customer_.first_name,
                                last_name: customer_.last_name,
                                email: customer_.email,
                                address: customer_.address,
                            }
                      
                        dispatch({
                            type:'DELETE_CUSTOMER',
                            payload:{customers:[data]}
                        });
        
                        window.toast.fire({
                            icon: 'warning',
                            title:message,
                        });
    
                        setTimeout(() => {
                            setDeleting(undefined);
                        }, 2000);
                    }
                })
                .catch(error => {
                    if(error){
                    console.log(error);
                    }
                    setTimeout(() => {
                    setDeleting(undefined);
                    }, 2000);
                })
            }else{
              return false;
            }
        })  
    };
  

    let data = {
        state,
        getCustomers, 
        addCustomer, 
        getCustomer,
        updateCustomer, 
        deleteCustomer,
        loading,
        adding,
        clearAdding,
        setClearAdding,
        updating,
        deleting,
    }

  return (
    <createCustomerContext.Provider value={data}>
        {children}
    </createCustomerContext.Provider>
  )
}

export default CustomerContext