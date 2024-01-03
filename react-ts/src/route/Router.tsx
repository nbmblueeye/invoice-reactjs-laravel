import MainLayout from '../layout/MainLayout';
import Index from '../views/Invoices/Index';
import { Navigate, createBrowserRouter } from 'react-router-dom';
import NotFound from '../views/NotFound';
import UpdateInvoice from '../views/Invoices/UpdateInvoice';
import AddInvoice from '../views/Invoices/AddInvoice';
import InvoiceDetail from '../views/Invoices/InvoiceDetail';
import Company from '../views/Companies/Company';
import Customer from '../views/Customers/Customer';
import AddCustomer from '../views/Customers/AddCustomer';
import UpdateCustomer from '../views/Customers/UpdateCustomer';
import Product from '../views/Products/Product';
import AddProduct from '../views/Products/AddProduct';
import UpdateProduct from '../views/Products/UpdateProduct';


const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout/>,
      children: [
        {
          path:"/",
          element: <Navigate to="/invoice"/>
        },
        
        {
          path: "/invoice",
          element:<Index/>,
        },

        {
          path: "/invoice/detail/:id",
          element:<InvoiceDetail/>,
        },

        {
          path: "/invoice/create",
          element:<AddInvoice/>,
        },

        {
          path: "/invoice/update/:id",
          element:<UpdateInvoice/>,
        },

        {
          path: "/company",
          element:<Company/>
        },

        {
          path: "/customer",
          element:<Customer/>,
        },

        {
          path: "/customer/create",
          element: <AddCustomer/>,
        },

        {
          path: "/customer/update/:id",
          element: <UpdateCustomer/>,
        },

        {
          path: "/product",
          element: <Product/>,
        },

        {
          path: "/product/create",
          element: <AddProduct/>,
        },

        {
          path: "/product/update/:id",
          element: <UpdateProduct/>,
        },
        
        {
          path: "*",
          element:<NotFound/>,
        },
      ],
    },
  ]);

export default router;