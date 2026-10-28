import { useState } from 'react';
import { sampleBooths } from '../data/sampleData';

function FloorPlan() {
  const [selectedHall, setSelectedHall] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [activeBooth, setActiveBooth] = useState(null);
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
      setReservationNotice(`Your inquiry for Booth ${activeBooth.id} (${activeBooth.size}) has been recorded! Our exhibition team will contact you.`);
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
          {/* Booth Grid */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
                <h5 className="fw-bold text-navy mb-0">
                  <i className="bi bi-grid-3x3-gap-fill text-orange me-2"></i>
                  Floor Grid ({selectedHall})
                </h5>
                <span className="small text-muted">Click any booth to view specs</span>
              </div>

              {/* Grid of booths */}
              <div className="row g-3">
                {filteredBooths.map((booth) => {
                  const isSelected = activeBooth && activeBooth.id === booth.id;
                  return (
                    <div className="col-sm-6 col-md-4" key={booth.id}>
                      <div
                        onClick={() => handleSelectBooth(booth)}
                        className={`p-3 rounded-3 border-2 border ${getStatusBorder(booth.status)} ${
                          isSelected ? 'shadow bg-light ring' : 'bg-white'
                        } cursor-pointer transition h-100 text-center`}
                        style={{ cursor: 'pointer', outline: isSelected ? '2px solid #0f223d' : 'none' }}
                      >
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="fw-bold text-navy fs-5">{booth.id}</span>
                          <span className={`badge ${getStatusBadge(booth.status)}`}>
                            {booth.status}
                          </span>
                        </div>
                        <div className="text-muted small mb-1">{booth.size}</div>
                        <div className="fw-semibold text-orange small">{booth.price}</div>
                        {booth.exhibitor && (
                          <div className="text-truncate text-secondary small mt-2 border-top pt-1">
                            {booth.exhibitor}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredBooths.length === 0 && (
                <div className="text-center py-5 text-muted">
                  No booths match the selected criteria.
                </div>
              )}
            </div>
          </div>

          {/* Booth Details Sidebar */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: '80px' }}>
              <h5 className="fw-bold text-navy mb-3">Booth Specifications</h5>

              {activeBooth ? (
                <div>
                  <div className="d-flex justify-content-between align-items-center bg-light p-3 rounded-3 mb-3">
                    <div>
                      <span className="text-muted small">Booth Number</span>
                      <h4 className="fw-bold text-navy mb-0">{activeBooth.id}</h4>
                    </div>
                    <span className={`badge ${getStatusBadge(activeBooth.status)} p-2`}>
                      {activeBooth.status}
                    </span>
                  </div>

                  <table className="table table-sm table-borderless small mb-4">
                    <tbody>
                      <tr>
                        <td className="text-muted">Exhibition Hall:</td>
                        <td className="fw-semibold text-navy text-end">{activeBooth.hall}</td>
                      </tr>
                      <tr>
                        <td className="text-muted">Stall Dimensions:</td>
                        <td className="fw-semibold text-navy text-end">{activeBooth.size}</td>
                      </tr>
                      <tr>
                        <td className="text-muted">Standard Rate:</td>
                        <td className="fw-bold text-orange text-end">{activeBooth.price}</td>
                      </tr>
                      <tr>
                        <td className="text-muted">Sector / Category:</td>
                        <td className="fw-semibold text-navy text-end">{activeBooth.category}</td>
                      </tr>
                      <tr>
                        <td className="text-muted">Current Occupant:</td>
                        <td className="fw-semibold text-navy text-end">
                          {activeBooth.exhibitor || 'Vacant / Unallocated'}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {activeBooth.status === 'Available' ? (
                    <button
                      onClick={handleReserveAction}
                      className="btn btn-orange text-white w-100 py-2 shadow-sm"
                    >
                      <i className="bi bi-bookmark-check me-1"></i> Request This Stall
                    </button>
                  ) : (
                    <button className="btn btn-secondary w-100 py-2" disabled>
                      {activeBooth.status === 'Booked' ? 'Stall Occupied' : 'Pending Reservation'}
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-5 text-muted">
                  <i className="bi bi-hand-index fs-1 text-orange mb-2 d-block"></i>
                  <p className="small mb-0">
                    Click on any booth in the layout grid to inspect its dimensions, pricing, and availability.
                  </p>
                </div>
              )}

              <div className="border-top pt-3 mt-4 small text-muted">
                <p className="fw-semibold text-navy mb-1">Standard Booth Inclusions:</p>
                <ul className="ps-3 mb-0">
                  <li>2x standard 220V electric sockets</li>
                  <li>Front counter with 2 folding chairs</li>
                  <li>Company fascia board signage</li>
                  <li>Daily waste removal & security</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FloorPlan;

