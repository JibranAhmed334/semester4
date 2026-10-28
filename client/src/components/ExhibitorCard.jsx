function ExhibitorCard({ exhibitor }) {
  if (!exhibitor) return null;

  return (
    <div className="card h-100 shadow-sm border-0 exhibitor-card">
      <div className="card-body d-flex flex-column">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center gap-3">
            <div className="exhibitor-icon-box bg-navy-light text-orange rounded-3 p-3 fs-3 d-flex align-items-center justify-content-center">
              <i className={`bi ${exhibitor.logo || 'bi-building'}`}></i>
            </div>
            <div>
              <h5 className="fw-bold text-navy mb-0">{exhibitor.name}</h5>
              <span className="badge bg-light text-navy border mt-1 small">
                {exhibitor.category}
              </span>
            </div>
          </div>
        </div>

        <p className="card-text text-muted small flex-grow-1">
          {exhibitor.description}
        </p>

        <div className="bg-light p-2 rounded-2 mb-3 d-flex justify-content-between align-items-center small">
          <div>
            <i className="bi bi-geo-fill text-orange me-1"></i>
            <span className="fw-semibold text-navy">{exhibitor.booth}</span>
          </div>
          <span className="badge bg-secondary">{exhibitor.hall}</span>
        </div>

        <div className="d-flex gap-2">
          <a
            href={exhibitor.website}
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline-navy btn-sm flex-fill"
          >
            <i className="bi bi-box-arrow-up-right me-1"></i> Website
          </a>
          <a
            href={`mailto:${exhibitor.email}`}
            className="btn btn-orange btn-sm text-white flex-fill"
          >
            <i className="bi bi-envelope me-1"></i> Contact
          </a>
        </div>
      </div>
    </div>
  );
}

export default ExhibitorCard;

