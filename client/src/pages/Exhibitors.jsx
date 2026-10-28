import { useState, useMemo } from 'react';
import ExhibitorCard from '../components/ExhibitorCard';
import { sampleExhibitors } from '../data/sampleData';

function Exhibitors() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    'All',
    'Technology & AI',
    'Healthcare',
    'Automotive',
    'Green Energy',
    'Retail & Fashion',
    'Manufacturing'
  ];

  // Filter exhibitors based on category and search term
  const filteredExhibitors = useMemo(() => {
    return sampleExhibitors.filter((exhibitor) => {
      const matchesCategory =
        selectedCategory === 'All' || exhibitor.category === selectedCategory;
      const matchesSearch =
        exhibitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exhibitor.booth.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exhibitor.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm]);

  return (
    <div className="exhibitors-page py-5 bg-light min-vh-100">
      <div className="container">
        {/* Page Header */}
        <div className="text-center max-w-700 mx-auto mb-5">
          <span className="badge bg-orange text-white px-3 py-2 rounded-pill text-uppercase fw-semibold mb-2">
            Company Directory
          </span>
          <h1 className="display-6 fw-bold text-navy mb-2">Meet Our Exhibitors</h1>
          <p className="text-muted">
            Connect directly with leading brands, emerging manufacturers, and service providers displaying in our halls.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-3 p-md-4 rounded-4 shadow-sm mb-5">
          <div className="row g-3 align-items-center">
            {/* Search Input */}
            <div className="col-lg-5">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 bg-light"
                  placeholder="Search exhibitors by company, booth # or products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="btn btn-light border"
                    type="button"
                    onClick={() => setSearchTerm('')}
                  >
                    <i className="bi bi-x"></i>
                  </button>
                )}
              </div>
            </div>

            {/* Category Pills */}
            <div className="col-lg-7">
              <div className="d-flex flex-wrap gap-2 justify-content-lg-end">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`btn btn-sm rounded-pill px-3 transition ${
                      selectedCategory === cat
                        ? 'btn-navy shadow-sm'
                        : 'btn-outline-secondary'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Status header */}
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
              <i className="bi bi-arrow-counterclockwise me-1"></i> Clear Filters
            </button>
          )}
        </div>

        {/* Exhibitors Grid */}
        {filteredExhibitors.length > 0 ? (
          <div className="row g-4">
            {filteredExhibitors.map((exhibitor) => (
              <div className="col-md-6 col-lg-4" key={exhibitor.id}>
                <ExhibitorCard exhibitor={exhibitor} />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-4 p-5 text-center shadow-sm">
            <i className="bi bi-building-exclamation fs-1 text-muted mb-3 d-block"></i>
            <h5 className="fw-bold text-navy">No exhibitors matched your search</h5>
            <p className="text-muted small mb-3">
              Try searching with different keywords or switch back to the 'All' category.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchTerm('');
              }}
              className="btn btn-orange text-white btn-sm px-3"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Exhibitors;

