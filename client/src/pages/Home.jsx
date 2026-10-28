import { Link } from 'react-router-dom';
import EventCard from '../components/EventCard';
import ExhibitorCard from '../components/ExhibitorCard';
import { sampleExpos, sampleExhibitors, sampleSchedule } from '../data/sampleData';

function Home() {
  const featuredExpos = sampleExpos.slice(0, 3);
  const featuredExhibitors = sampleExhibitors.slice(0, 3);
  const previewSchedule = sampleSchedule.slice(0, 3);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section text-white py-5 position-relative overflow-hidden">
        <div className="container py-lg-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <span className="badge bg-orange text-white px-3 py-2 rounded-pill text-uppercase fw-semibold mb-3 tracking-wider">
                <i className="bi bi-stars me-1"></i> The Premier Trade Show Platform
              </span>
              <h1 className="display-4 fw-bold lh-1 mb-3 text-white">
                Discover, Organize & Experience Global Expos
              </h1>
              <p className="lead text-light text-opacity-75 mb-4 pe-lg-4">
                EventSphere connects world-class organizers, innovative exhibitors, and industry professionals. Streamline your booth bookings, discover event schedules, and network with ease.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/expos" className="btn btn-orange btn-lg text-white px-4 py-2 shadow">
                  <i className="bi bi-compass me-2"></i> Explore Expos
                </Link>
                <Link to="/register" className="btn btn-outline-light btn-lg px-4 py-2">
                  <i className="bi bi-person-plus me-2"></i> Register as Attendee
                </Link>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="hero-card bg-white text-navy p-4 rounded-4 shadow-lg">
                <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
                  <h5 className="fw-bold mb-0">Upcoming Spotlight</h5>
                  <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
                    Live Booking
                  </span>
                </div>
                <div className="mb-3">
                  <h6 className="fw-bold text-navy mb-1">Global Tech & AI Summit 2026</h6>
                  <p className="text-muted small mb-2">Nov 15-18, 2026 • New York City</p>
                  <div className="progress" style={{ height: '8px' }}>
                    <div className="progress-bar bg-orange" style={{ width: '78%' }}></div>
                  </div>
                  <div className="d-flex justify-content-between small text-muted mt-1">
                    <span>Booths Reserved: 78%</span>
                    <span>120 Total</span>
                  </div>
                </div>
                <div className="bg-light p-3 rounded-3 mb-3">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <i className="bi bi-geo-alt-fill text-orange"></i>
                    <span className="small fw-semibold">Metropolitan Convention Center</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-people-fill text-primary"></i>
                    <span className="small text-muted">15,000+ Pre-registered Visitors</span>
                  </div>
                </div>
                <Link to="/expos/expo-1" className="btn btn-navy w-100">
                  View Spotlight Event
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="bg-navy-light text-white py-4 border-bottom border-secondary border-opacity-25">
        <div className="container">
          <div className="row text-center g-4">
            <div className="col-6 col-md-3">
              <h2 className="fw-bold text-orange mb-0">150+</h2>
              <p className="text-secondary small mb-0">Annual Expos</p>
            </div>
            <div className="col-6 col-md-3">
              <h2 className="fw-bold text-orange mb-0">2,400+</h2>
              <p className="text-secondary small mb-0">Exhibiting Companies</p>
            </div>
            <div className="col-6 col-md-3">
              <h2 className="fw-bold text-orange mb-0">85,000+</h2>
              <p className="text-secondary small mb-0">Global Attendees</p>
            </div>
            <div className="col-6 col-md-3">
              <h2 className="fw-bold text-orange mb-0">98%</h2>
              <p className="text-secondary small mb-0">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Expos Section */}
      <section className="py-5 bg-light">
        <div className="container py-3">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
            <div>
              <span className="text-orange fw-bold text-uppercase small">Flagship Events</span>
              <h2 className="fw-bold text-navy mb-0">Featured Expos & Trade Shows</h2>
            </div>
            <Link to="/expos" className="btn btn-outline-navy btn-sm mt-3 mt-md-0">
              View All Expos <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>

          <div className="row g-4">
            {featuredExpos.map((expo) => (
              <div className="col-md-6 col-lg-4" key={expo.id}>
                <EventCard event={expo} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose EventSphere */}
      <section className="py-5 bg-white">
        <div className="container py-3">
          <div className="text-center max-w-700 mx-auto mb-5">
            <span className="text-orange fw-bold text-uppercase small">Why EventSphere</span>
            <h2 className="fw-bold text-navy">Built for High-Impact Trade Shows</h2>
            <p className="text-muted">
              Everything needed to manage, promote, and navigate large scale expos from a single cohesive platform.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="p-4 border rounded-3 h-100 hover-shadow transition">
                <div className="feature-icon bg-orange-subtle text-orange rounded-3 p-3 d-inline-flex mb-3 fs-3">
                  <i className="bi bi-diagram-3-fill"></i>
                </div>
                <h5 className="fw-bold text-navy mb-2">Interactive Floor Plans</h5>
                <p className="text-muted small mb-0">
                  Explore exhibition halls with categorized booth grids, availability states, and detailed dimensions before you book.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-4 border rounded-3 h-100 hover-shadow transition">
                <div className="feature-icon bg-primary-subtle text-primary rounded-3 p-3 d-inline-flex mb-3 fs-3">
                  <i className="bi bi-calendar3"></i>
                </div>
                <h5 className="fw-bold text-navy mb-2">Multi-Track Schedules</h5>
                <p className="text-muted small mb-0">
                  Stay updated with stage keynotes, panel discussions, breakout workshops, and speaker profiles in real-time.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-4 border rounded-3 h-100 hover-shadow transition">
                <div className="feature-icon bg-success-subtle text-success rounded-3 p-3 d-inline-flex mb-3 fs-3">
                  <i className="bi bi-person-badge-fill"></i>
                </div>
                <h5 className="fw-bold text-navy mb-2">Role-Based Access</h5>
                <p className="text-muted small mb-0">
                  Dedicated experiences tailored specifically for attendees, registered exhibitors, and convention organizers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Exhibitors Section */}
      <section className="py-5 bg-light">
        <div className="container py-3">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
            <div>
              <span className="text-orange fw-bold text-uppercase small">Industry Leaders</span>
              <h2 className="fw-bold text-navy mb-0">Featured Exhibiting Brands</h2>
            </div>
            <Link to="/exhibitors" className="btn btn-outline-navy btn-sm mt-3 mt-md-0">
              Browse Exhibitor Directory <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>

          <div className="row g-4">
            {featuredExhibitors.map((exhibitor) => (
              <div className="col-md-4" key={exhibitor.id}>
                <ExhibitorCard exhibitor={exhibitor} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule Preview Section */}
      <section className="py-5 bg-white">
        <div className="container py-3">
          <div className="row g-5 align-items-center">
            <div className="col-lg-5">
              <span className="text-orange fw-bold text-uppercase small">Agenda Overview</span>
              <h2 className="fw-bold text-navy mb-3">Live Event Schedule & Sessions</h2>
              <p className="text-muted mb-4">
                Discover keynote speeches, workshops, and networking events designed to elevate your professional knowledge and connections.
              </p>
              <Link to="/schedule" className="btn btn-navy px-4">
                View Full 3-Day Schedule <i className="bi bi-arrow-right ms-1"></i>
              </Link>
            </div>

            <div className="col-lg-7">
              <div className="d-flex flex-column gap-3">
                {previewSchedule.map((session) => (
                  <div key={session.id} className="p-3 border rounded-3 bg-light d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <span className="badge bg-navy">{session.day}</span>
                        <span className="badge bg-orange text-white">{session.type}</span>
                        <span className="small text-muted">{session.time}</span>
                      </div>
                      <h6 className="fw-bold text-navy mb-1">{session.topic}</h6>
                      <div className="small text-secondary">
                        <i className="bi bi-mic me-1"></i> {session.speaker}
                      </div>
                    </div>
                    <div className="text-sm-end text-muted small">
                      <i className="bi bi-geo-alt me-1 text-danger"></i>
                      <span>{session.room}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-5 bg-navy text-white text-center">
        <div className="container py-4">
          <h2 className="fw-bold mb-3 text-white">Ready to Join the Next Big Trade Show?</h2>
          <p className="lead text-light text-opacity-75 mb-4 max-w-600 mx-auto">
            Create your account today as an Attendee or Exhibitor to manage your event participation.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/register" className="btn btn-orange btn-lg text-white px-4">
              Get Started Now
            </Link>
            <Link to="/contact" className="btn btn-outline-light btn-lg px-4">
              Contact Organizing Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;

