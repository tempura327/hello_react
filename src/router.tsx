import React from 'react'
import { useRoutes } from 'react-router-dom'

import Home from './pages/Home'
import About from './pages/About'
import Product from './pages/Product'

export default function App() {
    let element = useRoutes([
        { path: '/', element: <Home /> },
        { path: 'about', element: <About />},
        { path: 'product', element: <Product /> },
    ])
    return element
}