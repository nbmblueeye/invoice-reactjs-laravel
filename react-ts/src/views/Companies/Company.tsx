import { useEffect, useState } from "react";
import { useCompanyContext } from "../../context/CompanyContext";
import Loading from "../../components/Loading";

import { Company } from "../../types/InvoiceTypes";
import ImageInput from "../../components/ImageInput";

const CompanyInfo = () => {

    const companyContext = useCompanyContext();
    const [company, setCompany] = useState<Company>({
        id:0,
        name: "",
        phone: "",
        email: "",
        address: "",
        image: "",
    });

    const setCompany_ = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        setCompany({...company, [e.target.name]: e.target.value})
    }

    useEffect(() => {
        if(!companyContext.loading){   
            if(companyContext.state.company.id){
                setCompany({
                    id:companyContext.state.company.id,
                    name: companyContext.state.company.name,
                    phone: companyContext.state.company.phone,
                    email: companyContext.state.company.email,
                    address: companyContext.state.company.address,
                    image: companyContext.state.company.image,
                })
            }
        }
    }, [companyContext.loading, companyContext.adding, companyContext.updating])
    
  return (
    <div className="page-content">
        <div className="d-flex justify-content-between card-header">
            <h1 className="page-title">Company</h1>
        </div>
        <form onSubmit={(e) => (companyContext.state.company.id) ? companyContext.updateCompany(e, company):companyContext.addCompany(e, company)}>
            <div className="card-content">
                {
                    companyContext.loading ?
                    <Loading/>
                    :
                    <div className="row g-3 p-4">
                        <div className="col-md-6">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input type="text" className="form-control" id="name" name="name" placeholder="Company Name" value={company.name} onChange={(e) => setCompany_(e)}/>
                            <div className="errors">
                                {
                                    companyContext.state.updateErrors?.hasOwnProperty('name') && 
                                    companyContext.state.updateErrors['name'].map((error:string, index:number) => (<p className='text-danger fst-italic' key={index}>{error}</p>))
                                }
                            </div>
                        </div>
                        <div className="col-md-6"></div>
                        <div className="col-md-6">
                            <label htmlFor="phone" className="form-label">Phone</label>
                            <input type="text" className="form-control" id="phone" name="phone" placeholder="000000000" value={company.phone} onChange={(e) => setCompany_(e)}/>
                            <div className="errors">
                                {
                                    companyContext.state.updateErrors?.hasOwnProperty('phone') && 
                                    companyContext.state.updateErrors['phone'].map((error:string, index:number) => (<p className='text-danger fst-italic' key={index}>{error}</p>))
                                }
                            </div>   
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input type="text" className="form-control" id="email" name="email" placeholder="email@gmail.com" value={company.email} onChange={(e) => setCompany_(e)}/>
                            <div className="errors">
                                {
                                    companyContext.state.updateErrors?.hasOwnProperty('email') && 
                                    companyContext.state.updateErrors['email'].map((error:string, index:number) => (<p className='text-danger fst-italic' key={index}>{error}</p>))
                                }
                            </div>     
                        </div>
                        <div className="col-md-12">
                            <label htmlFor="address" className="form-label">Address</label>
                            <textarea className="form-control" id="address" name="address" placeholder="Company Address" rows={3} value={company.address} onChange={(e) => setCompany_(e)}/>
                            <div className="errors">
                                {
                                    companyContext.state.updateErrors?.hasOwnProperty('address') && 
                                    companyContext.state.updateErrors['address'].map((error:string, index:number) => (<p className='text-danger fst-italic' key={index}>{error}</p>))
                                }
                            </div>     
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="image" className="form-label">Company Logo (Size:400x100)</label>
                            <ImageInput datas={ company } setDatas={ setCompany } files="images" />
                        </div>
                    </div>
                }                
            </div>
            <div className="d-flex justify-content-between">
                <div></div>
                {
                    (companyContext.state.company.id) ?
                    <button type="submit" disabled={companyContext.updating ? true:false} className="invoice-content-btn invoice-btn">
                        {
                            companyContext.updating ?
                            (
                                <div className="spinner-border text-success" role="status">
                                    <span className="visually-hidden">Updating...</span>
                                </div>
                            )
                            :
                            <>Update Company</>    
                        }
                    </button>
                    :
                    <button type="submit" disabled={companyContext.adding ? true:false} className="invoice-content-btn invoice-btn">
                        {
                            companyContext.adding ?
                            (
                                <div className="spinner-border text-success" role="status">
                                    <span className="visually-hidden">Adding...</span>
                                </div>
                            )
                            :
                            <>Add Company</>    
                        }
                    </button>
                }             
            </div>
        </form>
    </div>
  )
}

export default CompanyInfo