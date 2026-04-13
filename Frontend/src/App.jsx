import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import Contact from './pages/Contact'
import Products from './pages/Products'
import Login from './pages/Login'
import Register from './pages/Register'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import Cart from './pages/Cart'
import { CategoryProvider } from './context/CategoryContext'
import Dashboard from './pages/admin/Dashboard'
import AdminLayout from './layouts/AdminLayout'
import AdminProducts from './pages/admin/Products'
import AdminOrders from './pages/admin/Orders'
import AdminUsers from './pages/admin/Users'
import UserLayout from './layouts/UserLayout'
import ProtectedRoutes from './auth/ProtectedRoutes'

const App = () => {
  return (
    <CategoryProvider>
      <div>
        <Routes>
          {/* Public routes */}
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />

          {/* User routes with Navbar layout */}
          <Route element={<UserLayout />}>
            <Route element={<ProtectedRoutes />}>
              <Route path='/' element={<Home />} />
              <Route path='/collection' element={<Collection />} />
              <Route path='/contact' element={<Contact />} />
              <Route path='/product/:productId' element={<Products />} />
              <Route path='/cart' element={<Cart />} />
              <Route path='/place-order' element={<PlaceOrder />} />
              <Route path='/orders' element={<Orders />} />
            </Route>
          </Route>

          {/* Admin routes */}
          <Route element={<ProtectedRoutes requiredRole='admin' />}>
            <Route path='/admin' element={<AdminLayout />}>
              <Route path='dashboard' element={<Dashboard />} />
              <Route path='products' element={<AdminProducts />} />
              <Route path='orders' element={<AdminOrders />} />
              <Route path='users' element={<AdminUsers />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </CategoryProvider>
  )
}

export default App
