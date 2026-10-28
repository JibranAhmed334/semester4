import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function Navbar() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  // Read logged-in user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch {
        setCurrentUser(null);
      }
    } else {
      setCurrentUser(null);
    }
    // Collapse mobile menu on page change
    setIsNavCollapsed(true);
  }, [location]);

  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.log('Logout notice:', err.message);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setCurrentUser(null);
      navigate('/login');
    }
  };

  const toggleNav = () => {
    setIsNavCollapsed(!isNavCollapsed);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-navy shadow-sm sticky-top py-2">
      <div className="container">
        {/* Brand Logo */}
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold fs-4" to="/">
          <span className="brand-icon-box bg-orange text-white rounded d-inline-flex align-items-center justify-content-center">
            <i className="bi bi-calendar-check-fill"></i>
          </span>
          <span>Event<span className="text-orange">Sphere</span></span>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={toggleNav}
          aria-expanded={!isNavCollapsed}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav Links */}
        <div className={`collapse navbar-collapse ${!isNavCollapsed ? 'show' : ''}`} id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3 gap-lg-1">
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`} to="/">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`} to="/expos">
                Expos
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`} to="/exhibitors">
                Exhibitors
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`} to="/schedule">
                Schedule
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`} to="/floor-plan">
                Floor Plan
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`} to="/about">
                About Us
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`} to="/contact">
                Contact
              </NavLink>
            </li>
          </ul>

          {/* User Auth Section */}
          <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0">
            {currentUser ? (
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <Link to="/dashboard" className="btn btn-outline-light btn-sm d-flex align-items-center gap-1">
                  <i className="bi bi-speedometer2"></i>
                  <span>Dashboard</span>
                </Link>
                <div className="text-light small d-none d-md-block px-2 py-1 bg-navy-light rounded border border-secondary border-opacity-25">
                  <span className="fw-semibold text-capitalize">{currentUser.name}</span>{' '}
                  <span className="badge bg-orange text-uppercase ms-1" style={{ fontSize: '0.65rem' }}>
                    {currentUser.role}
                  </span>
                </div>
                <button onClick={handleLogout} className="btn btn-danger btn-sm d-flex align-items-center gap-1">
                  <i className="bi bi-box-arrow-right"></i>
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-outline-light btn-sm px-3">
                  <i className="bi bi-box-arrow-in-right me-1"></i>
                  Login
                </Link>
                <Link to="/register" className="btn btn-orange btn-sm px-3 text-white">
                  <i className="bi bi-person-plus me-1"></i>
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
