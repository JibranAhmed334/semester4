import { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <div className="contact-page bg-light min-vh-100 py-5">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-700 mx-auto mb-5">
          <span className="badge bg-orange text-white px-3 py-2 rounded-pill text-uppercase fw-semibold mb-2">
            Get In Touch
          </span>
          <h1 className="display-6 fw-bold text-navy mb-2">Contact EventSphere Desk</h1>
          <p className="text-muted">
            Have questions regarding trade show bookings, stall reservations, or conference attendance? Our team is here to assist.
          </p>
        </div>

        <div className="row g-4 mb-5">
          {/* Contact Details */}
          <div className="col-lg-5">
            <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-navy text-white">
              <h4 className="fw-bold text-white mb-4">Operations Headquarters</h4>

              <div className="d-flex flex-column gap-4">
                <div className="d-flex align-items-start gap-3">
                  <div className="bg-orange text-white p-3 rounded-3 fs-5 d-flex align-items-center justify-content-center">
                    <i className="bi bi-geo-alt-fill"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">Convention Center Campus</h6>
                    <p className="text-light text-opacity-75 small mb-0">
                      Convention Boulevard, Suite 400<br />
                      Expo Metropolis, EM 94016
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <div className="bg-orange text-white p-3 rounded-3 fs-5 d-flex align-items-center justify-content-center">
                    <i className="bi bi-telephone-fill"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">Telephone Support</h6>
                    <p className="text-light text-opacity-75 small mb-0">
                      General: +1 (800) 555-EXPO (3976)<br />
                      Exhibitors Hotline: +1 (800) 555-BOOTH
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <div className="bg-orange text-white p-3 rounded-3 fs-5 d-flex align-items-center justify-content-center">
                    <i className="bi bi-envelope-fill"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">Direct Correspondence</h6>
                    <p className="text-light text-opacity-75 small mb-0">
                      helpdesk@eventsphere.example.com<br />
                      partnerships@eventsphere.example.com
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <div className="bg-orange text-white p-3 rounded-3 fs-5 d-flex align-items-center justify-content-center">
                    <i className="bi bi-clock-fill"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">Working Hours</h6>
                    <p className="text-light text-opacity-75 small mb-0">
                      Monday to Friday: 08:30 AM – 06:00 PM EST<br />
                      During Live Expo: 24/7 Operations Room
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 h-100 bg-white">
              <h4 className="fw-bold text-navy mb-3">Send Us a Direct Message</h4>
              <p className="text-muted small mb-4">
                Fill out the form below and an exhibition coordinator will respond within 24 business hours.
              </p>

              {submitted ? (
                <div className="alert alert-success p-4 rounded-3 text-center my-auto">
                  <i className="bi bi-check-circle-fill text-success fs-1 mb-2 d-block"></i>
                  <h5 className="fw-bold">Message Received!</h5>
                  <p className="small mb-3">
                    Thank you, <strong>{formData.name}</strong>. Your message regarding &ldquo;{formData.subject || 'Exhibition Inquiry'}&rdquo; has been sent to our desk.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', subject: '', message: '' });
                    }}
                    className="btn btn-outline-success btn-sm"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-navy">Your Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="John Doe"
                        required
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-navy">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="johndoe@example.com"
                        required
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold text-navy">Subject</label>
                      <input
                        type="text"
                        name="subject"
                        className="form-control"
                        placeholder="Booth Booking Inquiry / Speaker Request"
                        value={formData.subject}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold text-navy">Message Details *</label>
                      <textarea
                        name="message"
                        rows="5"
                        className="form-control"
                        placeholder="Describe your requirements or questions in detail..."
                        required
                        value={formData.message}
                        onChange={handleChange}
                      ></textarea>
                    </div>

                    <div className="col-12 mt-4">
                      <button type="submit" className="btn btn-navy text-white px-4 py-2">
                        <i className="bi bi-send me-1"></i> Submit Message
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm">
          <h4 className="fw-bold text-navy mb-4 text-center">Frequently Asked Questions</h4>
          <div className="row g-4">
            <div className="col-md-6">
              <h6 className="fw-bold text-navy">How do I register as an Exhibitor?</h6>
              <p className="text-muted small">
                Sign up via the Registration page selecting the &ldquo;Exhibitor&rdquo; role. Once logged in, you can browse available stalls on the floor plan and request your booth.
              </p>
            </div>
            <div className="col-md-6">
              <h6 className="fw-bold text-navy">Are attendee passes free of charge?</h6>
              <p className="text-muted small">
                Standard visitor passes to the main exhibition hall are complimentary upon registration. Special workshops and VIP networking lounges may require premium badges.
              </p>
            </div>
            <div className="col-md-6">
              <h6 className="fw-bold text-navy">Can I modify my booth dimensions later?</h6>
              <p className="text-muted small">
                Yes, subject to hall availability. Contact the floor coordinator desk at least 14 days before the exhibition opening date.
              </p>
            </div>
            <div className="col-md-6">
              <h6 className="fw-bold text-navy">Where can I download my entry QR badge?</h6>
              <p className="text-muted small">
                Once signed in, visit your Member Dashboard to access your profile and digital registration badge.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;

