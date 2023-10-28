import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Welcome from './pages/Welcome'
import App from './App'
import './index.css'

const router = createBrowserRouter([
  {
    index: true,
    path: '/',
    element: <App />
  },
  {
    path: '/welcome',
    element: <Welcome />
  }
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
