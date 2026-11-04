import { Link } from 'react-router-dom';

function EventCard({ event }) {
  if (!event) return null;

  return (
    <div className="card h-100 shadow-sm border-0 event-card">
      <div className="position-relative">
        <img
          src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'}
          className="card-img-top"
          alt={event.title}
          style={{ height: '200px', objectFit: 'cover' }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800';
          }}
        />
        <span className="badge bg-navy position-absolute top-0 end-0 m-3 shadow-sm text-capitalize">
          {event.category || event.theme || 'General'}
        </span>
      </div>

      <div className="card-body d-flex flex-column">
        <div className="text-orange fw-semibold small mb-1 d-flex align-items-center gap-1">
          <i className="bi bi-calendar-event"></i>
          <span>{event.date || 'Upcoming 2026'}</span>
        </div>

        <h5 className="card-title fw-bold text-navy mb-2">
          {event.title}
        </h5>

        <p className="card-text text-muted small flex-grow-1">
          {event.description}
        </p>

        <div className="border-top pt-3 mt-2">
          <div className="d-flex align-items-center text-secondary small mb-3">
            <i className="bi bi-geo-alt me-1 text-danger"></i>
            <span className="text-truncate">{event.location || 'Metropolitan Convention Center'}</span>
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <span className="badge bg-light text-dark border">
              <i className="bi bi-shop me-1 text-primary"></i>
              {event.boothCount || 80} Booths
            </span>
            <Link to={`/expos/${event.id || event._id}`} className="btn btn-outline-navy btn-sm px-3">
              View Details <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
