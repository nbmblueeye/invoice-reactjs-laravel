import React, { useState, useEffect, createContext, useContext, useReducer } from 'react';
import { Product, Link_ } from '../types/InvoiceTypes';
import axiosClient from '../axiosClient';


type StateType = {
  products: Product[],
  product_links?: Link_[],
  errors?:any,
  updateErrors?:any,
}

type ActionType = {
  type: 'INITIAL_PRODUCT' |'ADD_PRODUCT' | 'UPDATE_PRODUCT' |'DELETE_PRODUCT',
  payload: StateType
}

const INITIAL_STATE ={
  products:[],
  product_links:[],
  errors:{},
  updateErrors:{},
}

type ProductContextInit = {
  state:StateType, 
  getProducts:(url:string) => Promise<void>;
  addProduct:(e: React.FormEvent<HTMLFormElement>, product:Product) => Promise<void>;
  getProduct:(id:number) => Product;
  updateProduct:(e: React.FormEvent<HTMLFormElement>, product:Product) => Promise<void>;
  deleteProduct:(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id:number | undefined) => void;
  loading: boolean,
  adding: boolean,
  clearAdding: boolean,
  setClearAdding: (input:boolean) => void;
  updating: boolean,
  deleting:number|undefined,
}

const reducer = (state:StateType, action:ActionType) => {
  switch (action.type) {
    case "INITIAL_PRODUCT":
      return {
        ...state, ...{products: action.payload.products, product_links: action.payload.product_links}
      }
    case "ADD_PRODUCT":
      return {
        ...state, ...{products: [ ...state.products, ...action.payload.products ], errors: action.payload.errors}
      };
    case "UPDATE_PRODUCT":
      if(action.payload.products.length > 0){
        let data = action.payload.products[0];
        return {
          ...state, ...{products: state.products.map(product => product.id == data.id ? {...product, ...data}:product), updateErrors: action.payload.updateErrors}
        };
      }else{
        return {
          ...state, updateErrors: action.payload.updateErrors
        };
      }
    case "DELETE_PRODUCT":
      if(action.payload.products.length > 0){
        let data = action.payload.products[0];
        return {
          ...state, products: state.products.filter(product =>product.id != data.id )
        };
      }else{
          return state;
      }

    default:
      return state;
  }
}

const createProductContext = createContext({} as ProductContextInit);

export const useProductContext = () => useContext(createProductContext);

const ProductContext = ( { children }:{ children:React.ReactNode} ) => {

    const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [adding, setAdding] = useState(false);
    const [clearAdding, setClearAdding] = useState(false);
    const [deleting, setDeleting] = useState<number|undefined>(undefined);
  
    useEffect(() => {  
        const initProducts = async() => {
          setLoading(true);
          await axiosClient.get('/products')
          .then(response =>{
              if(response.status === 200){
                let { products_ } = response.data;

                let products__ = products_.data.map((product:any) => {
                  return {
                    id: product.id,
                    item_code: product.item_code,
                    description: product.description,
                    unit_price: product.unit_price,
                  }
                });

                dispatch({
                  type:'INITIAL_PRODUCT',
                  payload:{products: products__, product_links: products_.links}
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

        initProducts();
    }, []);

    const getProducts = async(url:string) => {
      setLoading(true);
      await axiosClient.get(url)
      .then(response =>{
        if(response.status === 200){
          let { products_ } = response.data;
          let products__ = products_.data.map((product:any) => {
            return {
              id: product.id,
              item_code: product.item_code,
              description: product.description,
              unit_price: product.unit_price,
            }
          });

          dispatch({
            type:'INITIAL_PRODUCT',
            payload:{products: products__, product_links: products_.links}
          });

          setTimeout(() => {
            setLoading(false);
          }, 1000);
        }
      })
      .catch(error =>{
          console.log(error);
      })
    }

    const addProduct = async( e:React.FormEvent<HTMLFormElement>, product:Product ) => {
      
      e.preventDefault();
      setAdding(true);

      const productForm = new FormData();
      productForm.append('item_code', product.item_code);
      productForm.append('description', product.description);
      productForm.append('unit_price', product.unit_price.toString());
     
      await axiosClient.post('/product', productForm)
      .then(response => {
        if(response.status == 201){
          const { product_ } = response.data;

          let data = {
            id: product_.id,
            item_code: product.item_code,
            description: product.description,
            unit_price: product.unit_price,
          }

          dispatch({
            type:'ADD_PRODUCT',
            payload:{products:[data], errors:null}
          });

          window.toast.fire({
            icon: 'success',
            title: "New Product is added successfully",
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
                  type:'ADD_PRODUCT',
                  payload:{products:[], errors: res.response.data.errors}
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

    const getProduct = (id:number):Product => {
      let products = state.products.filter((product) => product.id == id);
      return products[0];
    }

    const updateProduct = async(e: React.FormEvent<HTMLFormElement>, product:Product ) => {
      e.preventDefault();
      setUpdating(true);

      const productForm = new FormData();
      productForm.append('item_code', product.item_code);
      productForm.append('description', product.description);
      productForm.append('unit_price', product.unit_price.toString());
      productForm.append('_method','put');

      await axiosClient.post(`/product/${product.id}`, productForm)
      .then(response => {
        if(response.status == 202){   

          const { product_ } = response.data;
          let data = {
            id: product_.id,
            item_code: product_.item_code,
            description: product_.description,
            unit_price: product_.unit_price,
          }

          dispatch({
            type:'UPDATE_PRODUCT',
            payload:{products:[data], errors:null}
          });

          window.toast.fire({
            icon: 'success',
            title: "Product is updated successfully",
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
              type:'UPDATE_PRODUCT',
              payload:{products:[], errors: res.response.data.errors}
            });

            window.toast.fire({
              icon: 'error',
              title: res.response.data.message,
            });
          }else if(res.response.status == 404){

            dispatch({
              type:'UPDATE_PRODUCT',
              payload:{products:[], updateErrors: null}
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

    const deleteProduct = ( e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id:number | undefined) => {
      window.Swal.fire({
        title: 'Are you sure, You want to delete this Product?',
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
            await axiosClient.delete(`/product/${id}`)
            .then(response =>{
                if(response && response.status == 200){
                      const { product_, message } = response.data;
              
                      let data = {
                        id: product_.id,
                        item_code: product_.item_code,
                        description: product_.description,
                        unit_price: parseFloat(product_.unit_price),
                      }
                    
                      dispatch({
                        type:'DELETE_PRODUCT',
                        payload:{products:[data]}
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
      getProducts,
      addProduct,
      getProduct,
      updateProduct,
      deleteProduct,
      loading,
      adding,
      clearAdding,
      setClearAdding,
      updating,
      deleting,
  }

  return (
    <createProductContext.Provider value={data}>
      { children }
    </createProductContext.Provider>
  )
}

export default ProductContext