import React from 'react'
import { useProductContext } from '../../context/ProductContext';
import { Link } from 'react-router-dom';
import Loading from '../../components/Loading';
import TooltipB from '../../components/TooltipB';
import InvoicePagination from '../../components/InvoicePagination';

const Product = () => {

  const productContext = useProductContext();

  const setActivePagination = (e:React.MouseEvent<HTMLLIElement, MouseEvent>, url:string) => {
      e.preventDefault();
      productContext.getProducts(url);
  }


  return (
    <div className="page-content">
    <div className="d-flex justify-content-between card-header">
        <h1 className="page-title">Product</h1>
        <Link to="/product/create">
            <button type="button" className="invoice-btn new-invoice-btn">New Product</button>
        </Link>
    </div>
    <div className="card-content">
        {
            productContext.loading ?
            <Loading/>
            :
            <>
                <div className="table-container">
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                              <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Item Code</th>
                                <th scope="col">Description</th>
                                <th scope="col">Unit Price</th>
                                <th scope="col">Action</th>
                              </tr>
                            </thead>
                            <tbody>                               
                                {  
                                  productContext.state.products.length > 0 ?
                                  productContext.state.products.map((product, index) =>(
                                      <tr key={index}>                                        
                                        <th scope="row">
                                          <TooltipB title="edit Product">
                                            <Link to={`/product/update/${product.id}`}>
                                              <p>{product.id}</p>
                                            </Link> 
                                          </TooltipB>                                            
                                        </th>
                                        <td>{product.item_code}</td>
                                        <td>{product.description}</td>
                                        <td>{product.unit_price}</td>                             
                                        <td>
                                          <TooltipB title="delete Product"> 
                                            <button className="invoice_button delete" type='button' disabled={productContext.deleting == product.id && true} onClick={(e) => productContext.deleteProduct(e,product.id)}>
                                            {
                                              productContext.deleting == product.id ?
                                              (                                              
                                                <span className="spinner-border spinner-border-sm text-danger" aria-hidden="true"></span>
                                              )
                                              :
                                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                                                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                                              </svg>   
                                            }
                                            </button>
                                          </TooltipB>
                                        </td>
                                      
                                      </tr>
                                  ))
                              
                                  :
                                  <tr>
                                      <td colSpan="6">
                                          <div className='py-5 text-center'>No Product existing</div>    
                                      </td>
                                  </tr>
                                }
                                
                                
                            </tbody>
                        </table>
                    </div>
                    
                    {
                        productContext.state.product_links?.length ?
                        <InvoicePagination links={productContext.state.product_links} setActivePagination={setActivePagination}/>
                        :
                        ""
                    }
                    
                </div>
            </>
        }
    </div>
</div>
  )
}

export default Product