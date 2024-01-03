import { Link } from "react-router-dom"
type Link_ = {
    url: string,
    label: string,
    active: boolean,
}

type Props = {
    links:Link_[],
    setActivePagination: (event: React.MouseEvent<HTMLLIElement, MouseEvent>, url:string) => void
}

const InvoicePagination = ({links, setActivePagination}:Props) => {

  return (
    <nav aria-label="...">
        <ul className="pagination">
            {
                links?.length > 0 &&  
                links.map((link, index) => 
                    index == 0 ? 
                    <li key={index} className={`page-item ${!link.url ? "disabled":""}`} onClick={(e)=>setActivePagination(e,link.url)}>
                        <Link to="" className="page-link">Previous</Link>
                    </li>
                    :
                    index == links.length - 1 ? 
                    <li key={index} className={`page-item ${!link.url ? "disabled":""}`} onClick={(e)=>setActivePagination(e,link.url)} >
                        <Link to="" className="page-link">Next</Link>
                    </li>
                    :
                    <li key={index} className={`page-item ${link.active ? "active":""}`} aria-current={`${link.active ? "page":"false"}`} onClick={(e)=>setActivePagination(e, link.url)} >
                      <Link to="" className="page-link">{link.label}</Link>
                    </li>
                )
            }    
        </ul>
    </nav>
  )
}

export default InvoicePagination