import { useState, useMemo } from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Link, } from "react-router-dom";
import { useInvoiceContext } from "../../context/InvoiceContext";
import InvoicePagination from '../../components/InvoicePagination';
import Loading from '../../components/Loading';
import TooltipB from '../../components/TooltipB';
import { useCustomerContext } from '../../context/CustomerContext';

const searchIcon = <FontAwesomeIcon icon={faMagnifyingGlass} />;

const Index = () => {

    const { state , getInvoices, loading, searchInvoices, clearSearch, filterInvoices } = useInvoiceContext();
    const customerContext = useCustomerContext();

    const [search, setSearch] = useState("");
    
    const  handleSearch = (e:React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handleFilter = (e:React.ChangeEvent<HTMLSelectElement>) => {
        filterInvoices(parseInt(e.target.value));
    }

    useMemo(() => {
        if(clearSearch){
            setSearch("");
        }
    }, [clearSearch])

    const setActivePagination = (e:React.MouseEvent<HTMLLIElement, MouseEvent>, url:string) => {
        e.preventDefault();
        getInvoices(url);
    }

    return (
        <div className="page-content">
            <div className="d-flex justify-content-between card-header">
                <h1 className="page-title">Invoice</h1>
                <Link to="/invoice/create">
                    <button type="button" className="invoice-btn new-invoice-btn">New Invoice</button>
                </Link>
            </div>
            <div className="card-content">
                {
                    loading ?
                    <Loading/>
                    :
                    <>
                        <div className="table-filter">
                            <span className="table-filter-collapse-btn">
                                <i className="fas fa-ellipsis-h"></i>
                            </span>
                            <ul className="table-filter-list">
                                <li>
                                    <p className="table-filter-link active">
                                        All
                                    </p>
                                </li>
                                <li>
                                    <p className="table-filter-link">
                                        Paid
                                    </p>
                                </li>
                            </ul>
                        </div>
                        <div className="table-container">
                            <div className="table-search">
                                <div className="table-search-wrapper">
                                    <select className="table-search-select" name="filter_invoice" onChange={(e) => handleFilter(e)}>
                                        <option value="0">Customer...</option>
                                    {             
                                            customerContext.state.customers && customerContext.state.customers.length > 0 ?
                                            customerContext.state.customers?.map((customer, index) => {
                                            return(
                                                <option key={index} value={customer.id}>{customer.first_name}</option>
                                            )
                                            }) 
                                            :
                                            <option value="">...</option> 
                                    }
                                        
                                    </select>
                                </div>
                                <form className="table-search-invoice-form" onSubmit={(e) => searchInvoices(e, search)}>
                                    <button type="submit" className="table-search-invoice-btn">{searchIcon}</button>
                                    <input className="table-search-input" type="text" placeholder="Search invoice" name="search_invoice" value={search} onChange={(e) => handleSearch(e)}/>
                                </form>
                            </div>
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">ID</th>
                                            <th scope="col">Date</th>
                                            <th scope="col">Number</th>
                                            <th scope="col">Customer</th>
                                            <th scope="col">Due Date</th>
                                            <th scope="col">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {  
                                            state.invoices.length > 0 ?
                                            state.invoices.map((invoice, index) =>(
                                                <tr key={index}>
                                                    <th scope="row">
                                                        <TooltipB title='view detail Invoice'>
                                                            <Link to={`/invoice/detail/${invoice.id}`}>
                                                                <p>{invoice.id}</p>
                                                            </Link>
                                                        </TooltipB> 
                                                    </th>
                                                    <td>{invoice.date}</td>
                                                    <td>{invoice.number}</td>
                                                    <td>{invoice.customer.first_name}</td>
                                                    <td>{invoice.due_date}</td>
                                                    <td>$ {invoice.total}</td>
                                                </tr>
                                            ))
                                        
                                            :
                                            <tr>
                                                <td colSpan="6">
                                                    <div className='py-5 text-center'>No invoice existing</div>    
                                                </td>
                                            </tr>
                                        }
                                        
                                    </tbody>
                                </table>
                            </div>
                            
                            {
                                state.invoice_links?.length ?
                                <InvoicePagination links={state.invoice_links} setActivePagination={setActivePagination}/>
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

export default Index