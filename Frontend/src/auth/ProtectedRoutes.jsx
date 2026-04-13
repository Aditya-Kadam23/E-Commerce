import React from 'react'
import { Outlet } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
const ProtectedRoutes = ({requiredRole}) => {
  
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if(!token || !user){
        return <Navigate to='/login'/>
    }
    const userRole = user.role;
    if(requiredRole && userRole !== requiredRole){
        return <Navigate to='/login'/>
    }
  return <Outlet />
}

export default ProtectedRoutes
