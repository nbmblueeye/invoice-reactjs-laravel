import { Product } from '../types/InvoiceTypes';
import TooltipB from './TooltipB';

type Input = {
    products: Product[],
    setShowModal_: () => void,
    setListItems: (product:Product) => void,
    showModal: boolean
}

const ProductListModal = ({products, showModal,setShowModal_, setListItems}:Input) => {

  return (
    <div className={`modal_container ${ showModal ? "show_modal":""}`}>
        <div className="card">
            <div className="close_modal" onClick={setShowModal_}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                </svg>
            </div>
            <div className="card-header">
                Available Products
            </div>
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Item_Code</th>
                                <th scope="col">Description</th>
                                <th scope="col">Unit Price</th>
                                <th scope="col">Add to List</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                products.length > 0 ?
                                products.map((product, index) =>
                                    <tr key={index}>
                                        <th scope="row">{product.id}</th>
                                        <td>{product.item_code}</td>
                                        <td>{product.description}</td>
                                        <td>{product.unit_price}</td>
                                        <td>
                                            <TooltipB title='add a Product'>
                                            <button className='btn btn-outline-primary' onClick={() => setListItems(product)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
                                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                                            </svg>
                                            </button>
                                            </TooltipB>
                                        </td>
                                    </tr>
                                )
                                :
                                <tr>
                                     <td colSpan="6">There are No Product</td>
                                </tr>
                            }
                           
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ProductListModal