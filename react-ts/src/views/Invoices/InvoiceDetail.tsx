import { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import Loading from '../../components/Loading';
import { Invoice ,InvoiceItem } from '../../types/InvoiceTypes';
import { useInvoiceContext } from '../../context/InvoiceContext';
import { useReactToPrint } from 'react-to-print';
import { useCompanyContext } from '../../context/CompanyContext';

const InvoiceDetail = () => {

    const { id } = useParams();

    const companyContext = useCompanyContext();
    const { getInvoice , loading, deleteInvoice } = useInvoiceContext();
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

    const printRef = useRef<HTMLDivElement | null>(null);

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
      });

    useEffect(() => {
        if(id && !loading){
            let invoice_ = getInvoice(parseInt(id));
            if(invoice_){
                setInvoice(invoice_);
            }
        }
    }, [id, loading]);
    
    let output:any = "";
    if(loading){
        output = <Loading/>;
    }else{
        output =    
        <>
            {
                invoice ?
                <>
                    <div className="invoice-logo">
                        <img src={`${import.meta.env.VITE_LARAVEL_REACT_API_BASE_URL}/images/${companyContext.state.company.image ? companyContext.state.company.image:'logo.png'}`} alt="logo" />
                    </div>
                    <div className="invoice-title">
                        <div className="box-left">
                        </div>
                        <div className="box-title">
                            <h4>Invoice</h4>
                        </div>
                        <div className="box-left">
                        </div>
                    </div>
                    <div className="invoice-title-info">
                        <div className="box-left">
                            <h5>To Customer:</h5>
                            <p>{ invoice.customer.first_name }</p>
                        </div>
                        <div className="box-right">
                            <div className="invoice-title-info-item-1">
                                <p>Invoice#</p>
                                <span>{invoice.number}</span>
                            </div>
                            <div className="invoice-title-info-item-2">
                                <p>Date</p>
                                <span>{invoice.date}</span>
                            </div>
                            <div className="invoice-title-info-item-2">
                                <p>Due Date</p>
                                <span>{invoice.due_date}</span>
                            </div>
                            <div className="invoice-title-info-item-2">
                                <p>Referrence</p>
                                <span>{invoice.references}</span>
                            </div>
                        </div>
                    </div>
                    <div className="invoice-table">
                        <div className="invoice-table-header">
                            <h5 className="table-item id">#1</h5>
                            <h5 className="table-item description">Description</h5>
                            <h5 className="table-item unit-price">Unit-price</h5>
                            <h5 className="table-item quantity">Quantity</h5>
                            <h5 className="table-item total">Total</h5>
                        </div>
                        <div className="invoice-table-body">
                            {
                                invoice.cartItems.length > 0 &&
                                invoice.cartItems.map((cartItem:InvoiceItem, index:number) =>
                                    <div className="table-row" key={index}>
                                        <p className="table-item id">{index + 1}</p>
                                        <p className="table-item description">{cartItem.product.description}</p>
                                        <p className="table-item unit-price">{cartItem.unit_price}</p>
                                        <p className="table-item quantity">{cartItem.quantity}</p>
                                        <p className="table-item total">{cartItem.unit_price * cartItem.quantity}</p>
                                    </div>
                                )
                                
                            }
                        
                        </div>
                    </div>
                    <div className="invoice-subtotal">
                        <h5 className='message'>Thank you for your bussiness</h5>
                        <p></p> 
                        <div className="sub-total">
                            <p>Sub Total</p>
                            <span>{invoice.sub_total}</span>
                        </div>
                    </div>
                    <div className="invoice-discount"> 
                        <p></p> 
                        <p></p> 
                        <div className="discount">
                            <p>Discount</p>
                            <span>{invoice.discount}</span>
                        </div>
                    </div>
                    <div className="invoice-total"> 
                        <div className="terms-and-condition">
                            <h5 className='term-title'>Terms and Conditions</h5>
                            <p className='term-terms'>{invoice.terms_and_conditions}</p>
                        </div>
                        <p></p> 
                        <div className="total">
                            <p>Total</p>
                            <span>{invoice.total}</span>
                        </div>
                    </div>
                    <div className="invoice-footer">
                        <div className="company">
                            <h5 className="company-name">{companyContext.state.company.name}</h5>
                            <p className="company-address">{companyContext.state.company.address}</p>
                        </div>
                        <p className="copyright">© 2023 - 2023 nbmblueeye - All Rights Reserved.</p>
                    </div>
                </>
                :
                <div className='py-5 text-center'>No invoice existing</div>         
            }
        </> 
    }
  
    return (
        <div className="page-content">
            <div className="card-header-box">
                <div className="card-header">
                    <h1 className="page-title">Invoice</h1>
                    <Link to="/invoice">
                        <button type="button" className="invoice-btn new-invoice-btn">Back</button>
                    </Link>   
                </div>
                {
                    invoice &&
                    <>
                         <div className="header-info">
                            <p className="header-item invoice-id">#{invoice.id}</p>
                            <p className="header-item invoice-date">{invoice.date}</p>
                        </div>
                        <div className="heacer-action">
                            <Link to={{}} onClick={handlePrint}>
                                <p className="header-item invoice-action">
                                    <span className='me-2'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-printer" viewBox="0 0 16 16"><path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/><path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2H5zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4V3zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2H5zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1z"/></svg></span>
                                    Print
                                </p>
                            </Link>
                            <Link to={`/invoice/update/${invoice.id}`}>
                                <p className="header-item invoice-action">
                                    <span className='me-2'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg>
                                    </span>
                                    Edit
                                </p>
                            </Link>
                            <Link to="/">
                                <p className="header-item invoice-action" onClick={(e) => deleteInvoice(e, invoice.id)}>
                                    <span className='me-2'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/><path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/></svg>
                                    </span>
                                    Delete
                                </p>
                            </Link>
                        </div>
                    </>
                }
               
            </div>
            <div className="card-content" ref={printRef}> 
                {output}
            </div>
        </div>
    )
}

export default InvoiceDetail