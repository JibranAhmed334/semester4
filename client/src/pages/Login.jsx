import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

    if (!formData.email.trim() || !formData.password) {
      setError('Email and password are required.');
      return;
    }

    setLoading(true);

    try {
      // Direct axios call to backend login API
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: formData.email.trim(),
        password: formData.password
      }, {
        withCredentials: true
      });

      // Save token and user details in localStorage
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify({
          name: response.data.name,
          email: response.data.email,
          role: response.data.role
        }));
      }

      setSuccess(`Welcome back, ${response.data.name || 'User'}! Redirecting...`);

      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      const serverMessage =
        err.response?.data?.message ||
        'Unable to log in. Please check your credentials and server connection.';
      setError(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page bg-light min-vh-100 py-5 d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-5 col-xl-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
              <div className="text-center mb-4">
                <span className="brand-icon-box bg-navy text-white rounded d-inline-flex align-items-center justify-content-center mb-2">
                  <i className="bi bi-shield-lock-fill text-orange"></i>
                </span>
                <h3 className="fw-bold text-navy mb-1">Welcome Back</h3>
                <p className="text-muted small">Sign in to your EventSphere account</p>
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
                {/* Email */}
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

                {/* Password */}
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label small fw-semibold text-navy mb-0">
                      Password <span className="text-danger">*</span>
                    </label>
                    <Link to="/forgot-password" className="text-orange small text-decoration-none">
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted">
                      <i className="bi bi-lock"></i>
                    </span>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="Enter your password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-navy text-white w-100 py-2 fw-semibold shadow-sm mt-2"
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Signing In...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right me-1"></i> Sign In
                    </>
                  )}
                </button>
              </form>

              <div className="text-center mt-4 pt-2 border-top small text-muted">
                Don&apos;t have an account yet?{' '}
                <Link to="/register" className="text-orange fw-bold text-decoration-none">
                  Register
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
