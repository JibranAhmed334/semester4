import { Link } from 'react-router-dom';

function About() {
  const leadershipTeam = [
    { name: 'Marcus Sterling', role: 'Executive Exhibition Director', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=60' },
    { name: 'Dr. Elena Rostova', role: 'Head of Industry Relations', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=60' },
    { name: 'Tariq Al-Mansoor', role: 'Logistics & Floor Operations', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60' },
    { name: 'Clara Oswald', role: 'Attendee Experience Lead', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=60' }
  ];

  return (
    <div className="about-page">
      {/* Banner */}
      <section className="bg-navy text-white py-5">
        <div className="container py-3 text-center">
          <span className="badge bg-orange text-white px-3 py-2 rounded-pill text-uppercase fw-semibold mb-2">
            About Our Organization
          </span>
          <h1 className="display-5 fw-bold text-white mb-3">Empowering Global Trade Shows</h1>
          <p className="lead text-light text-opacity-75 max-w-700 mx-auto">
            EventSphere was developed to transform traditional convention halls into digital, connected, and highly efficient trade hubs.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-5 bg-white">
        <div className="container py-3">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <span className="text-orange fw-bold text-uppercase small">Our Mission</span>
              <h2 className="fw-bold text-navy mb-3">Connecting Global Industry Pioneers</h2>
              <p className="text-muted">
                Trade shows and expos are the lifeblood of B2B commerce, scientific innovation, and cross-border partnerships. At EventSphere, our mission is to eliminate manual friction from booth reservations, event schedules, and attendee registrations.
              </p>
              <p className="text-muted">
                We believe every exhibitor deserves transparent booth visibility, and every attendee deserves a seamless, personalized itinerary.
              </p>
              <div className="row g-3 mt-2">
                <div className="col-sm-6">
                  <div className="p-3 bg-light rounded-3 border-start border-4 border-primary">
                    <h6 className="fw-bold text-navy mb-1">Our Vision</h6>
                    <p className="small text-muted mb-0">To become the unified standard operating platform for conventions worldwide.</p>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="p-3 bg-light rounded-3 border-start border-4 border-orange">
                    <h6 className="fw-bold text-navy mb-1">Our Values</h6>
                    <p className="small text-muted mb-0">Transparency, technological innovation, and exceptional customer experience.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <img
                src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=60"
                alt="Conference Hall"
                className="img-fluid rounded-4 shadow"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Target Audiences */}
      <section className="py-5 bg-light">
        <div className="container py-3">
          <div className="text-center max-w-700 mx-auto mb-5">
            <span className="text-orange fw-bold text-uppercase small">Tailored Capabilities</span>
            <h2 className="fw-bold text-navy">Built for Every Expo Stakeholder</h2>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm p-4">
                <div className="fs-1 text-orange mb-3">
                  <i className="bi bi-briefcase-fill"></i>
                </div>
                <h5 className="fw-bold text-navy mb-2">For Organizers</h5>
                <p className="text-muted small">
                  Publish expos, manage halls, supervise floor layout arrangements, and oversee speaker agendas in one integrated environment.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm p-4">
                <div className="fs-1 text-primary mb-3">
                  <i className="bi bi-shop-window"></i>
                </div>
                <h5 className="fw-bold text-navy mb-2">For Exhibitors</h5>
                <p className="text-muted small">
                  Showcase products, select prime booth placements across exhibition halls, and gain visibility with thousands of prospective buyers.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm p-4">
                <div className="fs-1 text-success mb-3">
                  <i className="bi bi-people-fill"></i>
                </div>
                <h5 className="fw-bold text-navy mb-2">For Attendees</h5>
                <p className="text-muted small">
                  Explore session tracks, book entry passes, locate your favorite exhibitor booths, and network with leading industry experts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-5 bg-white">
        <div className="container py-3">
          <div className="text-center max-w-700 mx-auto mb-5">
            <span className="text-orange fw-bold text-uppercase small">Our People</span>
            <h2 className="fw-bold text-navy">EventSphere Leadership Committee</h2>
            <p className="text-muted">Dedicated professionals with decades of combined convention operations experience.</p>
          </div>

          <div className="row g-4">
            {leadershipTeam.map((member, idx) => (
              <div className="col-6 col-md-3" key={idx}>
                <div className="card border-0 shadow-sm text-center h-100 overflow-hidden">
                  <img src={member.image} alt={member.name} className="card-img-top" style={{ height: '220px', objectFit: 'cover' }} />
                  <div className="card-body">
                    <h6 className="fw-bold text-navy mb-1">{member.name}</h6>
                    <p className="small text-muted mb-0">{member.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-5 bg-navy-light text-white text-center">
        <div className="container py-3">
          <h3 className="fw-bold text-white mb-2">Have Questions About Hosting an Expo?</h3>
          <p className="text-secondary mb-4">Our operations desk is available to assist you with floor plans and logistics.</p>
          <Link to="/contact" className="btn btn-orange text-white px-4">
            Get In Touch With Us
          </Link>
        </div>
      </section>
    </div>
  );
}

export default About;

