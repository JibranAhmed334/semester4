import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Expos from './pages/Expos';
import EventDetails from './pages/EventDetails';
import Exhibitors from './pages/Exhibitors';
import Schedule from './pages/Schedule';
import FloorPlan from './pages/FloorPlan';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';

// Helper component to scroll to top on page route changes
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// 404 Not Found Page
function NotFound() {
  return (
    <div className="container py-5 text-center min-vh-50 d-flex flex-column align-items-center justify-content-center">
      <h1 className="display-4 fw-bold text-navy">404</h1>
      <h4 className="text-secondary mb-3">Page Not Found</h4>
      <p className="text-muted mb-4">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/" className="btn btn-navy">
        <i className="bi bi-house-door me-1"></i> Return to Homepage
      </Link>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/expos" element={<Expos />} />
            <Route path="/expos/:id" element={<EventDetails />} />
            <Route path="/exhibitors" element={<Exhibitors />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/floor-plan" element={<FloorPlan />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
