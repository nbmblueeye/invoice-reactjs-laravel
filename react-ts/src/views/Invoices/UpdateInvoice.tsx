import { useEffect, useState, useMemo } from 'react';
import { useInvoiceContext } from "../../context/InvoiceContext";
import { useParams, Link } from 'react-router-dom';
import { Invoice, InvoiceItem , Product ,Customer } from '../../types/InvoiceTypes';
import ProductListModal from '../../components/ProductListModal';
import { useProductContext } from '../../context/ProductContext';
import Loading from '../../components/Loading';
import { useCustomerContext } from '../../context/CustomerContext';

const UpdateInvoice = () => {

    const { id } = useParams();

    const invoiceContext = useInvoiceContext();
    const productContext  = useProductContext();
    const customerContext = useCustomerContext();

    const [invoice, setInvoice] = useState<Invoice>(
        {
            id: 0,
            number: "",
            customer: {
                id: 0,
                first_name: "",
            },
            date: "",
            due_date: "",
            references: "",
            terms_and_conditions: "",
            sub_total: 0,
            discount: 0,
            total: 0,
            cartItems:[]
        }
    );

    useEffect(() => {
        if(id && !invoiceContext.loading) {
            let invoice_ = invoiceContext.getInvoice(parseFloat(id));
            if(invoice_){
                setInvoice(invoice_);
            }          
        }
    }, [id, invoiceContext.loading]);


    const [showModal, setShowModal] = useState(false);
    const setShowModal_ = () => {
        setShowModal(!showModal);
    }

    const setListItems = (product:Product) => {
        let checkItem = invoice.cartItems.find(item => item.product.id == product.id);
        if(checkItem){
            window.toast.fire({
                icon: 'warning',
                title: "Item already in cart",
            })
            return false;
        }else{
            let newItem = {
                product: {
                    id: product.id,
                    item_code: product.item_code,
                    description: product.description,
                    unit_price: product.unit_price,
                },
                unit_price: product.unit_price,
                quantity: 1,
            }
            setInvoice({...invoice, cartItems: [...invoice.cartItems, newItem]});
            window.toast.fire({
                icon: 'success',
                title: "Item is added to cart",
            })
        }
    }

    const updateListItems = (e: React.ChangeEvent<HTMLInputElement>, item:InvoiceItem) => {
        setInvoice({...invoice, 
            cartItems: invoice.cartItems.map(item_ => item_.product.id == item.product.id ? {...item_,[e.target.name]:e.target.value}:item_)});
    }

    const deleteListItems = (id:number) => {
        setInvoice({...invoice, cartItems: invoice.cartItems.filter(item => item.product.id != id)});
    }

    const setInvoice_ = (e:React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        setInvoice({...invoice, [e.target.name] : e.target.value})
    }

    const setCustomer = (e:React.ChangeEvent<HTMLSelectElement>) => {
        setInvoice({...invoice, customer: {...invoice.customer, id: parseInt(e.target.value)}})
    }

    let subTotal = useMemo<number>(() => {
        let sub_total = 0;
        if(invoice.cartItems.length > 0) {
            sub_total = invoice.cartItems.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
        }
        setInvoice({...invoice,  sub_total: sub_total});
        return sub_total;

    }, [invoice.cartItems]);

    let Total = useMemo<number>(() => {
        let total = 0;
        if(invoice.discount > 0 && invoice.sub_total > 0){
            total = invoice.sub_total - (invoice.discount)/100 * invoice.sub_total;
        }else if( invoice.sub_total > 0 ){
            total = invoice.sub_total
        }
        setInvoice({...invoice,  total: total});
        return total;
    }, [invoice.discount, invoice.sub_total]);


    return (
        <div className="page-content">
        <div className="d-flex justify-content-between card-header">
            <h1 className="page-title">Edit Invoice</h1>
            <Link to="/invoice">
                <button type="button" className="invoice-btn new-invoice-btn">Back</button>
            </Link>
        </div>
        <form onSubmit={(e) => invoiceContext.updateInvoice(e, invoice)}>   
            <div className="card-content"> 
            {
                invoiceContext.loading ?
                <Loading/>
            :
               <>
                    <div className="row p-3">
                        <div className="col-12 col-md-4 mb-3">
                            <label htmlFor="customer_id" className="form-label">Customer</label>
                            <select className="form-select" aria-label="Default select Customer" id="customer_id" name="customer_id" value={invoice.customer.id} onChange={(e) => setCustomer(e)}>
                                <option value="0">Open this select menu</option>
                                {
                                    customerContext.state.customers && customerContext.state.customers.length > 0 ?
                                    customerContext.state.customers.map((customer:Customer) => 
                                        <option key={customer.id} value={customer.id}>{customer.first_name}</option>
                                    )                         
                                    :
                                    <option disabled>....</option>
                                }
                            </select>
                            <div className="errors">
                                {
                                    invoiceContext.state.updateErrors?.hasOwnProperty('customer_id') && invoiceContext.state.updateErrors['customer_id'].map((error:string, index:number) => (<p className='text-danger fst-italic' key={index}>{error}</p>))
                                }
                            </div>
                        </div>
                        <div className="col-12 col-md-4 mb-3">
                            <div className="mb-3">
                                <label htmlFor="date" className="form-label">Date</label>
                                <input type="date" className="form-control" id="date" name="date" value={invoice.date} onChange={(e) => setInvoice_(e)}/>
                                <div className="errors">
                                {
                                    invoiceContext.state.updateErrors?.hasOwnProperty('date') && invoiceContext.state.updateErrors['date'].map((error:string, index:number) => (<p className='text-danger fst-italic' key={index}>{error}</p>))
                                }
                            </div>
                            </div>
                            <div className="mb-0">
                                <label htmlFor="due_date" className="form-label">Due Date</label>
                                <input type="date" className="form-control" id="due_date" name="due_date" value={invoice.due_date} onChange={(e) => setInvoice_(e)}/>
                                <div className="errors">
                                {
                                    invoiceContext.state.updateErrors?.hasOwnProperty('due_date') && invoiceContext.state.updateErrors['due_date'].map((error:string, index:number) => (<p className='text-danger fst-italic' key={index}>{error}</p>))
                                }
                            </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-4 mb-3">
                            <div className="mb-3">
                                <label htmlFor="number" className="form-label">Numeric</label>
                                <input type="text" className="form-control" id="number" name="number" placeholder="Number" value={invoice.number} onChange={(e) => setInvoice_(e)}/>
                                {
                                    invoiceContext.state.updateErrors?.hasOwnProperty('number') && invoiceContext.state.updateErrors['number'].map((error:string, index:number) => (<p className='text-danger fst-italic' key={index}>{error}</p>))
                                }
                            </div>
                            <div className="mb-0">
                                <label htmlFor="references" className="form-label">References(Optional)</label>                        
                                <input type="text" className="form-control" id="references" name="references" placeholder="References" value={invoice.references} onChange={(e) => setInvoice_(e)}/>
                            </div>
                        </div>
                    </div>
                    <div className="table-container-add mb-4">
                        <div className="table-responsive">
                            <table className="table text-center align-middle">
                                <thead>
                                    <tr className="table-primary">
                                        <th >Item Description</th>
                                        <th scope="col">Unit Price</th>
                                        <th scope="col">Quantity</th>
                                        <th scope="col">Total</th>
                                        <th scope="col"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        invoice.cartItems.length > 0 ?
                                        invoice.cartItems.map((item, index) =>
                                            <tr key={index}>
                                                <td>{item.product.item_code} {item.product.description}</td>
                                                <td className="">
                                                    <input style={{maxWidth:"120px"}} type="number" className="form-control mx-auto" id="unit_price" name="unit_price" placeholder="Unit Price" value={item.unit_price} onChange={(e) => updateListItems(e, item)}/>
                                                </td>
                                                <td className="">
                                                    <input style={{maxWidth:"120px"}} type="number" className="form-control mx-auto" id="quantity" name="quantity" placeholder="Quantity" value={item.quantity} onChange={(e) => updateListItems(e, item)}/>
                                                </td>
                                                <td>${item.unit_price * item.quantity}</td>
                                                <td><button className='btn btn-danger' onClick={() => deleteListItems(item.product.id)}>Delete</button></td>
                                            </tr> 
                                        )
                                        :
                                        <tr>
                                            <td>No Description</td>
                                                <td className="">
                                                    <input style={{maxWidth:"120px"}} type="number" className="form-control mx-auto" id="unit_price" name="unit_price"  placeholder="Unit Price"/>
                                                </td>
                                                <td className="">
                                                    <input style={{maxWidth:"120px"}} type="number" className="form-control mx-auto" id="quantity" name="quantity" placeholder="Quantity"/>
                                                </td>
                                                <td>$000</td>
                                                <td><button className='btn btn-danger' disabled>Delete</button></td>
                                        </tr>  
                                    }
                                    
                                </tbody>
                            </table>
                        </div>
                        <div className="px-3">
                            <button type="button" className="invoice-btn invoice-content-btn" onClick={setShowModal_}>Add New Item</button>
                        </div>
                    </div>
                    <div className="row p-3">
                        <div className="col-12 col-md-7 mb-3">
                            <label htmlFor="terms_and_conditions" className="form-label">Terms and Conditions</label>
                            <textarea className="form-control" id="terms_and_conditions" name="terms_and_conditions" rows={4} value={invoice.terms_and_conditions} onChange={(e) => setInvoice_(e)}>
                            </textarea>   
                            {
                                invoiceContext.state.updateErrors?.hasOwnProperty('terms_and_conditions') && invoiceContext.state.updateErrors['terms_and_conditions'].map((error:string, index:number) => (<p className='text-danger fst-italic' key={index}>{error}</p>))
                            }          
                        </div>
                        <div className="col-12 col-md-5">
                        <div className="mb-3 row">
                            <div className="col-sm-4"><strong>Sub Total:</strong></div>
                            <div className="col-sm-8">
                                <span>$ {subTotal}</span>
                            </div>
                            {
                                invoiceContext.state.updateErrors?.hasOwnProperty('sub_total') && invoiceContext.state.updateErrors['sub_total'].map((error:string, index:number) => (<p className='text-danger fst-italic' key={index}>{error}</p>))
                            } 
                        </div>
                        <div className="mb-3 row">
                                <label htmlFor="discount" className="col-sm-4 col-form-label">Discount</label>
                                <div className="col-sm-8">
                                    <input type="text" className="form-control" id="discount" name="discount" placeholder="00%" value={invoice.discount} onChange={(e) => setInvoice_(e)}/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-4"><strong>Total:</strong></div>
                                <div className="col-sm-8">
                                    <p className="">$ {Total}</p>
                                </div>
                                {
                                    invoiceContext.state.updateErrors?.hasOwnProperty('total') && invoiceContext.state.updateErrors['total'].map((error:string, index:number) => (<p className='text-danger fst-italic' key={index}>{error}</p>))
                                } 
                            </div>
                        </div>
                    </div>
                </>
            }
            </div>
            <div className="d-flex justify-content-between">
                <div></div>
                {
                    <button type="submit" disabled={invoiceContext. updating ? true:false} className="invoice-content-btn invoice-btn">
                        {
                            invoiceContext. updating ?
                            (
                                <div className="spinner-border text-success" role="status">
                                    <span className="visually-hidden">Editting...</span>
                                </div>
                            )
                            :
                            <>Edit Invoice</>    
                        }
                    </button>
                }
                
            </div>
        </form> 
        <ProductListModal products={ productContext.state.products } setShowModal_={setShowModal_} showModal={showModal} setListItems={setListItems}/>
    </div>
    )
}

export default UpdateInvoice