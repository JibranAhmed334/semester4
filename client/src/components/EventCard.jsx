import { Link } from 'react-router-dom';

function EventCard({ event }) {
  if (!event) return null;

  return (
    <div className="card h-100 shadow-sm border-0 event-card">
      <div className="position-relative">
        <img
          src={event.image}
          className="card-img-top"
          alt={event.title}
          style={{ height: '200px', objectFit: 'cover' }}
        />
        <span className="badge bg-navy position-absolute top-0 end-0 m-3 shadow-sm">
          {event.category}
        </span>
      </div>

      <div className="card-body d-flex flex-column">
        <div className="text-orange fw-semibold small mb-1 d-flex align-items-center gap-1">
          <i className="bi bi-calendar-event"></i>
          <span>{event.date}</span>
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
            <span className="text-truncate">{event.location}</span>
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <span className="badge bg-light text-dark border">
              <i className="bi bi-shop me-1 text-primary"></i>
              {event.boothCount} Booths
            </span>
            <Link to={`/expos/${event.id}`} className="btn btn-outline-navy btn-sm px-3">
              View Details <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventCard;

