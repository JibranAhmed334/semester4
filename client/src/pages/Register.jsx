import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'attendee'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Form validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      // Direct axios call to backend register API
      const response = await axios.post(`${API_URL}/auth/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });

      setSuccess(response.data.message || 'Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      const serverMessage =
        err.response?.data?.message ||
        'Unable to complete registration. Please check server connection.';
      setError(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page bg-light min-vh-100 py-5 d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6 col-xl-5">
            <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
              <div className="text-center mb-4">
                <span className="brand-icon-box bg-orange text-white rounded d-inline-flex align-items-center justify-content-center mb-2">
                  <i className="bi bi-person-plus-fill"></i>
                </span>
                <h3 className="fw-bold text-navy mb-1">Create Account</h3>
                <p className="text-muted small">
                  Join the EventSphere Management System
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="alert alert-danger alert-dismissible fade show small" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                  <button type="button" className="btn-close" onClick={() => setError('')}></button>
                </div>
              )}

              {/* Success Alert */}
              {success && (
                <div className="alert alert-success alert-dismissible fade show small" role="alert">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Full Name */}
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-navy">
                    Full Name <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted">
                      <i className="bi bi-person"></i>
                    </span>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="e.g. John Doe"
                      required
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-navy">
                    Email Address <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted">
                      <i className="bi bi-envelope"></i>
                    </span>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="name@example.com"
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Role Selection */}
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-navy">
                    Account Role <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted">
                      <i className="bi bi-briefcase"></i>
                    </span>
                    <select
                      name="role"
                      className="form-select"
                      value={formData.role}
                      onChange={handleChange}
                    >
                      <option value="attendee">Attendee (Visitor & Delegate)</option>
                      <option value="exhibitor">Exhibitor (Company & Booth Host)</option>
                      <option value="organizer">Organizer (Admin Managed)</option>
                    </select>
                  </div>
                  <div className="form-text small">
                    Note: Self-registration accepts Attendee and Exhibitor roles.
                  </div>
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-navy">
                    Password <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted">
                      <i className="bi bi-lock"></i>
                    </span>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="Minimum 6 characters"
                      required
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="mb-4">
                  <label className="form-label small fw-semibold text-navy">
                    Confirm Password <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted">
                      <i className="bi bi-shield-lock"></i>
                    </span>
                    <input
                      type="password"
                      name="confirmPassword"
                      className="form-control"
                      placeholder="Repeat your password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-navy text-white w-100 py-2 fw-semibold shadow-sm"
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Registering Account...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-person-check me-1"></i> Register Now
                    </>
                  )}
                </button>
              </form>

              <div className="text-center mt-4 pt-2 border-top small text-muted">
                Already have an account?{' '}
                <Link to="/login" className="text-orange fw-bold text-decoration-none">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
