import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Loading from '../../components/Loading';
import { useProductContext } from '../../context/ProductContext';
import { Product } from '../../types/InvoiceTypes';

const UpdateProduct = () => {

  const { id } = useParams();
 
  const productContext = useProductContext();

  const [product, setProduct] = useState<Product>({
    id: 0,
    item_code: "",
    description: "",
    unit_price: 0,
  });

  const setProduct_ = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    setProduct({...product, [e.target.name]: e.target.value})
  }

  useEffect(() => {
    if(id && !productContext.loading){
      let product_ = productContext.getProduct(parseInt(id));
      if(product_){
        setProduct({
          id: product_.id,
          item_code: product_.item_code,
          description: product_.description,
          unit_price: product_.unit_price,
        })
      }
    }
  }, [id, productContext.loading])
  

  return (
    <div className="page-content">
    <div className="d-flex justify-content-between card-header">
        <h1 className="page-title">Edit Product</h1>
        <Link to="/product">
            <button type="button" className="invoice-btn new-invoice-btn">Back</button>
        </Link>
    </div>
      <form onSubmit={(e) => productContext.updateProduct(e, product)}>
        <div className="card-content">
          {
            productContext.loading ?
            <Loading/>
            :
            <div className="row g-3 p-4">

              <div className="col-md-6">
                  <label htmlFor="item_code" className="form-label">Item Code</label>
                  <input type="text" className="form-control" id="item_code" name="item_code" placeholder="Product Item Code" value={product.item_code} onChange={(e) => setProduct_(e)}/>
                  <div className="errors">
                      {
                        productContext.state.errors?.hasOwnProperty('item_code') && 
                        productContext.state.errors['item_code'].map((error:string, index:number) => (<p className='text-danger fst-italic' key={index}>{error}</p>))
                      }
                  </div>
              </div>
              
              <div className="col-md-6">
                  <label htmlFor="unit_price" className="form-label">Unit Price</label>
                  <input type="number" className="form-control" id="unit_price" name="unit_price" placeholder="email@gmail.com" value={product.unit_price} onChange={(e) => setProduct_(e)}/>
                  <div className="errors">
                      {
                        productContext.state.errors?.hasOwnProperty('unit_price') && 
                        productContext.state.errors['unit_price'].map((error:string, index:number) => (<p className='text-danger fst-italic' key={index}>{error}</p>))
                      }
                  </div>     
              </div>

              <div className="col-12">
                  <label htmlFor="description" className="form-label">Product Description</label>
                  <textarea className="form-control" id="description" name="description" placeholder="Product Description" value={product.description} onChange={(e) => setProduct_(e)}/>
                  <div className="errors">
                    {
                      productContext.state.errors?.hasOwnProperty('description') && 
                      productContext.state.errors['description'].map((error:string, index:number) => (<p className='text-danger fst-italic' key={index}>{error}</p>))
                    }
                  </div>   
              </div>
              
            </div>
          }
        </div>
        <div className="d-flex justify-content-between">
          <div></div>
          {
            <button type="submit" disabled={productContext.updating ? true:false} className="invoice-content-btn invoice-btn">
              {

                productContext.updating ?
                (
                  <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Updating...</span>
                  </div>
                )
                :
                <>Update Product</>    

              }
            </button>
          }
        </div>
      </form>
  </div>
  )
}

export default UpdateProduct