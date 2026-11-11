import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function Navbar() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const [openDropdown, setOpenDropdown] = useState('');
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
    setOpenDropdown('');
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

  if (['/login', '/register'].includes(location.pathname)) return null;

  const closeMenus = () => {
    setIsNavCollapsed(true);
    setOpenDropdown('');
  };

  const toggleDropdown = (name) => {
    setOpenDropdown((current) => current === name ? '' : name);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark site-navbar sticky-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold" to="/" onClick={closeMenus}>
          <span className="brand-icon-box site-brand-icon text-white rounded-3 d-inline-flex align-items-center justify-content-center">
            <i className="bi bi-calendar-check-fill"></i>
          </span>
          <span className="site-brand-name">Event<span>Sphere</span></span>
        </Link>

        <button
          className="navbar-toggler site-nav-toggler"
          type="button"
          onClick={toggleNav}
          aria-expanded={!isNavCollapsed}
          aria-label="Toggle navigation"
          aria-controls="navbarContent"
        >
          <i className={`bi ${isNavCollapsed ? 'bi-list' : 'bi-x-lg'}`} aria-hidden="true"></i>
        </button>

        <div className={`collapse navbar-collapse ${!isNavCollapsed ? 'show' : ''}`} id="navbarContent">
          <ul className="navbar-nav me-auto my-3 my-lg-0 ms-lg-4 gap-lg-1">
            <li className="nav-item">
              <NavLink onClick={closeMenus} className={({ isActive }) => `nav-link site-nav-link ${isActive ? 'active-link' : ''}`} to="/">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink onClick={closeMenus} className={({ isActive }) => `nav-link site-nav-link ${isActive ? 'active-link' : ''}`} to="/expos">
                Expos
              </NavLink>
            </li>
            <li className={`nav-item dropdown site-dropdown ${openDropdown === 'visit' ? 'show' : ''}`}>
              <button
                type="button"
                className="nav-link site-nav-link dropdown-toggle"
                aria-expanded={openDropdown === 'visit'}
                onClick={() => toggleDropdown('visit')}
              >
                Plan your visit
              </button>
              <ul className={`dropdown-menu site-dropdown-menu ${openDropdown === 'visit' ? 'show' : ''}`}>
                <li><NavLink onClick={closeMenus} className="dropdown-item" to="/schedule"><i className="bi bi-calendar3"></i> Event schedule</NavLink></li>
                <li><NavLink onClick={closeMenus} className="dropdown-item" to="/floor-plan"><i className="bi bi-map"></i> Booth floor plan</NavLink></li>
                <li><NavLink onClick={closeMenus} className="dropdown-item" to="/exhibitors"><i className="bi bi-shop"></i> Exhibitors</NavLink></li>
              </ul>
            </li>
            <li className={`nav-item dropdown site-dropdown ${openDropdown === 'about' ? 'show' : ''}`}>
              <button
                type="button"
                className="nav-link site-nav-link dropdown-toggle"
                aria-expanded={openDropdown === 'about'}
                onClick={() => toggleDropdown('about')}
              >
                About
              </button>
              <ul className={`dropdown-menu site-dropdown-menu ${openDropdown === 'about' ? 'show' : ''}`}>
                <li><NavLink onClick={closeMenus} className="dropdown-item" to="/about"><i className="bi bi-info-circle"></i> About EventSphere</NavLink></li>
                <li><NavLink onClick={closeMenus} className="dropdown-item" to="/contact"><i className="bi bi-chat-dots"></i> Contact us</NavLink></li>
              </ul>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-2 site-auth-actions">
            {currentUser ? (
              <div className={`dropdown site-dropdown ${openDropdown === 'account' ? 'show' : ''}`}>
                <button
                  type="button"
                  className="btn site-account-button dropdown-toggle d-flex align-items-center gap-2"
                  aria-expanded={openDropdown === 'account'}
                  onClick={() => toggleDropdown('account')}
                >
                  <span className="site-avatar">{(currentUser.name || 'U').charAt(0).toUpperCase()}</span>
                  <span className="text-start">
                    <span className="d-block site-account-name">{currentUser.name}</span>
                    <span className="d-block site-account-role">{currentUser.role}</span>
                  </span>
                </button>
                <ul className={`dropdown-menu dropdown-menu-end site-dropdown-menu site-account-menu ${openDropdown === 'account' ? 'show' : ''}`}>
                  <li><Link onClick={closeMenus} className="dropdown-item" to="/dashboard"><i className="bi bi-speedometer2"></i> Dashboard</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button onClick={() => { closeMenus(); handleLogout(); }} className="dropdown-item site-logout-item">
                      <i className="bi bi-box-arrow-right"></i> Sign out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link onClick={closeMenus} to="/login" className="btn site-login-button">
                  Sign in
                </Link>
                <Link onClick={closeMenus} to="/register" className="btn site-register-button">
                  Get started <i className="bi bi-arrow-up-right ms-1"></i>
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
