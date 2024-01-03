import { Outlet } from "react-router-dom"
import InvoiceContext from "../context/InvoiceContext"
import ProductContext from "../context/ProductContext"
import NavBar from "./NavBar"
import CompanyContext from "../context/CompanyContext"

import CustomerContext from "../context/CustomerContext"

const MainLayout = () => {
 
  return (
   
      <CompanyContext> 
        <CustomerContext>
          <InvoiceContext>
            <ProductContext>
              <NavBar/>
                <div className="main">
                  <div className="container">
                  <Outlet/>
                  </div>
                </div>
            </ProductContext>
          </InvoiceContext>
        </CustomerContext> 
      </CompanyContext>  
     
  )
}

export default MainLayout