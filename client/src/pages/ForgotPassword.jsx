import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function ForgotPassword() {
  const [activeTab, setActiveTab] = useState('request');
  const [email, setEmail] = useState('');
  const [resetData, setResetData] = useState({
    email: '',
    token: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setStatusMessage({ type: 'danger', text: 'Please enter your registered email address.' });
      return;
    }

    setLoading(true);
    setStatusMessage(null);

    try {
      // Direct call to backend forgot-password API
      const response = await axios.post(`${API_URL}/auth/forgot-password`, {
        email: email.trim()
      });

      setStatusMessage({
        type: 'success',
        text: response.data.message || 'If an account matches that email, a password reset code has been sent.'
      });
      setResetData((prev) => ({ ...prev, email: email.trim() }));
      setActiveTab('reset');
    } catch (err) {
      const serverMessage =
        err.response?.data?.message ||
        'Unable to process password reset request. Please check server connection.';

      setStatusMessage({
        type: err.response?.status === 503 ? 'warning' : 'danger',
        text: serverMessage
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (!resetData.email || !resetData.token || !resetData.password) {
      setStatusMessage({ type: 'danger', text: 'Email, reset code, and new password are required.' });
      return;
    }

    if (resetData.password.length < 8) {
      setStatusMessage({ type: 'danger', text: 'Password must be at least 8 characters long.' });
      return;
    }

    setLoading(true);
    setStatusMessage(null);

    try {
      // Direct call to backend reset-password API
      const response = await axios.post(`${API_URL}/auth/reset-password`, resetData);
      setStatusMessage({
        type: 'success',
        text: response.data.message || 'Password reset successfully. You can now sign in.'
      });
    } catch (err) {
      const serverMessage =
        err.response?.data?.message ||
        'Reset failed. The code may be invalid or expired.';
      setStatusMessage({
        type: 'danger',
        text: serverMessage
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page bg-light min-vh-100 py-5 d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6 col-xl-5">
            <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
              <div className="text-center mb-4">
                <span className="brand-icon-box bg-orange text-white rounded d-inline-flex align-items-center justify-content-center mb-2">
                  <i className="bi bi-key-fill"></i>
                </span>
                <h3 className="fw-bold text-navy mb-1">Account Recovery</h3>
                <p className="text-muted small">
                  Reset your EventSphere account password
                </p>
              </div>

              {/* Tab Navigation */}
              <div className="btn-group w-100 mb-4" role="group">
                <button
                  type="button"
                  className={`btn btn-sm ${activeTab === 'request' ? 'btn-navy' : 'btn-outline-secondary'}`}
                  onClick={() => {
                    setActiveTab('request');
                    setStatusMessage(null);
                  }}
                >
                  1. Request Reset Code
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${activeTab === 'reset' ? 'btn-navy' : 'btn-outline-secondary'}`}
                  onClick={() => {
                    setActiveTab('reset');
                    setStatusMessage(null);
                  }}
                >
                  2. Enter Code & New Password
                </button>
              </div>

              {/* Status Message Display */}
              {statusMessage && (
                <div className={`alert alert-${statusMessage.type} small`} role="alert">
                  <i className={`bi ${statusMessage.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2`}></i>
                  {statusMessage.text}
                </div>
              )}

              {/* Tab 1: Request Reset Code */}
              {activeTab === 'request' && (
                <form onSubmit={handleRequestSubmit}>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-navy">
                      Registered Email Address
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light text-muted">
                        <i className="bi bi-envelope"></i>
                      </span>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-text small">
                      We'll send a secure 6-character reset code to this address.
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-navy w-100 py-2 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Sending Code...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send me-2"></i>
                        Send Reset Code
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Tab 2: Reset Password Form */}
              {activeTab === 'reset' && (
                <form onSubmit={handleResetSubmit}>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-navy">
                      Your Registered Email
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light text-muted">
                        <i className="bi bi-envelope"></i>
                      </span>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="name@example.com"
                        value={resetData.email}
                        onChange={(e) => setResetData({ ...resetData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-navy">
                      Reset Code (Received in Email)
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light text-muted">
                        <i className="bi bi-shield-check"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. A3F89C"
                        value={resetData.token}
                        onChange={(e) => setResetData({ ...resetData, token: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label small fw-semibold text-navy">
                      New Password
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light text-muted">
                        <i className="bi bi-lock"></i>
                      </span>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Minimum 8 characters"
                        value={resetData.password}
                        onChange={(e) => setResetData({ ...resetData, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-navy w-100 py-2 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Updating Password...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check2-circle me-2"></i>
                        Confirm New Password
                      </>
                    )}
                  </button>
                </form>
              )}

              <div className="text-center border-top pt-3">
                <Link to="/login" className="text-decoration-none text-navy small">
                  <i className="bi bi-arrow-left me-1"></i> Back to Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
