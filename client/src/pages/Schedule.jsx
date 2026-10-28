import { useState } from 'react';
import { sampleSchedule } from '../data/sampleData';

function Schedule() {
  const [selectedDay, setSelectedDay] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  const days = ['All', 'Day 1', 'Day 2', 'Day 3'];
  const sessionTypes = ['All', 'Keynote', 'Panel Discussion', 'Workshop', 'Pitch Session', 'Networking', 'Awards'];

  const filteredSessions = sampleSchedule.filter((session) => {
    const matchesDay = selectedDay === 'All' || session.day === selectedDay;
    const matchesType = selectedType === 'All' || session.type === selectedType;
    return matchesDay && matchesType;
  });

  return (
    <div className="schedule-page py-5 bg-light min-vh-100">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-700 mx-auto mb-5">
          <span className="badge bg-orange text-white px-3 py-2 rounded-pill text-uppercase fw-semibold mb-2">
            Event Itinerary
          </span>
          <h1 className="display-6 fw-bold text-navy mb-2">Conference & Expo Schedule</h1>
          <p className="text-muted">
            Plan your attendance across keynotes, hands-on masterclasses, startup pitches, and B2B matchmaking sessions.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="bg-white p-4 rounded-4 shadow-sm mb-4">
          <div className="row g-3 align-items-center">
            {/* Day Selector */}
            <div className="col-md-6">
              <label className="form-label text-navy fw-semibold small mb-2">
                <i className="bi bi-calendar3 text-orange me-1"></i> Select Day
              </label>
              <div className="btn-group w-100" role="group">
                {days.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    className={`btn btn-sm ${
                      selectedDay === day ? 'btn-navy' : 'btn-outline-secondary'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Session Type Selector */}
            <div className="col-md-6">
              <label className="form-label text-navy fw-semibold small mb-2">
                <i className="bi bi-tags text-primary me-1"></i> Filter by Session Type
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
        <div className="d-flex flex-column gap-3">
          {filteredSessions.map((session) => (
            <div
              key={session.id}
              className="card border-0 shadow-sm rounded-4 p-4 hover-shadow transition"
            >
              <div className="row align-items-center g-3">
                {/* Time & Day */}
                <div className="col-md-3 border-md-end">
                  <span className="badge bg-navy mb-1">{session.day}</span>
                  <div className="fw-bold text-orange fs-5">{session.time}</div>
                  <div className="text-muted small">{session.date}</div>
                </div>

                {/* Session Details */}
                <div className="col-md-6">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span className="badge bg-orange-subtle text-orange border border-orange-subtle">
                      {session.type}
                    </span>
                    <span className="text-muted small">
                      <i className="bi bi-geo-alt text-danger me-1"></i>
                      {session.room}
                    </span>
                  </div>
                  <h5 className="fw-bold text-navy mb-2">{session.topic}</h5>
                  <div className="d-flex align-items-center gap-2 text-secondary small">
                    <i className="bi bi-person-fill text-primary"></i>
                    <span className="fw-medium">{session.speaker}</span>
                    <span className="text-muted">• {session.speakerRole}</span>
                  </div>
                </div>

                {/* Action button */}
                <div className="col-md-3 text-md-end">
                  <button
                    className="btn btn-outline-navy btn-sm"
                    onClick={() => alert(`Added "${session.topic}" to your personal calendar!`)}
                  >
                    <i className="bi bi-bookmark-plus me-1"></i> Add to Agenda
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredSessions.length === 0 && (
            <div className="bg-white rounded-4 p-5 text-center shadow-sm">
              <i className="bi bi-calendar2-x fs-1 text-muted mb-2 d-block"></i>
              <h5 className="fw-bold text-navy">No sessions found</h5>
              <p className="text-muted small mb-0">Try selecting a different day or session type filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Schedule;

