import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function FloorPlan() {
  const [expos, setExpos] = useState([]);
  const [selectedExpoId, setSelectedExpoId] = useState('');
  const [booths, setBooths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHall, setSelectedHall] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [activeBooth, setActiveBooth] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  // Reservation modal state for Exhibitors
  const [reserveModalOpen, setReserveModalOpen] = useState(false);
  const [reservationForm, setReservationForm] = useState({
    showcaseDetails: '',
    staffInfo: ''
  });
  const [isReserving, setIsReserving] = useState(false);

  // Admin status update state
  const [adminStatus, setAdminStatus] = useState('');
  const [isAdminUpdating, setIsAdminUpdating] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  })();

  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      withCredentials: true
    };
  };

  // 1. Fetch Expos list to populate the Expo selector
  useEffect(() => {
    let cancelled = false;

    const fetchExpos = async () => {
      try {
        const response = await axios.get(`${API_URL}/expos`);
        const list = response.data?.expos || response.data?.products || [];
        if (!cancelled && Array.isArray(list) && list.length > 0) {
          setExpos(list);
          setSelectedExpoId(list[0]._id);
        }
      } catch (err) {
        console.log('Notice: Could not load expos for floor plan:', err.message);
      }
    };

    fetchExpos();
    return () => {
      cancelled = true;
    };
  }, [API_URL]);

  // 2. Fetch Booths whenever selectedExpoId changes
  useEffect(() => {
    let cancelled = false;

    const fetchBooths = async () => {
      setLoading(true);
      try {
        const url = selectedExpoId
          ? `${API_URL}/booths?expo=${selectedExpoId}`
          : `${API_URL}/booths`;
        const response = await axios.get(url);
        const list = response.data?.booths || [];

        if (!cancelled) {
          setBooths(list);
          if (list.length > 0) {
            setActiveBooth((prev) => {
              if (prev) {
                const updatedActive = list.find((b) => b._id === prev._id);
                if (updatedActive) return updatedActive;
              }
              return list[0];
            });
          } else {
            setActiveBooth(null);
          }
        }
      } catch (err) {
        if (!cancelled) {
          console.log('Notice: Could not load booths from API:', err.message);
          setBooths([]);
          setActiveBooth(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchBooths();
    return () => {
      cancelled = true;
    };
  }, [selectedExpoId, API_URL]);

  // Filter booths by Hall and Status
  const filteredBooths = useMemo(() => {
    return booths.filter((booth) => {
      const matchesHall = selectedHall === 'All' || booth.hall === selectedHall;
      const matchesStatus =
        selectedStatus === 'All' ||
        (booth.status && booth.status.toLowerCase() === selectedStatus.toLowerCase());
      return matchesHall && matchesStatus;
    });
  }, [booths, selectedHall, selectedStatus]);

  // Dynamic available halls from fetched booths
  const availableHalls = useMemo(() => {
    const set = new Set(booths.map((b) => b.hall).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [booths]);

  // Counters
  const availableCount = booths.filter((b) => b.status === 'available').length;
  const reservedCount = booths.filter((b) => b.status === 'reserved').length;
  const occupiedCount = booths.filter((b) => b.status === 'occupied').length;

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'available':
        return 'badge-available';
      case 'reserved':
        return 'badge-reserved';
      case 'occupied':
        return 'badge-occupied';
      default:
        return 'bg-secondary text-white';
    }
  };

  const getBorderClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'available':
        return 'border-success';
      case 'reserved':
        return 'border-warning';
      case 'occupied':
        return 'border-navy';
      default:
        return 'border-secondary';
    }
  };

  const handleSelectBooth = (booth) => {
    setActiveBooth(booth);
    setAdminStatus(booth.status);
    setStatusMessage(null);
  };

  // Open reservation modal for Exhibitor
  const handleOpenReserveModal = () => {
    if (!activeBooth) return;
    setReservationForm({
      showcaseDetails: activeBooth.showcaseDetails || '',
      staffInfo: activeBooth.staffInfo || ''
    });
    setReserveModalOpen(true);
  };

  // Submit booth reservation
  const handleSubmitReservation = async (e) => {
    e.preventDefault();
    if (!activeBooth) return;

    setIsReserving(true);
    setStatusMessage(null);

    try {
      const response = await axios.post(
        `${API_URL}/booths/${activeBooth._id}/reserve`,
        reservationForm,
        getAuthConfig()
      );

      setStatusMessage({
        type: 'success',
        text: response.data.message || `Booth ${activeBooth.boothNumber} successfully reserved!`
      });

      // Update booth in state
      const updatedBooth = response.data.booth;
      setBooths((prev) => prev.map((b) => (b._id === updatedBooth._id ? updatedBooth : b)));
      setActiveBooth(updatedBooth);
      setReserveModalOpen(false);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || 'Unable to complete reservation. Please try again.';
      setStatusMessage({ type: 'danger', text: errorMsg });
    } finally {
      setIsReserving(false);
    }
  };

  // Admin / Organizer quick status update
  const handleAdminStatusChange = async (newStatus) => {
    if (!activeBooth) return;

    setIsAdminUpdating(true);
    setStatusMessage(null);

    try {
      const response = await axios.put(
        `${API_URL}/booths/${activeBooth._id}`,
        { status: newStatus },
        getAuthConfig()
      );

      setStatusMessage({
        type: 'success',
        text: response.data.message || `Booth status updated to ${newStatus}.`
      });

      const updated = response.data.booth;
      setBooths((prev) => prev.map((b) => (b._id === updated._id ? updated : b)));
      setActiveBooth(updated);
      setAdminStatus(updated.status);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update booth status.';
      setStatusMessage({ type: 'danger', text: errorMsg });
    } finally {
      setIsAdminUpdating(false);
    }
  };

  const isExhibitor = currentUser?.role === 'exhibitor';
  const isStaff = currentUser?.role === 'admin' || currentUser?.role === 'organizer';
  const isAttendee = currentUser?.role === 'attendee';

  return (
    <div className="floor-plan-page py-5 bg-light min-vh-100">
      <div className="container">
        {/* Page Header */}
        <div className="text-center max-w-700 mx-auto mb-4">
          <span className="badge bg-orange text-white px-3 py-2 rounded-pill text-uppercase fw-semibold mb-2">
            Exhibition Layout & Allocation
          </span>
          <h1 className="display-6 fw-bold text-navy mb-2">Interactive Booth Floor Plan</h1>
          <p className="text-muted small">
            Explore exhibition halls, inspect real-time stall dimensions and occupancy, and reserve booth spaces directly from the interactive plan.
          </p>

          {/* Expo Selector */}
          {expos.length > 0 && (
            <div className="d-flex align-items-center justify-content-center gap-2 mt-3">
              <label htmlFor="expoSelect" className="small fw-semibold text-navy">
                <i className="bi bi-calendar-event me-1 text-orange"></i> Select Expo:
              </label>
              <select
                id="expoSelect"
                className="form-select form-select-sm w-auto shadow-sm"
                value={selectedExpoId}
                onChange={(e) => setSelectedExpoId(e.target.value)}
              >
                {expos.map((expo) => (
                  <option key={expo._id} value={expo._id}>
                    {expo.title} ({expo.location || 'Convention Center'})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Status Message Alert */}
        {statusMessage && (
          <div
            className={`alert alert-${statusMessage.type} alert-dismissible fade show small d-flex align-items-center gap-2 shadow-sm mb-4`}
            role="alert"
          >
            <i
              className={`bi ${
                statusMessage.type === 'success'
                  ? 'bi-check-circle-fill text-success'
                  : 'bi-exclamation-triangle-fill text-danger'
              } fs-6 flex-shrink-0`}
            ></i>
            <div className="flex-grow-1">{statusMessage.text}</div>
            <button
              type="button"
              className="btn-close ms-auto"
              onClick={() => setStatusMessage(null)}
            ></button>
          </div>
        )}

        {/* Legend and Filter Controls */}
        <div className="bg-white p-3 p-md-4 rounded-4 shadow-sm mb-4 border">
          <div className="row g-3 align-items-center justify-content-between">
            {/* Hall Filter Pills */}
            <div className="col-lg-6">
              <div className="d-flex flex-wrap gap-2 align-items-center">
                <span className="small text-navy fw-bold me-1">Sector / Hall:</span>
                {availableHalls.map((hall) => (
                  <button
                    key={hall}
                    onClick={() => setSelectedHall(hall)}
                    className={`btn btn-sm ${
                      selectedHall === hall ? 'btn-navy text-white' : 'btn-outline-secondary'
                    }`}
                  >
                    {hall}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Legend & Quick Filters */}
            <div className="col-lg-6">
              <div className="d-flex flex-wrap gap-2 justify-content-lg-end align-items-center small">
                <span className="text-muted fw-semibold me-1">Filter Status:</span>
                <button
                  onClick={() => setSelectedStatus('All')}
                  className={`btn btn-sm ${
                    selectedStatus === 'All' ? 'btn-dark' : 'btn-outline-secondary'
                  }`}
                >
                  All ({booths.length})
                </button>
                <button
                  onClick={() => setSelectedStatus('available')}
                  className={`btn btn-sm ${
                    selectedStatus === 'available' ? 'btn-success text-white' : 'btn-outline-success'
                  }`}
                >
                  <span className="d-inline-block rounded-circle bg-success me-1" style={{ width: '8px', height: '8px' }}></span>
                  Available ({availableCount})
                </button>
                <button
                  onClick={() => setSelectedStatus('reserved')}
                  className={`btn btn-sm ${
                    selectedStatus === 'reserved' ? 'btn-warning text-dark' : 'btn-outline-warning'
                  }`}
                >
                  <span className="d-inline-block rounded-circle bg-warning me-1" style={{ width: '8px', height: '8px' }}></span>
                  Reserved ({reservedCount})
                </button>
                <button
                  onClick={() => setSelectedStatus('occupied')}
                  className={`btn btn-sm ${
                    selectedStatus === 'occupied' ? 'btn-navy text-white' : 'btn-outline-navy'
                  }`}
                >
                  <span className="d-inline-block rounded-circle bg-navy me-1" style={{ width: '8px', height: '8px' }}></span>
                  Occupied ({occupiedCount})
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Floor Map Layout Area */}
        <div className="row g-4">
          {/* Main Floor Plan Grid */}
          <div className="col-lg-8">
            <div className="bg-white p-4 rounded-4 shadow-sm border">
              {/* Wayfinding Top: Main Entrance */}
              <div className="wayfinding-banner mb-4">
                ▲ NORTH MAIN ENTRANCE & ATTENDEE REGISTRATION FOYER ▲
              </div>

              {/* Stage / Presentation Area Banner */}
              <div className="p-3 bg-light rounded-3 border-start border-4 border-orange mb-4 d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="fw-bold text-navy mb-0">
                    <i className="bi bi-broadcast me-2 text-orange"></i> Main Keynote & Presentation Stage
                  </h6>
                  <span className="text-muted small">Central Aisle & Live Demonstration Zone</span>
                </div>
                <span className="badge bg-navy text-white small">Sector A-C Concourse</span>
              </div>

              {/* Booths Grid */}
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-orange" role="status"></div>
                  <p className="text-muted small mt-2">Loading interactive booth grid...</p>
                </div>
              ) : filteredBooths.length > 0 ? (
                <div className="row g-3">
                  {filteredBooths.map((booth) => {
                    const isSelected = activeBooth?._id === booth._id;
                    const statusStr = (booth.status || 'available').toLowerCase();

                    return (
                      <div key={booth._id} className="col-sm-6 col-md-4">
                        <div
                          onClick={() => handleSelectBooth(booth)}
                          className={`card h-100 p-3 booth-cell-card ${getBorderClass(
                            booth.status
                          )} ${isSelected ? 'booth-cell-selected shadow' : 'shadow-sm'}`}
                        >
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <span className="fw-bold text-navy fs-6">
                              Booth #{booth.boothNumber}
                            </span>
                            <span className={`badge ${getStatusBadgeClass(booth.status)} small text-uppercase`}>
                              {booth.status}
                            </span>
                          </div>

                          <div className="d-flex align-items-center justify-content-between text-muted small mb-2">
                            <span>
                              <i className="bi bi-aspect-ratio me-1 text-secondary"></i>
                              {booth.size || '10x10 ft'}
                            </span>
                            <span className="fw-bold text-orange">
                              ${Number(booth.price || 1200).toLocaleString()}
                            </span>
                          </div>

                          <div className="text-secondary small mb-2">
                            <i className="bi bi-geo-alt me-1 text-danger"></i>
                            {booth.hall || 'Hall A'} • {booth.location}
                          </div>

                          {/* Exhibitor Info on card if occupied or reserved */}
                          {booth.exhibitor ? (
                            <div className="mt-auto pt-2 border-top small text-truncate text-navy fw-semibold">
                              <i className="bi bi-building me-1 text-orange"></i>
                              {booth.exhibitor.companyName || 'Registered Exhibitor'}
                            </div>
                          ) : (
                            <div className="mt-auto pt-2 border-top small text-success fw-medium">
                              <i className="bi bi-check-circle me-1"></i> Open for Reservation
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-5 bg-light rounded-3">
                  <i className="bi bi-grid-3x3-gap fs-1 text-muted mb-2 d-block"></i>
                  <h6 className="fw-bold text-navy">No Booths Match Your Filter</h6>
                  <p className="text-muted small mb-0">Try changing your hall or status selection.</p>
                </div>
              )}

              {/* Wayfinding Bottom: Loading Bay */}
              <div className="wayfinding-banner mt-4">
                ▼ SOUTH FREIGHT DOCK & EXHIBITOR LOADING BAYS ▼
              </div>
            </div>
          </div>

          {/* Active Booth Inspector Panel */}
          <div className="col-lg-4 align-self-start">
            {activeBooth ? (
              <div className="card border-0 shadow-sm rounded-4 p-4 floor-plan-details-card bg-white border">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <span className="badge bg-orange text-white text-uppercase px-2 py-1">
                    Booth Inspection
                  </span>
                  <span className={`badge ${getStatusBadgeClass(activeBooth.status)} text-uppercase`}>
                    {activeBooth.status}
                  </span>
                </div>

                <h3 className="fw-bold text-navy mb-1">Booth #{activeBooth.boothNumber}</h3>
                <p className="text-muted small mb-3">
                  Sector: <strong className="text-navy">{activeBooth.hall || 'Hall A'}</strong> • {activeBooth.location}
                </p>

                {/* Technical Specifications Matrix */}
                <div className="bg-light p-3 rounded-3 mb-3 border">
                  <div className="d-flex justify-content-between mb-2 small">
                    <span className="text-muted">Footprint Dimensions:</span>
                    <span className="fw-bold text-navy">{activeBooth.size || '10x10 ft'}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2 small">
                    <span className="text-muted">Exhibition Tariff:</span>
                    <span className="fw-bold text-orange fs-6">
                      ${Number(activeBooth.price || 1200).toLocaleString()}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mb-2 small">
                    <span className="text-muted">Expo:</span>
                    <span className="fw-semibold text-navy text-truncate" style={{ maxWidth: '170px' }}>
                      {activeBooth.expo?.title || 'Selected Expo'}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between small">
                    <span className="text-muted">Utilities:</span>
                    <span className="text-success fw-medium">
                      <i className="bi bi-lightning-charge me-1"></i>220V Drop + WiFi Included
                    </span>
                  </div>
                </div>

                {/* Exhibitor Details if Occupied or Reserved */}
                {activeBooth.exhibitor && (
                  <div className="p-3 border rounded-3 bg-white mb-3 shadow-sm">
                    <div className="small text-muted text-uppercase fw-bold mb-1" style={{ fontSize: '11px' }}>
                      Contracted Exhibitor
                    </div>
                    <h6 className="fw-bold text-navy mb-1">
                      <i className="bi bi-building me-1 text-orange"></i>
                      {activeBooth.exhibitor.companyName}
                    </h6>
                    {activeBooth.exhibitor.contactEmail && (
                      <p className="small text-muted mb-1 text-truncate">
                        <i className="bi bi-envelope me-1"></i>
                        {activeBooth.exhibitor.contactEmail}
                      </p>
                    )}
                    {activeBooth.showcaseDetails && (
                      <div className="small bg-light p-2 rounded mt-2 text-secondary">
                        <strong>Showcase:</strong> {activeBooth.showcaseDetails}
                      </div>
                    )}
                    {activeBooth.staffInfo && (
                      <div className="small text-muted mt-1">
                        <strong>Staff On-Site:</strong> {activeBooth.staffInfo}
                      </div>
                    )}
                  </div>
                )}

                {/* Actions depending on User Role & Booth Status */}
                <div className="mt-2">
                  {/* Scenario 1: Booth is AVAILABLE */}
                  {activeBooth.status === 'available' && (
                    <>
                      {isExhibitor ? (
                        <button
                          onClick={handleOpenReserveModal}
                          className="btn btn-orange text-white w-100 py-2 shadow-sm"
                        >
                          <i className="bi bi-bookmark-plus me-1"></i> Reserve This Stall
                        </button>
                      ) : isAttendee ? (
                        <div className="alert alert-secondary small mb-0 py-2" role="alert">
                          <i className="bi bi-info-circle me-1"></i>
                          This stall is available for booking. (Attendee accounts cannot reserve stalls; switch to an Exhibitor account to reserve).
                        </div>
                      ) : !currentUser ? (
                        <Link to="/login" className="btn btn-navy text-white w-100 py-2">
                          <i className="bi bi-box-arrow-in-right me-1"></i> Sign In to Reserve
                        </Link>
                      ) : null}
                    </>
                  )}

                  {/* Scenario 2: Booth is RESERVED / OCCUPIED */}
                  {activeBooth.status !== 'available' && (
                    <>
                      {activeBooth.reservedBy?._id === currentUser?._id ? (
                        <div className="alert alert-success small mb-0 py-2">
                          <i className="bi bi-check-circle-fill me-1"></i> You have reserved this stall space.
                        </div>
                      ) : (
                        <button disabled className="btn btn-secondary w-100 py-2 opacity-50">
                          <i className="bi bi-lock-fill me-1"></i> Stall Currently {activeBooth.status}
                        </button>
                      )}
                    </>
                  )}

                  {/* Scenario 3: Admin / Organizer Controls */}
                  {isStaff && (
                    <div className="mt-3 pt-3 border-top">
                      <label className="form-label small fw-bold text-navy mb-1">
                        <i className="bi bi-shield-lock me-1 text-orange"></i> Organizer Allocation:
                      </label>
                      <div className="btn-group w-100 btn-group-sm" role="group">
                        <button
                          type="button"
                          disabled={isAdminUpdating || activeBooth.status === 'available'}
                          onClick={() => handleAdminStatusChange('available')}
                          className="btn btn-outline-success"
                        >
                          Mark Available
                        </button>
                        <button
                          type="button"
                          disabled={isAdminUpdating || activeBooth.status === 'reserved'}
                          onClick={() => handleAdminStatusChange('reserved')}
                          className="btn btn-outline-warning"
                        >
                          Hold / Reserve
                        </button>
                        <button
                          type="button"
                          disabled={isAdminUpdating || activeBooth.status === 'occupied'}
                          onClick={() => handleAdminStatusChange('occupied')}
                          className="btn btn-outline-navy"
                        >
                          Confirm Occupied
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-3 text-center small text-muted">
                  Standard setup: 10x10 shell scheme, fascia board, spotlight & 1kW circuit.
                </div>
              </div>
            ) : (
              <div className="card border-0 shadow-sm rounded-4 p-5 text-center text-muted bg-white border">
                <i className="bi bi-hand-index-thumb fs-1 mb-2 text-secondary"></i>
                <h6 className="fw-bold text-navy">No Booth Selected</h6>
                <p className="small mb-0">Click any stall on the floor plan to inspect dimensions and reservation details.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Exhibitor Stall Reservation Modal */}
      {reserveModalOpen && activeBooth && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: 'rgba(15, 34, 61, 0.55)' }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-navy text-white">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-bookmark-check-fill text-orange me-2"></i>
                  Reserve Booth #{activeBooth.boothNumber}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setReserveModalOpen(false)}
                  disabled={isReserving}
                ></button>
              </div>

              <form onSubmit={handleSubmitReservation}>
                <div className="modal-body p-4">
                  {/* Booth Brief Card */}
                  <div className="p-3 bg-light rounded-3 mb-3 border">
                    <div className="row g-2 small">
                      <div className="col-6">
                        <span className="text-muted">Sector / Hall:</span>
                        <div className="fw-bold text-navy">{activeBooth.hall || 'Hall A'}</div>
                      </div>
                      <div className="col-6">
                        <span className="text-muted">Dimensions:</span>
                        <div className="fw-bold text-navy">{activeBooth.size || '10x10 ft'}</div>
                      </div>
                      <div className="col-6">
                        <span className="text-muted">Tariff Rate:</span>
                        <div className="fw-bold text-orange">
                          ${Number(activeBooth.price || 1200).toLocaleString()}
                        </div>
                      </div>
                      <div className="col-6">
                        <span className="text-muted">Reserving Company:</span>
                        <div className="fw-bold text-navy text-truncate">
                          {currentUser?.name || 'Exhibitor'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-navy">
                      Products & Services to Showcase in this Booth
                    </label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="e.g. Next-generation medical scanners, mobile ultrasound units, and live patient test kits..."
                      value={reservationForm.showcaseDetails}
                      onChange={(e) =>
                        setReservationForm({ ...reservationForm, showcaseDetails: e.target.value })
                      }
                      maxLength={1000}
                    ></textarea>
                    <div className="form-text small">
                      Help attendees understand what equipment or services will be displayed at your stall.
                    </div>
                  </div>

                  <div className="mb-2">
                    <label className="form-label small fw-semibold text-navy">
                      Booth Attendants & Point of Contact
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Elena Rostova (Lead Manager) - 03001234567"
                      value={reservationForm.staffInfo}
                      onChange={(e) =>
                        setReservationForm({ ...reservationForm, staffInfo: e.target.value })
                      }
                      maxLength={500}
                    />
                    <div className="form-text small">
                      Name and contact number of booth managers on-site during expo days.
                    </div>
                  </div>
                </div>

                <div className="modal-footer bg-light">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setReserveModalOpen(false)}
                    disabled={isReserving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-orange text-white btn-sm px-4 shadow-sm"
                    disabled={isReserving}
                  >
                    {isReserving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Locking Reservation...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-shield-check me-1"></i> Confirm Stall Reservation
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FloorPlan;
