import React, { useState , useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import { NavLink } from "react-router-dom";


import Swal from 'sweetalert2'


const Navbar = () => {

  const [show,setShow] = useState(false);
  const [showLogin,setShowLogin] = useState(true);
  
  const forceUpdate = useState()[1].bind(null, {})

  const onLogout = async()=>{
    const res = await fetch("/logout", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      }
      
    });

    forceUpdate();
console.log(res);
    if (res.status === 200 || res.status === 304 ) {
      localStorage.removeItem("User");
      
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
        })
        
        Toast.fire({
        icon: 'success',
        title: "Logout Successful"
        })
    }
    
  }
  
  useEffect(()=>{
    if(localStorage.getItem("User")){
      setShow(true)
      setShowLogin(false);
    }
    else{
      setShow(false);
      setShowLogin(true);
    }
  },[onLogout])

    return (
        <>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
  <div className="container-fluid">
    <NavLink className="navbar-brand" to="/home"><i className="bi bi-file-earmark-post"></i> Boards</NavLink>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <NavLink className="nav-link" to="/home">Home</NavLink>
        </li>
        {showLogin && <li className="nav-item">
          <NavLink className="nav-link pull-right" to="/login">Login</NavLink>
        </li>}
        <li className="nav-item">
          <NavLink className="nav-link" to="/signup">Register</NavLink>
        </li>
        {show && <li className="nav-item">
          <NavLink className="nav-link" to="/login" onClick={onLogout}>Logout</NavLink>
        </li>}
      </ul>
      
    </div>
  </div>
</nav>
        </>
    )
}

export default Navbar
