import { Link, useLocation } from "react-router-dom";

const NavBar = () => {

  const location = useLocation();

  return (
    <div className='nav-bar-container'>
      <div className="container">
          <div className="nav-box">
              <Link to="/"><h5 className={`main-nav ${location.pathname.includes("/invoice") ? "active":""}`}>Invoice</h5></Link>
              <ul className="nav-item-box">
                <li className={`nav-item ${location.pathname.includes("/company") ? "active":""}`}><Link to="/company">Company</Link></li>
                <li className={`nav-item ${location.pathname.includes("/customer") ? "active":""}`}><Link to="/customer">Customer</Link></li>
                <li className={`nav-item ${location.pathname.includes("/product") ? "active":""}`}><Link to="/product">Product</Link></li>
              </ul>
          </div>
      </div>
    </div>
  )
}

export default NavBar