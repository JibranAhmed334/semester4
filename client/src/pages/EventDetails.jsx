import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { sampleExpos } from '../data/sampleData';

function EventDetails() {
  const { id } = useParams();
  const [registered, setRegistered] = useState(false);

  // Find expo by ID or default to the first one
  const event = sampleExpos.find((item) => item.id === id) || sampleExpos[0];

  const handleRegisterModal = () => {
    setRegistered(true);
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
            <span className="badge bg-orange text-white">{event.category}</span>
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
        {registered && (
          <div className="alert alert-success alert-dismissible fade show shadow-sm mb-4" role="alert">
            <i className="bi bi-check-circle-fill me-2 fs-5"></i>
            <strong>Demo Pass Confirmed!</strong> You have successfully registered your interest for {event.title}. Your mock confirmation ID is <strong>#ESP-{Math.floor(100000 + Math.random() * 900000)}</strong>.
            <button type="button" className="btn-close" onClick={() => setRegistered(false)}></button>
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

              <button
                onClick={handleRegisterModal}
                className="btn btn-orange text-white w-100 py-2 mb-2 shadow-sm"
              >
                <i className="bi bi-ticket-perforated me-1"></i> Register for Free Pass
              </button>

              <Link to="/floor-plan" className="btn btn-outline-navy w-100 py-2 mb-3">
                <i className="bi bi-shop me-1"></i> Book a Booth Space
              </Link>

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

