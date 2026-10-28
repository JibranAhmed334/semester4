import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { sampleDashboardStats, sampleExpos } from '../data/sampleData';

function Dashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      navigate('/login');
    } else {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch {
        navigate('/login');
      }
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.log('Logout notice:', err.message);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="dashboard-page bg-light min-vh-100 py-4">
      <div className="container">
        {/* Top welcome banner */}
        <div className="bg-navy text-white rounded-4 p-4 mb-4 shadow-sm">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="badge bg-orange text-uppercase px-2 py-1">
                  {currentUser.role || 'Member'} Account
                </span>
                <span className="small text-light text-opacity-75">
                  <i className="bi bi-clock me-1"></i> Session Active
                </span>
              </div>
              <h2 className="fw-bold text-white mb-1">
                Hello, {currentUser.name || 'Member'}!
              </h2>
              <p className="text-light text-opacity-75 small mb-0">
                Welcome to your EventSphere Management Portal ({currentUser.email})
              </p>
            </div>

            <div className="d-flex gap-2">
              <Link to="/expos" className="btn btn-orange text-white btn-sm px-3">
                <i className="bi bi-compass me-1"></i> Browse Expos
              </Link>
              <button onClick={handleLogout} className="btn btn-outline-light btn-sm px-3">
                <i className="bi bi-box-arrow-right me-1"></i> Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard layout with Sidebar & Main Area */}
        <div className="row g-4">
          {/* Sidebar */}
          <div className="col-lg-3">
            <div className="card border-0 shadow-sm rounded-4 p-3 bg-white mb-4">
              <h6 className="text-uppercase text-muted fw-bold small mb-3 px-2">Navigation</h6>
              <div className="nav flex-column nav-pills gap-1">
                <button
                  className={`nav-link text-start rounded-3 ${activeTab === 'overview' ? 'active bg-navy' : 'text-secondary'}`}
                  onClick={() => setActiveTab('overview')}
                >
                  <i className="bi bi-grid-fill me-2"></i> Overview
                </button>
                <button
                  className={`nav-link text-start rounded-3 ${activeTab === 'registrations' ? 'active bg-navy' : 'text-secondary'}`}
                  onClick={() => setActiveTab('registrations')}
                >
                  <i className="bi bi-ticket-perforated-fill me-2"></i> My Passes
                </button>
                <button
                  className={`nav-link text-start rounded-3 ${activeTab === 'booths' ? 'active bg-navy' : 'text-secondary'}`}
                  onClick={() => setActiveTab('booths')}
                >
                  <i className="bi bi-shop-window me-2"></i> Booth Inquiries
                </button>
                <button
                  className={`nav-link text-start rounded-3 ${activeTab === 'profile' ? 'active bg-navy' : 'text-secondary'}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <i className="bi bi-person-circle me-2"></i> Account Profile
                </button>
              </div>

              <hr className="my-3 text-muted" />

              <h6 className="text-uppercase text-muted fw-bold small mb-2 px-2">Role Portals</h6>
              <div className="list-group list-group-flush small">
                <div className="list-group-item border-0 px-2 py-1 text-muted">
                  <i className="bi bi-person-check text-success me-2"></i> Attendee Features: Active
                </div>
                <div className="list-group-item border-0 px-2 py-1 text-muted">
                  <i className="bi bi-building text-primary me-2"></i> Exhibitor Hub: Available
                </div>
                <div className="list-group-item border-0 px-2 py-1 text-muted">
                  <i className="bi bi-shield-lock text-orange me-2"></i> Organizer Tools: View Only
                </div>
              </div>
            </div>

            {/* Quick Links Card */}
            <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
              <h6 className="fw-bold text-navy small mb-3">Quick Navigation</h6>
              <div className="d-flex flex-column gap-2 small">
                <Link to="/floor-plan" className="text-decoration-none text-secondary">
                  <i className="bi bi-grid-3x3-gap text-orange me-2"></i> Hall Floor Plan
                </Link>
                <Link to="/schedule" className="text-decoration-none text-secondary">
                  <i className="bi bi-calendar3 text-primary me-2"></i> Full Session Schedule
                </Link>
                <Link to="/exhibitors" className="text-decoration-none text-secondary">
                  <i className="bi bi-building me-2 text-navy"></i> Exhibitor Directory
                </Link>
              </div>
            </div>
          </div>

          {/* Main Area */}
          <div className="col-lg-9">
            {activeTab === 'overview' && (
              <>
                {/* 4 Summary Cards */}
                <div className="row g-3 mb-4">
                  <div className="col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="text-muted small">Total Expos</span>
                        <div className="p-2 rounded-3 bg-navy-light text-orange">
                          <i className="bi bi-calendar-event fs-5"></i>
                        </div>
                      </div>
                      <h3 className="fw-bold text-navy mb-0">{sampleDashboardStats.totalExpos}</h3>
                      <span className="small text-muted">Across 6 major cities</span>
                    </div>
                  </div>

                  <div className="col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="text-muted small">Active Exhibitors</span>
                        <div className="p-2 rounded-3 bg-primary-subtle text-primary">
                          <i className="bi bi-building-check fs-5"></i>
                        </div>
                      </div>
                      <h3 className="fw-bold text-navy mb-0">{sampleDashboardStats.totalExhibitors}</h3>
                      <span className="small text-muted">Verified enterprise booths</span>
                    </div>
                  </div>

                  <div className="col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="text-muted small">Attendees</span>
                        <div className="p-2 rounded-3 bg-success-subtle text-success">
                          <i className="bi bi-people-fill fs-5"></i>
                        </div>
                      </div>
                      <h3 className="fw-bold text-navy mb-0">{sampleDashboardStats.registeredAttendees.toLocaleString()}</h3>
                      <span className="small text-muted">Pre-registered delegates</span>
                    </div>
                  </div>

                  <div className="col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="text-muted small">Sessions</span>
                        <div className="p-2 rounded-3 bg-warning-subtle text-warning">
                          <i className="bi bi-mic-fill fs-5"></i>
                        </div>
                      </div>
                      <h3 className="fw-bold text-navy mb-0">{sampleDashboardStats.upcomingSessions}</h3>
                      <span className="small text-muted">Keynotes & workshops</span>
                    </div>
                  </div>
                </div>

                {/* Recent Activities & Quick Schedule */}
                <div className="row g-4">
                  {/* Recent Activity */}
                  <div className="col-md-7">
                    <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
                      <h5 className="fw-bold text-navy mb-3">
                        <i className="bi bi-activity text-orange me-2"></i> Recent Platform Activity
                      </h5>
                      <div className="d-flex flex-column gap-3">
                        {sampleDashboardStats.recentActivities.map((act) => (
                          <div key={act.id} className="d-flex align-items-start gap-3 p-2 rounded-3 bg-light">
                            <div className="bg-white p-2 rounded-3 shadow-sm text-navy">
                              <i className={`bi ${act.icon}`}></i>
                            </div>
                            <div className="flex-grow-1">
                              <div className="fw-semibold text-navy small">{act.action}</div>
                              <div className="text-muted small">{act.detail}</div>
                            </div>
                            <span className="badge bg-light text-muted border small">{act.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Spotlight Expo */}
                  <div className="col-md-5">
                    <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
                      <h5 className="fw-bold text-navy mb-3">Upcoming Major Event</h5>
                      <div className="rounded-3 overflow-hidden mb-3">
                        <img
                          src={sampleExpos[0].image}
                          alt={sampleExpos[0].title}
                          className="img-fluid w-100"
                          style={{ height: '140px', objectFit: 'cover' }}
                        />
                      </div>
                      <h6 className="fw-bold text-navy mb-1">{sampleExpos[0].title}</h6>
                      <p className="text-muted small mb-2">{sampleExpos[0].date}</p>
                      <p className="text-secondary small mb-3">{sampleExpos[0].location}</p>
                      <Link to={`/expos/${sampleExpos[0].id}`} className="btn btn-outline-navy btn-sm w-100">
                        View Event Agenda
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'registrations' && (
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                <h5 className="fw-bold text-navy mb-3">My Event Passes</h5>
                <p className="text-muted small mb-4">
                  Passes and badges tied to your registered email account ({currentUser.email}).
                </p>

                <div className="card border rounded-3 p-3 mb-3 bg-light">
                  <div className="row align-items-center g-3">
                    <div className="col-md-8">
                      <span className="badge bg-success mb-2">Confirmed Registration</span>
                      <h6 className="fw-bold text-navy mb-1">Global Tech & AI Summit 2026</h6>
                      <div className="text-muted small">Nov 15-18, 2026 • Metropolitan Expo Center</div>
                      <div className="text-secondary small mt-1">Pass Type: Full Access Attendee Pass</div>
                    </div>
                    <div className="col-md-4 text-md-end">
                      <button
                        className="btn btn-navy btn-sm"
                        onClick={() => alert('Demo Entry QR Badge Generated: #PASS-78921')}
                      >
                        <i className="bi bi-qr-code me-1"></i> View Entry QR
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'booths' && (
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                <h5 className="fw-bold text-navy mb-3">Exhibition Booth Inquiries</h5>
                <p className="text-muted small mb-4">
                  Manage your reserved booth spaces and exhibition stall requests.
                </p>

                <div className="card border rounded-3 p-3 bg-light mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-bold text-navy">Booth A-101 (20x20 ft)</span>
                    <span className="badge bg-warning text-dark">Under Review</span>
                  </div>
                  <p className="text-muted small mb-2">
                    Hall A — Applied for Global Tech & AI Summit 2026
                  </p>
                  <div className="d-flex gap-2">
                    <Link to="/floor-plan" className="btn btn-outline-navy btn-sm">
                      Check Floor Layout
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                <h5 className="fw-bold text-navy mb-3">Account Profile Details</h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="text-muted small">Registered Full Name</label>
                    <div className="fw-bold text-navy">{currentUser.name}</div>
                  </div>
                  <div className="col-md-6">
                    <label className="text-muted small">Email Address</label>
                    <div className="fw-bold text-navy">{currentUser.email}</div>
                  </div>
                  <div className="col-md-6">
                    <label className="text-muted small">Assigned System Role</label>
                    <div>
                      <span className="badge bg-orange text-uppercase">{currentUser.role}</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="text-muted small">Authentication Status</label>
                    <div className="text-success small fw-semibold">
                      <i className="bi bi-shield-check me-1"></i> JWT Verified Session
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
