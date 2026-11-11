import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { subscribeToLiveUpdates } from '../utils/realtime';

function Schedule() {
  const [sessions, setSessions] = useState([]);
  const [expos, setExpos] = useState([]);
  const [selectedExpoId, setSelectedExpoId] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [loading, setLoading] = useState(true);
  const [refreshVersion, setRefreshVersion] = useState(0);
  const [statusAlert, setStatusAlert] = useState(null);
  const [bookmarkingId, setBookmarkingId] = useState(null);

  // Modal for Admin/Organizer to add a new session
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionForm, setSessionForm] = useState({
    expo: '',
    title: '',
    topic: '',
    speaker: '',
    speakerRole: '',
    sessionType: 'Keynote',
    location: '',
    startTime: '',
    endTime: ''
  });

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  })();

  const canManageSchedule = currentUser?.role === 'admin' || currentUser?.role === 'organizer';

  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      withCredentials: true
    };
  };

  useEffect(() => {
    fetchExposAndSessions();
  }, [selectedExpoId, refreshVersion]);

  useEffect(() => subscribeToLiveUpdates(API_URL, ({ resource }) => {
    if (resource === 'session' || resource === 'expo') {
      setRefreshVersion((version) => version + 1);
    }
  }), [API_URL]);

  const fetchExposAndSessions = async () => {
    setLoading(true);
    try {
      const expoRes = await axios.get(`${API_URL}/expos`);
      const expoList = expoRes.data?.expos || [];
      setExpos(expoList);

      const url = selectedExpoId && selectedExpoId !== 'All'
        ? `${API_URL}/sessions?expo=${selectedExpoId}`
        : `${API_URL}/sessions`;

      const sessionRes = await axios.get(url, getAuthConfig());
      setSessions(sessionRes.data?.sessions || []);
    } catch (err) {
      console.log('Notice: Could not load live sessions:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBookmark = async (session) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    setBookmarkingId(session._id);
    setStatusAlert(null);

    try {
      const response = await axios.post(
        `${API_URL}/sessions/${session._id}/bookmark`,
        {},
        getAuthConfig()
      );

      const isNowBookmarked = response.data?.bookmarked;
      setSessions((prev) =>
        prev.map((s) => (s._id === session._id ? { ...s, isBookmarked: isNowBookmarked } : s))
      );

      setStatusAlert({
        type: isNowBookmarked ? 'success' : 'info',
        text: response.data?.message || (isNowBookmarked ? 'Session saved to your personal agenda!' : 'Session removed from agenda.')
      });
    } catch (err) {
      setStatusAlert({
        type: 'danger',
        text: err.response?.data?.message || 'Could not update your agenda.'
      });
    } finally {
      setBookmarkingId(null);
    }
  };

  const handleOpenAddModal = () => {
    setSessionForm({
      expo: expos[0]?._id || '',
      title: '',
      topic: '',
      speaker: '',
      speakerRole: 'Industry Specialist',
      sessionType: 'Keynote',
      location: '',
      startTime: '',
      endTime: ''
    });
    setModalOpen(true);
  };

  const handleCreateSessionSubmit = async (e) => {
    e.preventDefault();
    if (!sessionForm.title.trim() || !sessionForm.speaker.trim() || !sessionForm.location.trim() || !sessionForm.expo) {
      setStatusAlert({ type: 'danger', text: 'Expo, title, speaker, and location are required.' });
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/sessions`, sessionForm, getAuthConfig());
      setStatusAlert({ type: 'success', text: 'New session added to conference schedule!' });
      setModalOpen(false);
      await fetchExposAndSessions();
    } catch (err) {
      setStatusAlert({
        type: 'danger',
        text: err.response?.data?.message || 'Failed to save session.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const sessionTypes = ['All', 'Keynote', 'Panel Discussion', 'Workshop', 'Pitch Session', 'Networking', 'Awards'];

  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      const matchesType = selectedType === 'All' || (s.sessionType || '').toLowerCase() === selectedType.toLowerCase();
      return matchesType;
    });
  }, [sessions, selectedType]);

  const formatSessionTime = (startTime, endTime) => {
    if (!startTime) return 'Time TBA';
    const start = new Date(startTime);
    const timeStr = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (endTime) {
      const end = new Date(endTime);
      return `${timeStr} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    return timeStr;
  };

  const formatSessionDate = (startTime) => {
    if (!startTime) return '';
    return new Date(startTime).toLocaleDateString([], {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="schedule-page py-5 bg-light min-vh-100">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-700 mx-auto mb-4">
          <span className="badge bg-orange text-white px-3 py-2 rounded-pill text-uppercase fw-semibold mb-2">
            Event Itinerary & Agenda
          </span>
          <h1 className="display-6 fw-bold text-navy mb-2">Conference & Expo Schedule</h1>
          <p className="text-muted small">
            Plan your attendance across keynotes, hands-on masterclasses, startup pitches, and B2B matchmaking sessions.
          </p>

          {canManageSchedule && (
            <button onClick={handleOpenAddModal} className="btn btn-orange text-white btn-sm px-3 mt-2 shadow-sm">
              <i className="bi bi-plus-circle me-1"></i> Add Conference Session
            </button>
          )}
        </div>

        {/* Status Alert */}
        {statusAlert && (
          <div className={`alert alert-${statusAlert.type} alert-dismissible fade show small d-flex align-items-center gap-2 mb-4 shadow-sm`} role="alert">
            <i className={`bi ${statusAlert.type === 'success' ? 'bi-check-circle-fill' : 'bi-info-circle-fill'}`}></i>
            <div className="flex-grow-1">{statusAlert.text}</div>
            <button type="button" className="btn-close" onClick={() => setStatusAlert(null)}></button>
          </div>
        )}

        {/* Filter Controls */}
        <div className="bg-white p-3 p-md-4 rounded-4 shadow-sm mb-4 border">
          <div className="row g-3 align-items-center">
            {/* Expo Selector */}
            <div className="col-md-6">
              <label className="form-label text-navy fw-semibold small mb-2">
                <i className="bi bi-calendar-event text-orange me-1"></i> Select Expo Event:
              </label>
              <select
                className="form-select form-select-sm"
                value={selectedExpoId}
                onChange={(e) => setSelectedExpoId(e.target.value)}
              >
                <option value="All">All Expos & Summits ({expos.length})</option>
                {expos.map((expo) => (
                  <option key={expo._id} value={expo._id}>
                    {expo.title} ({expo.location || 'Convention Center'})
                  </option>
                ))}
              </select>
            </div>

            {/* Session Type Selector */}
            <div className="col-md-6">
              <label className="form-label text-navy fw-semibold small mb-2">
                <i className="bi bi-tags text-primary me-1"></i> Filter by Session Type:
              </label>
              <select
                className="form-select form-select-sm"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {sessionTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === 'All' ? 'All Session Types' : type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Sessions List */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-orange" role="status"></div>
            <p className="text-muted small mt-2">Loading live event schedule...</p>
          </div>
        ) : filteredSessions.length > 0 ? (
          <div className="d-flex flex-column gap-3">
            {filteredSessions.map((session) => (
              <div
                key={session._id}
                className="card border-0 shadow-sm rounded-4 p-4 hover-shadow transition bg-white border"
              >
                <div className="row align-items-center g-3">
                  {/* Time & Date Column */}
                  <div className="col-md-3 border-md-end">
                    <span className="badge bg-navy mb-1 small text-uppercase">
                      {session.expo?.title || 'Summit Session'}
                    </span>
                    <div className="fw-bold text-orange fs-5">
                      {formatSessionTime(session.startTime, session.endTime)}
                    </div>
                    <div className="text-muted small">
                      <i className="bi bi-calendar3 me-1"></i>
                      {formatSessionDate(session.startTime)}
                    </div>
                  </div>

                  {/* Session Details */}
                  <div className="col-md-6">
                    <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                      <span className="badge bg-light text-navy border">
                        {session.sessionType || 'Keynote'}
                      </span>
                      <span className="text-muted small">
                        <i className="bi bi-geo-alt text-danger me-1"></i>
                        {session.location}
                      </span>
                    </div>

                    <h5 className="fw-bold text-navy mb-1">{session.title}</h5>

                    {session.topic && (
                      <p className="text-secondary small mb-2">{session.topic}</p>
                    )}

                    <div className="d-flex align-items-center gap-2 text-secondary small">
                      <i className="bi bi-person-fill text-primary"></i>
                      <span className="fw-medium text-navy">{session.speaker}</span>
                      {session.speakerRole && (
                        <span className="text-muted">• {session.speakerRole}</span>
                      )}
                    </div>
                  </div>

                  {/* Action Button: Live Bookmark to MongoDB */}
                  <div className="col-md-3 text-md-end">
                    <button
                      className={`btn btn-sm ${
                        session.isBookmarked
                          ? 'btn-success text-white'
                          : 'btn-outline-navy'
                      }`}
                      onClick={() => handleToggleBookmark(session)}
                      disabled={bookmarkingId === session._id}
                    >
                      {bookmarkingId === session._id ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                          Saving...
                        </>
                      ) : session.isBookmarked ? (
                        <>
                          <i className="bi bi-bookmark-check-fill me-1"></i> On Your Agenda
                        </>
                      ) : (
                        <>
                          <i className="bi bi-bookmark-plus me-1"></i> Add to Agenda
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-4 p-5 text-center shadow-sm border">
            <i className="bi bi-calendar2-x fs-1 text-muted mb-2 d-block"></i>
            <h5 className="fw-bold text-navy">No Sessions Found</h5>
            <p className="text-muted small mb-0">Try selecting a different expo or session type filter.</p>
          </div>
        )}
      </div>

      {/* Admin/Organizer Add Session Modal */}
      {modalOpen && (
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
                  <i className="bi bi-calendar-plus text-orange me-2"></i>
                  Add Session to Schedule
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setModalOpen(false)}
                  disabled={isSubmitting}
                ></button>
              </div>

              <form onSubmit={handleCreateSessionSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label small fw-semibold text-navy">Associated Expo *</label>
                      <select
                        className="form-select form-select-sm"
                        value={sessionForm.expo}
                        onChange={(e) => setSessionForm({ ...sessionForm, expo: e.target.value })}
                        required
                      >
                        <option value="">Select Expo</option>
                        {expos.map((e) => (
                          <option key={e._id} value={e._id}>{e.title}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold text-navy">Session Title *</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="e.g. Keynote: Autonomous Drone Logistics"
                        value={sessionForm.title}
                        onChange={(e) => setSessionForm({ ...sessionForm, title: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-navy">Session Format</label>
                      <select
                        className="form-select form-select-sm"
                        value={sessionForm.sessionType}
                        onChange={(e) => setSessionForm({ ...sessionForm, sessionType: e.target.value })}
                      >
                        <option value="Keynote">Keynote</option>
                        <option value="Panel Discussion">Panel Discussion</option>
                        <option value="Workshop">Workshop</option>
                        <option value="Pitch Session">Pitch Session</option>
                        <option value="Networking">Networking</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-navy">Room / Location *</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="e.g. Main Auditorium A-1"
                        value={sessionForm.location}
                        onChange={(e) => setSessionForm({ ...sessionForm, location: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-navy">Keynote Speaker *</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="e.g. Dr. Aris Thorne"
                        value={sessionForm.speaker}
                        onChange={(e) => setSessionForm({ ...sessionForm, speaker: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-navy">Speaker Role</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="e.g. Chief Scientist"
                        value={sessionForm.speakerRole}
                        onChange={(e) => setSessionForm({ ...sessionForm, speakerRole: e.target.value })}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold text-navy">Topic / Summary</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="e.g. Vision-Language-Action Models and edge robotics"
                        value={sessionForm.topic}
                        onChange={(e) => setSessionForm({ ...sessionForm, topic: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-navy">Start Time</label>
                      <input
                        type="datetime-local"
                        className="form-control form-control-sm"
                        value={sessionForm.startTime}
                        onChange={(e) => setSessionForm({ ...sessionForm, startTime: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-navy">End Time</label>
                      <input
                        type="datetime-local"
                        className="form-control form-control-sm"
                        value={sessionForm.endTime}
                        onChange={(e) => setSessionForm({ ...sessionForm, endTime: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer bg-light">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setModalOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-orange text-white btn-sm px-4"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-1"></i> Add Session
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

export default Schedule;
