import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { sampleExpos } from '../data/sampleData';
import { mapExpoRecord } from '../data/expoHelpers';
import { subscribeToLiveUpdates } from '../utils/realtime';

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState(null);
  const [registered, setRegistered] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registrationNotice, setRegistrationNotice] = useState(null);
  const [passDetails, setPassDetails] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState('');
  const [applicationLoading, setApplicationLoading] = useState(false);
  const [applicationError, setApplicationError] = useState('');
  const [applicationDocuments, setApplicationDocuments] = useState('');
  const [expoRefreshVersion, setExpoRefreshVersion] = useState(0);
  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  })();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  useEffect(() => {
    const sample = sampleExpos.find((item) => item.id === id);
    if (sample) {
      setEventData(sample);
      return;
    }

    axios
      .get(`${API_URL}/expos/${id}`)
      .then((res) => {
        const item = res.data?.expo;
        if (item) {
          setEventData({
            ...mapExpoRecord(item),
            expectedAttendees: 'To be announced',
            highlights: [
              'Industry talks and networking opportunities',
              'Exhibitor booths and product demonstrations',
              'Meet organizers and participating businesses'
            ]
          });
        } else {
          setEventData(sampleExpos[0]);
        }
      })
      .catch(() => {
        setEventData(sampleExpos[0]);
      });
  }, [id, API_URL, expoRefreshVersion]);

  useEffect(() => subscribeToLiveUpdates(API_URL, (update) => {
    if (update.resource === 'expo' && update.expoId === id) {
      if (update.action === 'deleted') {
        navigate('/expos');
      } else {
        setExpoRefreshVersion((version) => version + 1);
      }
    }
  }), [id, API_URL, navigate]);

  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      withCredentials: true
    };
  };

  useEffect(() => {
    if (currentUser) {
      axios
        .get(`${API_URL}/registrations/my`, getAuthConfig())
        .then((res) => {
          const list = res.data?.registrations || [];
          const matched = list.find((r) => String(r.expo?._id || r.expo) === id);
          if (matched) {
            setRegistered(true);
            setPassDetails(matched);
          }
        })
        .catch(() => {});
    }
  }, [id, currentUser, API_URL]);

  const event = eventData || sampleExpos[0];

  const handleAttendeeRegistration = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const expoId = eventData?._id || id;
    if (!expoId || !/^[a-f\d]{24}$/i.test(expoId)) {
      setRegistrationNotice({ type: 'warning', text: 'Passes are available for published expo events.' });
      return;
    }

    setRegisterLoading(true);
    setRegistrationNotice(null);
    try {
      const response = await axios.post(
        `${API_URL}/registrations`,
        { expoId },
        getAuthConfig()
      );
      setRegistered(true);
      setPassDetails(response.data?.registration);
      setRegistrationNotice({
        type: 'success',
        text: response.data?.message || 'Pass confirmed! You are registered for this expo.'
      });
    } catch (err) {
      setRegistrationNotice({
        type: 'danger',
        text: err.response?.data?.message || 'Could not complete registration.'
      });
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleExpoApplication = async () => {
    const expoId = eventData?._id || eventData?.id;
    if (!expoId || !/^[a-f\d]{24}$/i.test(expoId)) {
      setApplicationError('Applications are available for published expos only.');
      return;
    }

    setApplicationLoading(true);
    setApplicationError('');
    try {
      const token = localStorage.getItem('token');
      const documents = applicationDocuments.split(/\r?\n/).map((url) => url.trim()).filter(Boolean).map((url, index) => ({
        name: `Supporting document ${index + 1}`,
        url
      }));
      const response = await axios.post(`${API_URL}/exhibitors/applications`, { expoId, documents }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true
      });
      setApplicationStatus(response.data?.application?.status || 'pending');
    } catch (error) {
      const message = error.response?.data?.message || 'Your application could not be submitted.';
      if (message.includes('Complete your company profile')) {
        setApplicationError(`${message} Open your dashboard to add company details.`);
      } else {
        setApplicationError(message);
      }
    } finally {
      setApplicationLoading(false);
    }
  };

  return (
    <div className="event-details-page bg-light min-vh-100 pb-5">
      {/* Top Banner */}
      <section className="bg-navy text-white py-5">
        <div className="container">
          <Link to="/expos" className="btn btn-outline-light btn-sm mb-3">
            <i className="bi bi-arrow-left me-1"></i> Back to Expos
          </Link>
          <div className="d-flex flex-wrap gap-2 mb-2">
            <span className="badge bg-orange text-white text-capitalize">{event.category}</span>
            <span className="badge bg-light text-navy">{event.city}</span>
          </div>
          <h1 className="display-6 fw-bold text-white mb-2">{event.title}</h1>
          <p className="lead text-light text-opacity-75 mb-0">
            <i className="bi bi-calendar-check me-2 text-orange"></i>
            {event.date} • <i className="bi bi-geo-alt me-1 text-danger"></i> {event.location}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container py-4">
        {registrationNotice && (
          <div className={`alert alert-${registrationNotice.type} alert-dismissible fade show shadow-sm mb-4`} role="alert">
            <i className={`bi ${registrationNotice.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2 fs-5`}></i>
            <strong>{registrationNotice.text}</strong>
            {passDetails && (
              <span className="ms-2">
                Your Badge ID is <strong>#ESP-{passDetails._id?.slice(-6).toUpperCase()}</strong>.
              </span>
            )}
            <button type="button" className="btn-close" onClick={() => setRegistrationNotice(null)}></button>
          </div>
        )}

        <div className="row g-4">
          {/* Left Column: Details & Highlights */}
          <div className="col-lg-8">
            {/* Event Image */}
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
              <img
                src={event.image}
                alt={event.title}
                className="img-fluid w-100"
                style={{ maxHeight: '380px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800';
                }}
              />
            </div>

            {/* Description */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
              <h4 className="fw-bold text-navy mb-3">About This Expo</h4>
              <p className="text-secondary leading-relaxed">
                {event.description}
              </p>
              <p className="text-secondary leading-relaxed mb-0">
                This multi-day trade exhibition unites global brands, certified suppliers, early-stage innovators, and enterprise buyers under one roof. Attendees gain direct access to interactive demo stages, B2B matchmaking lounges, and high-impact keynote sessions.
              </p>
            </div>

            {/* Event Highlights */}
            {event.highlights && (
              <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
                <h4 className="fw-bold text-navy mb-3">Event Highlights</h4>
                <div className="row g-3">
                  {event.highlights.map((highlight, index) => (
                    <div className="col-sm-6" key={index}>
                      <div className="d-flex align-items-start gap-2 p-2 bg-light rounded-3">
                        <i className="bi bi-check-circle-fill text-orange mt-1"></i>
                        <span className="small text-secondary fw-medium">{highlight}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Venue & Location Information */}
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h4 className="fw-bold text-navy mb-3">Venue & Logistics</h4>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="p-3 bg-light rounded-3">
                    <h6 className="fw-bold text-navy mb-1">
                      <i className="bi bi-building me-1 text-primary"></i> Venue Address
                    </h6>
                    <p className="text-muted small mb-0">{event.location}, {event.city}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 bg-light rounded-3">
                    <h6 className="fw-bold text-navy mb-1">
                      <i className="bi bi-person-badge me-1 text-orange"></i> Official Host
                    </h6>
                    <p className="text-muted small mb-0">{event.organizer}</p>
                  </div>
                </div>
              </div>

              <div className="mt-3 d-flex flex-wrap gap-2">
                <Link to="/floor-plan" className="btn btn-outline-navy btn-sm">
                  <i className="bi bi-grid-3x3-gap me-1"></i> View Interactive Floor Plan
                </Link>
                <Link to="/schedule" className="btn btn-outline-secondary btn-sm">
                  <i className="bi bi-calendar3 me-1"></i> View Detailed Schedule
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Registration Card */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: '80px' }}>
              <h5 className="fw-bold text-navy mb-3">Expo Participation</h5>

              <div className="bg-light p-3 rounded-3 mb-3">
                <div className="d-flex justify-content-between small text-muted mb-2">
                  <span>General Attendee Pass</span>
                  <span className="fw-bold text-success">Complimentary</span>
                </div>
                <div className="d-flex justify-content-between small text-muted mb-2">
                  <span>Expected Attendees</span>
                  <span className="fw-semibold text-navy">{event.expectedAttendees}</span>
                </div>
                <div className="d-flex justify-content-between small text-muted">
                  <span>Exhibition Booths</span>
                  <span className="fw-semibold text-navy">{event.boothCount} Stalls</span>
                </div>
              </div>

              {registered ? (
                <div className="alert alert-success small py-2 mb-2 text-center shadow-sm">
                  <i className="bi bi-patch-check-fill text-success me-1"></i> Pass Confirmed (#ESP-{passDetails?._id?.slice(-6).toUpperCase() || 'REGISTERED'})
                </div>
              ) : (
                <button
                  onClick={handleAttendeeRegistration}
                  disabled={registerLoading}
                  className="btn btn-orange text-white w-100 py-2 mb-2 shadow-sm"
                >
                  {registerLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                      Confirming Pass...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-ticket-perforated me-1"></i> Register for Free Pass
                    </>
                  )}
                </button>
              )}

              <Link to="/floor-plan" className="btn btn-outline-navy w-100 py-2 mb-3">
                <i className="bi bi-shop me-1"></i> Book a Booth Space
              </Link>

              {currentUser?.role === 'exhibitor' && (
                <div className="mb-3">
                  {applicationError && <div className="alert alert-danger small py-2" role="alert">{applicationError}</div>}
                  {applicationStatus ? (
                    <div className="alert alert-success small py-2 mb-0" role="status">
                      Application submitted. Current status: <strong>{applicationStatus}</strong>
                    </div>
                  ) : (
                    <>
                      <label className="form-label small fw-semibold" htmlFor="exhibitor-documents">
                        Supporting document links (one URL per line)
                      </label>
                      <textarea
                        id="exhibitor-documents"
                        className="form-control mb-2"
                        rows="3"
                        placeholder="https://example.com/company-profile.pdf"
                        value={applicationDocuments}
                        onChange={(event) => setApplicationDocuments(event.target.value)}
                      />
                      <button
                        onClick={handleExpoApplication}
                        disabled={applicationLoading}
                        className="btn btn-navy text-white w-100 py-2"
                      >
                        {applicationLoading ? 'Submitting...' : 'Apply as an Exhibitor'}
                      </button>
                    </>
                  )}
                  {!applicationStatus && (
                    <Link to="/dashboard" className="small d-block text-center mt-2">Manage company profile</Link>
                  )}
                </div>
              )}

              <div className="border-top pt-3 text-muted small">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <i className="bi bi-shield-check text-success"></i>
                  <span>Instant digital badge generation</span>
                </div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <i className="bi bi-wifi text-primary"></i>
                  <span>Free high-speed expo WiFi included</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-headset text-orange"></i>
                  <span>On-site concierge & info desk</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
