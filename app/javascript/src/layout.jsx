// Layout.js
import React from 'react';
import "@src/layout.scss";
import { handleLogout } from '@src/utils/fetchHelper'
import $ from 'jquery'

const Layout = (props) => {
  const { authenticated, username } = props;
  
  return (
    <React.Fragment>
      <nav className="navbar navbar-expand navbar-light bg-light">
        <a href="/"><span className="navbar-brand mb-0 h1 text-danger">Airbnb</span></a>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" href="/host/homes">Host your home</a> 
            </li>
            
            {/* User dropdown */}
            {  
              authenticated ? 
              <li id='navDropDown' className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  User
                </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <a className="dropdown-item" href={`/host/homes/${username}/user_home`}>My properties</a>
                <a className="dropdown-item" href={`/bookings/user/${username}/user_booking`}>My bookings</a>
                <div className="dropdown-divider"></div>
                  <a className="dropdown-item" href="#" onClick={(e) => { handleLogout(e) }}>Logout</a> 
                </div>
              </li> : 
              // else
              <li className="nav-item">
                <a className="nav-link" href="/login">Login</a> 
              </li>
            }
          </ul>
        </div>
      </nav>
      {props.children}
      <footer className="p-3 bg-light">
        <div>
          <p className="mr-3 mb-0 text-secondary">Airbnb Clone</p>
        </div>
      </footer>
    </React.Fragment>
  );
}

export default Layout;
