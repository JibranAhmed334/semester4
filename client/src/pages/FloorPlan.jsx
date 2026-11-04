import { useState } from 'react';
import { sampleBooths } from '../data/sampleData';

function FloorPlan() {
  const [selectedHall, setSelectedHall] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [activeBooth, setActiveBooth] = useState(sampleBooths[0] || null);
  const [reservationNotice, setReservationNotice] = useState('');

  const halls = ['All', 'Hall A', 'Hall B', 'Hall C'];
  const statuses = ['All', 'Available', 'Reserved', 'Booked'];

  const filteredBooths = sampleBooths.filter((booth) => {
    const matchesHall = selectedHall === 'All' || booth.hall === selectedHall;
    const matchesStatus = selectedStatus === 'All' || booth.status === selectedStatus;
    return matchesHall && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-success text-white';
      case 'Reserved':
        return 'bg-warning text-dark';
      case 'Booked':
        return 'bg-secondary text-white';
      default:
        return 'bg-light text-dark';
    }
  };

  const getStatusBorder = (status) => {
    switch (status) {
      case 'Available':
        return 'border-success';
      case 'Reserved':
        return 'border-warning';
      case 'Booked':
        return 'border-secondary opacity-75';
      default:
        return 'border-light';
    }
  };

  const handleSelectBooth = (booth) => {
    setActiveBooth(booth);
    setReservationNotice('');
  };

  const handleReserveAction = () => {
    if (activeBooth) {
      setReservationNotice(
        `Your inquiry for Booth ${activeBooth.id} (${activeBooth.size}, ${activeBooth.hall}) has been recorded! Our exhibition team will contact you.`
      );
    }
  };

  return (
    <div className="floor-plan-page py-5 bg-light min-vh-100">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-700 mx-auto mb-5">
          <span className="badge bg-orange text-white px-3 py-2 rounded-pill text-uppercase fw-semibold mb-2">
            Exhibition Layout
          </span>
          <h1 className="display-6 fw-bold text-navy mb-2">Interactive Booth Floor Plan</h1>
          <p className="text-muted">
            Select an exhibition hall, browse real-time booth availability, and inspect booth dimensions for your brand display.
          </p>
        </div>

        {/* Legend and Filters */}
        <div className="bg-white p-4 rounded-4 shadow-sm mb-4">
          <div className="row g-3 align-items-center justify-content-between">
            {/* Filters */}
            <div className="col-md-7">
              <div className="d-flex flex-wrap gap-2 align-items-center">
                <span className="small text-muted fw-semibold me-2">Hall:</span>
                {halls.map((hall) => (
                  <button
                    key={hall}
                    onClick={() => setSelectedHall(hall)}
                    className={`btn btn-sm ${
                      selectedHall === hall ? 'btn-navy' : 'btn-outline-secondary'
                    }`}
                  >
                    {hall}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Legend */}
            <div className="col-md-5">
              <div className="d-flex flex-wrap gap-3 justify-content-md-end small">
                <div className="d-flex align-items-center gap-1">
                  <span className="d-inline-block rounded-circle bg-success" style={{ width: '12px', height: '12px' }}></span>
                  <span className="text-secondary">Available</span>
                </div>
                <div className="d-flex align-items-center gap-1">
                  <span className="d-inline-block rounded-circle bg-warning" style={{ width: '12px', height: '12px' }}></span>
                  <span className="text-secondary">Reserved</span>
                </div>
                <div className="d-flex align-items-center gap-1">
                  <span className="d-inline-block rounded-circle bg-secondary" style={{ width: '12px', height: '12px' }}></span>
                  <span className="text-secondary">Booked</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notice Message */}
        {reservationNotice && (
          <div className="alert alert-info alert-dismissible fade show shadow-sm mb-4" role="alert">
            <i className="bi bi-info-circle-fill me-2"></i>
            {reservationNotice}
            <button type="button" className="btn-close" onClick={() => setReservationNotice('')}></button>
          </div>
        )}

        <div className="row g-4">
          {/* Booths Grid */}
          <div className="col-lg-8">
            <div className="bg-white p-4 rounded-4 shadow-sm">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold text-navy mb-0">
                  {selectedHall === 'All' ? 'All Exhibition Halls' : selectedHall}
                </h5>
                <span className="text-muted small">
                  Showing {filteredBooths.length} booths
                </span>
              </div>

              <div className="row g-3">
                {filteredBooths.map((booth) => {
                  const isSelected = activeBooth?.id === booth.id;
                  return (
                    <div key={booth.id} className="col-sm-6 col-md-4">
                      <div
                        onClick={() => handleSelectBooth(booth)}
                        className={`card h-100 p-3 booth-card border-2 ${getStatusBorder(booth.status)} ${
                          isSelected ? 'shadow border-primary' : 'shadow-sm'
                        }`}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="fw-bold text-navy mb-0">Booth {booth.id}</h6>
                          <span className={`badge ${getStatusBadge(booth.status)}`}>
                            {booth.status}
                          </span>
                        </div>
                        <p className="text-muted small mb-1">
                          <i className="bi bi-aspect-ratio me-1"></i> {booth.size}
                        </p>
                        <p className="text-secondary small mb-2">
                          <i className="bi bi-geo-alt me-1"></i> {booth.hall}
                        </p>
                        {booth.exhibitor && (
                          <div className="small text-truncate text-primary fw-semibold">
                            <i className="bi bi-building me-1"></i> {booth.exhibitor}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Active Booth Details Panel */}
          <div className="col-lg-4 align-self-start">
            {activeBooth ? (
              <div className="card border-0 shadow-sm rounded-4 p-4 floor-plan-details-card">
                <span className="badge bg-orange text-white text-uppercase px-2 py-1 mb-2 d-inline-block" style={{ width: 'fit-content' }}>
                  Booth Inspection
                </span>
                <h4 className="fw-bold text-navy mb-1">Booth #{activeBooth.id}</h4>
                <p className="text-muted small mb-3">
                  Located in <strong className="text-navy">{activeBooth.hall}</strong>
                </p>

                <div className="bg-light p-3 rounded-3 mb-3">
                  <div className="d-flex justify-content-between mb-2 small">
                    <span className="text-muted">Status:</span>
                    <span className={`badge ${getStatusBadge(activeBooth.status)}`}>
                      {activeBooth.status}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mb-2 small">
                    <span className="text-muted">Dimensions:</span>
                    <span className="fw-semibold text-navy">{activeBooth.size}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2 small">
                    <span className="text-muted">Base Rate:</span>
                    <span className="fw-semibold text-orange">${activeBooth.price?.toLocaleString()}</span>
                  </div>
                  {activeBooth.exhibitor && (
                    <div className="d-flex justify-content-between small">
                      <span className="text-muted">Occupied By:</span>
                      <span className="fw-semibold text-navy text-truncate" style={{ maxWidth: '140px' }}>
                        {activeBooth.exhibitor}
                      </span>
                    </div>
                  )}
                </div>

                {activeBooth.status === 'Available' ? (
                  <button
                    onClick={handleReserveAction}
                    className="btn btn-orange text-white w-100 py-2 mb-2"
                  >
                    <i className="bi bi-bookmark-plus me-1"></i> Reserve This Stall
                  </button>
                ) : (
                  <button disabled className="btn btn-secondary w-100 py-2 mb-2 opacity-50">
                    <i className="bi bi-lock-fill me-1"></i> Stall Not Available
                  </button>
                )}

                <p className="text-muted small mb-0 text-center">
                  Standard setup includes backdrop, spotlighting, and electrical outlet.
                </p>
              </div>
            ) : (
              <div className="card border-0 shadow-sm rounded-4 p-4 text-center text-muted">
                <i className="bi bi-hand-index-thumb fs-1 mb-2"></i>
                <p className="mb-0">Select any booth on the floor plan to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FloorPlan;
