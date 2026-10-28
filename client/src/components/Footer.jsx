import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-navy text-light pt-5 pb-4 mt-auto border-top border-secondary border-opacity-25">
      <div className="container">
        <div className="row g-4 mb-4">
          {/* Brand info */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="brand-icon-box bg-orange text-white rounded d-inline-flex align-items-center justify-content-center">
                <i className="bi bi-calendar-check-fill"></i>
              </span>
              <span className="fs-4 fw-bold">Event<span className="text-orange">Sphere</span></span>
            </div>
            <p className="text-secondary small pe-lg-3">
              The premier Expo & Trade Show Management System designed to connect organizers, exhibitors, and attendees seamlessly across global exhibitions and conferences.
            </p>
            <div className="d-flex gap-2 text-secondary">
              <span className="badge bg-navy-light border border-secondary border-opacity-25 p-2">
                <i className="bi bi-globe me-1 text-orange"></i> Global Network
              </span>
              <span className="badge bg-navy-light border border-secondary border-opacity-25 p-2">
                <i className="bi bi-shield-check me-1 text-orange"></i> Verified Expos
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="text-white fw-bold mb-3 text-uppercase small tracking-wide">Explore</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/expos" className="footer-link">All Expos</Link></li>
              <li><Link to="/exhibitors" className="footer-link">Exhibitor Directory</Link></li>
              <li><Link to="/schedule" className="footer-link">Event Schedule</Link></li>
              <li><Link to="/floor-plan" className="footer-link">Booth Floor Plan</Link></li>
            </ul>
          </div>

          {/* User Portal links */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="text-white fw-bold mb-3 text-uppercase small tracking-wide">Portal</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2">
              <li><Link to="/login" className="footer-link">Sign In</Link></li>
              <li><Link to="/register" className="footer-link">Create Account</Link></li>
              <li><Link to="/forgot-password" className="footer-link">Reset Password</Link></li>
              <li><Link to="/dashboard" className="footer-link">Member Dashboard</Link></li>
              <li><Link to="/about" className="footer-link">About EventSphere</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="col-lg-4 col-md-6">
            <h6 className="text-white fw-bold mb-3 text-uppercase small tracking-wide">Contact Desk</h6>
            <ul className="list-unstyled small text-secondary d-flex flex-column gap-2">
              <li className="d-flex align-items-start gap-2">
                <i className="bi bi-geo-alt-fill text-orange mt-1"></i>
                <span>Convention Boulevard, Suite 400, Expo City</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <i className="bi bi-telephone-fill text-orange"></i>
                <span>+1 (800) 555-EXPO (3976)</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <i className="bi bi-envelope-fill text-orange"></i>
                <span>support@eventsphere.example.com</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <i className="bi bi-clock-fill text-orange"></i>
                <span>Mon - Fri: 08:30 AM - 06:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="border-top border-secondary border-opacity-25 pt-3 d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 text-secondary small">
          <div>
            &copy; {new Date().getFullYear()} EventSphere Management System. All rights reserved.
          </div>
          <div className="text-muted">
            Developed for Semester 4 Project Presentation
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

