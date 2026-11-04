import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import ExhibitorCard from '../components/ExhibitorCard';

function Exhibitors() {
  const [exhibitors, setExhibitors] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  useEffect(() => {
    let cancelled = false;

    const loadDirectory = async () => {
      try {
        const [exhibitorResponse, categoryResponse] = await Promise.all([
          axios.get(`${API_URL}/exhibitors`),
          axios.get(`${API_URL}/categories`)
        ]);
        if (cancelled) return;

        const records = exhibitorResponse.data?.exhibitors || [];
        setExhibitors(records);
        const categoryRecords = categoryResponse.data?.data || categoryResponse.data?.categories || [];
        setCategories(['All', ...categoryRecords.map((category) => category.category_name)]);
      } catch (error) {
        if (!cancelled) {
          setLoadError(error.response?.data?.message || 'The exhibitor directory could not be loaded.');
          setExhibitors([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadDirectory();
    return () => {
      cancelled = true;
    };
  }, [API_URL]);

  const filteredExhibitors = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return exhibitors.filter((exhibitor) => {
      const categoryName = exhibitor.category?.category_name || '';
      const matchesCategory = selectedCategory === 'All' || categoryName === selectedCategory;
      const searchableText = [
        exhibitor.companyName,
        exhibitor.description,
        categoryName,
        ...(exhibitor.products || []),
        ...(exhibitor.services || [])
      ].join(' ').toLowerCase();
      return matchesCategory && searchableText.includes(query);
    });
  }, [exhibitors, searchTerm, selectedCategory]);

  return (
    <div className="exhibitors-page py-5 bg-light min-vh-100">
      <div className="container">
        <div className="text-center max-w-700 mx-auto mb-5">
          <span className="badge bg-orange text-white px-3 py-2 rounded-pill text-uppercase fw-semibold mb-2">
            Company Directory
          </span>
          <h1 className="display-6 fw-bold text-navy mb-2">Meet Our Exhibitors</h1>
          <p className="text-muted">
            Explore participating companies, the products they showcase, and the services they provide.
          </p>
        </div>

        <div className="bg-white p-3 p-md-4 rounded-4 shadow-sm mb-5">
          <div className="row g-3 align-items-center">
            <div className="col-lg-5">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="search"
                  className="form-control border-start-0 bg-light"
                  placeholder="Search companies, products, or services..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
                {searchTerm && (
                  <button className="btn btn-light border" type="button" onClick={() => setSearchTerm('')} aria-label="Clear search">
                    <i className="bi bi-x"></i>
                  </button>
                )}
              </div>
            </div>
            <div className="col-lg-7">
              <div className="d-flex flex-wrap gap-2 justify-content-lg-end">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`btn btn-sm rounded-pill px-3 transition ${
                      selectedCategory === category ? 'btn-navy shadow-sm' : 'btn-outline-secondary'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-4">
          <p className="text-muted small mb-0">
            Displaying <strong className="text-navy">{filteredExhibitors.length}</strong> registered exhibitors
          </p>
          {(selectedCategory !== 'All' || searchTerm) && (
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchTerm('');
              }}
              className="btn btn-link btn-sm text-decoration-none text-orange p-0"
            >
              Clear Filters
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-5">
            <span className="spinner-border text-orange" role="status"></span>
            <p className="text-muted small mt-2">Loading company directory...</p>
          </div>
        ) : loadError ? (
          <div className="alert alert-danger" role="alert">{loadError}</div>
        ) : filteredExhibitors.length ? (
          <div className="row g-4">
            {filteredExhibitors.map((exhibitor) => (
              <div className="col-md-6 col-lg-4" key={exhibitor._id}>
                <ExhibitorCard exhibitor={exhibitor} />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-4 p-5 text-center shadow-sm">
            <i className="bi bi-building-exclamation fs-1 text-muted mb-3 d-block"></i>
            <h5 className="fw-bold text-navy">No exhibitors matched your search</h5>
            <p className="text-muted small mb-3">
              {exhibitors.length ? 'Try another search or category.' : 'No company profiles have been published yet.'}
            </p>
            {!exhibitors.length && <p className="text-muted small mb-0">Registered exhibitors will appear here once they complete their company profiles.</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default Exhibitors;
