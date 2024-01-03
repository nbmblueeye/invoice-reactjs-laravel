import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useCustomerContext } from '../../context/CustomerContext';
import { Customer } from '../../types/InvoiceTypes';
import { Link } from 'react-router-dom';
import Loading from '../../components/Loading';

const UpdateCustomer = () => {

  const { id } = useParams();
  const customerContext = useCustomerContext();

  const [customer, setCustomer] = useState<Customer>({
      id: 0,
      first_name: "",
      last_name: "",
      email: "",
      address: "",
  });

  const setCustomer_ = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomer({...customer, [e.target.name]: e.target.value})
  }

  useEffect(() => {
    if(id && !customerContext.loading){
      let customer_ = customerContext.getCustomer(parseInt(id));
      if(customer_){
        setCustomer({
          id: customer_.id,
          first_name: customer_.first_name,
          last_name: customer_.last_name,
          email: customer_.email,
          address: customer_.address,
        })
      }
    }
  }, [id, customerContext.loading])
  
  return (
    <div className="page-content">
      <div className="d-flex justify-content-between card-header">
          <h1 className="page-title">Edit Customer</h1>
          <Link to="/customer">
              <button type="button" className="invoice-btn new-invoice-btn">Back</button>
          </Link>
      </div>
        <form onSubmit={(e) => customerContext.updateCustomer(e, customer)}>
            <div className="card-content">
              {
                customerContext.loading ?
                <Loading/>
                :
                <div className="row g-3 p-4">
                    <div className="col-md-6">
                        <label htmlFor="first_name" className="form-label">First Name</label>
                        <input type="text" className="form-control" id="first_name" name="first_name" placeholder="Customer First Name" value={customer.first_name} onChange={(e) => setCustomer_(e)}/>
                        <div className="errors">
                            {
                              customerContext.state.updateErrors?.hasOwnProperty('first_name') && 
                              customerContext.state.updateErrors['first_name'].map((error:string, index:number) => (<p className='text-danger fst-italic' key={index}>{error}</p>))
                            }
                        </div>
                    </div>
                    <div className="col-md-6"></div>
                    <div className="col-md-6">
                        <label htmlFor="last_name" className="form-label">Last Name</label>
                        <input type="text" className="form-control" id="last_name" name="last_name" placeholder="Customer Last Name" value={customer.last_name} onChange={(e) => setCustomer_(e)}/>
                        <div className="errors">
                            {
                                customerContext.state.updateErrors?.hasOwnProperty('last_name') && 
                                customerContext.state.updateErrors['last_name'].map((error:string, index:number) => (<p className='text-danger fst-italic' key={index}>{error}</p>))
                            }
                        </div>   
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="text" className="form-control" id="email" name="email" placeholder="email@gmail.com" value={customer.email} onChange={(e) => setCustomer_(e)}/>
                        <div className="errors">
                            {
                                customerContext.state.updateErrors?.hasOwnProperty('email') && 
                                customerContext.state.updateErrors['email'].map((error:string, index:number) => (<p className='text-danger fst-italic' key={index}>{error}</p>))
                            }
                        </div>     
                    </div>
                    <div className="col-md-12">
                        <label htmlFor="address" className="form-label">Address</label>
                        <textarea className="form-control" id="address" name="address" placeholder="Customer Address" rows={3} value={customer.address} onChange={(e) => setCustomer_(e)}/>
                        <div className="errors">
                            {
                                customerContext.state.updateErrors?.hasOwnProperty('address') && 
                                customerContext.state.updateErrors['address'].map((error:string, index:number) => (<p className='text-danger fst-italic' key={index}>{error}</p>))
                            }
                        </div>     
                    </div>      
                </div>
              }
            </div>
            <div className="d-flex justify-content-between">
              <div></div>
              {
                <button type="submit" disabled={customerContext.updating ? true:false} className="invoice-content-btn invoice-btn">
                  {
                    customerContext.updating ?
                    (
                      <div className="spinner-border text-success" role="status">
                        <span className="visually-hidden">Updating...</span>
                      </div>
                    )
                    :
                    <>Update Customer</>    
                  }
                </button>
              }
            </div>

        </form>
    </div>
  )
}

export default UpdateCustomer