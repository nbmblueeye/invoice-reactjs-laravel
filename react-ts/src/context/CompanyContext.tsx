import React, { useState, useEffect, createContext, useContext, useReducer } from 'react';
import { Company } from '../types/InvoiceTypes';
import axiosClient from '../axiosClient';


type StateType = {
  company: Company,
  errors?:any,
  updateErrors?: any,
}

type ActionType = {
  type: 'INITIAL_COMPANY' |'ADD_COMPANY' | 'UPDATE_COMPANY',
  payload: StateType,
}

const INITIAL_STATE ={
  company:{} as Company,
  errors:{},
  updateErrors:{},
}

type CompanyContextInit = {
  state:StateType, 
  addCompany:(e: React.FormEvent<HTMLFormElement>, company:Company) => Promise<void>;
  updateCompany:(e: React.FormEvent<HTMLFormElement>, company:Company) => Promise<void>;
  loading: boolean,
  adding: boolean,
  updating: boolean,
}

const reducer = (state:StateType, action:ActionType) => {
    switch (action.type) {
      case "INITIAL_COMPANY":
        return {
          ...state, company: action.payload.company
        }

      case "ADD_COMPANY":
        return {
          ...state, ...{company: { ...state.company, ...action.payload.company }, errors: action.payload.errors}
        };

      case "UPDATE_COMPANY":
        return {
          ...state, ...{company: { ...state.company, ...action.payload.company }, updateErrors: action.payload.updateErrors}
        };
      default:
          return state;
    }
}

const createCompanyContext = createContext({} as CompanyContextInit);

export const useCompanyContext = () => useContext(createCompanyContext);


const CompanyContext = ( { children }:{ children:React.ReactNode} ) => {

    const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [adding, setAdding] = useState(false);
   
    useEffect(() => {  
      const initCompanys = async() => {
        setLoading(true);
        await axiosClient.get('/companies')
        .then(response =>{
            if(response.status === 200){
              let { company_ } = response.data;
              
              let data = {
                id:company_?.id ?company_.id:0,
                name: company_?.name ? company_.name:"",
                phone: company_?.phone ? company_.phone:"",
                email: company_?.email ? company_.email:"",
                address: company_?.address ? company_.address:"",
                image: company_?.logo ? company_.logo:"",
              }
              
              
              dispatch({
                type:'INITIAL_COMPANY',
                payload:{company: data}
              });
              setTimeout(() => {
                setLoading(false);
              }, 1000);
            }
        })
        .catch(error =>{
            console.log(error);
            setTimeout(() => {
              setLoading(false);
            }, 1000);
        })
      };
      initCompanys();
    }, []);

    const addCompany = async( e: React.FormEvent<HTMLFormElement>, company:Company ) => {
      e.preventDefault();
      setAdding(true);
      const companyForm = new FormData();
      companyForm.append('name', company.name);
      companyForm.append('phone', company.phone);
      companyForm.append('email', company.email);
      companyForm.append('address', company.address);
      companyForm.append('logo', company.image.toString());

      await axiosClient.post('/company', companyForm)
      .then(response => {
        if(response.status == 201){
            const { company_ } = response.data;
            let data = {
              id: company_.id,
              name: company_.name,
              phone: company_.phone,
              email: company_.email,
              address: company_.address,
              image : company_.logo,
            }
            dispatch({
                type:'ADD_COMPANY',
                payload:{company:data, errors:null}
            });

            window.toast.fire({
                icon: 'success',
                title: "New Company is added successfully",
            });

            setTimeout(() => {
                setAdding(false);
            }, 2000);
        }
      })
      .catch(res =>{
        if(res){
          if(res.response.status == 422){
              dispatch({
                  type:'ADD_COMPANY',
                  payload:{company:{} as Company, errors: res.response.data.errors}
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

    const updateCompany = async(e: React.FormEvent<HTMLFormElement>, company:Company) => {
        e.preventDefault();
        setUpdating(true);

        const companyForm = new FormData();
        companyForm.append('name', company.name);
        companyForm.append('phone', company.phone);
        companyForm.append('email', company.email);
        companyForm.append('address', company.address);
        companyForm.append('logo', company.image.toString());
        companyForm.append('_method','put');
  
        await axiosClient.post(`/company/${company.id}`, companyForm)
        .then(response => {
            if(response.status == 202){
              const { company_ } = response.data;

              let data = {
                id: company_.id,
                name: company_.name,
                phone: company_.phone,
                email: company_.email,
                address: company_.address,
                image : company_.logo,
              }

              dispatch({
                type:'UPDATE_COMPANY',
                payload:{company:data, updateErrors:null}
              });
  
              window.toast.fire({
                icon: 'success',
                title: "Company is updated successfully",
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
                        type:'UPDATE_COMPANY',
                        payload:{company:{} as Company, updateErrors: res.response.data.errors}
                    });
    
                    window.toast.fire({
                        icon: 'error',
                        title: res.response.data.message,
                    });
                }else if(res.response.status == 404){

                  dispatch({
                    type:'UPDATE_COMPANY',
                    payload:{company:{} as Company, updateErrors: null}
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

    let data = {
      state,
      addCompany, 
      updateCompany, 
      loading,
      adding,
      updating,
    }
    
  return (
        <createCompanyContext.Provider value={data}>
            {
                children
            }
        </createCompanyContext.Provider>
  )
}

export default CompanyContext