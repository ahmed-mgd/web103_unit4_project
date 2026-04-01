import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../css/Navigation.css'

const Navigation = () => {
  const { pathname } = useLocation()

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="brand-icon">⚡</span>
        <span className="brand-text">PC<span className="brand-accent">Forge</span></span>
      </Link>

      <ul className="navbar-links">
        <li>
          <Link to="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>
            Build
          </Link>
        </li>
        <li>
          <Link to="/customcars" className={`nav-link ${pathname === '/customcars' ? 'active' : ''}`}>
            My Builds
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navigation
