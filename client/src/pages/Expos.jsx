import { useState, useMemo } from 'react';
import EventCard from '../components/EventCard';
import { sampleExpos } from '../data/sampleData';

function Expos() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    'All',
    'Technology & AI',
    'Healthcare',
    'Green Energy',
    'Automotive',
    'Retail & Fashion',
    'Manufacturing'
  ];

  // Filter expos based on category and search query
  const filteredExpos = useMemo(() => {
    return sampleExpos.filter((expo) => {
      const matchesCategory =
        selectedCategory === 'All' || expo.category === selectedCategory;
      const matchesSearch =
        expo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expo.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expo.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm]);

  return (
    <div className="expos-page py-5 bg-light min-vh-100">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-700 mx-auto mb-5">
          <span className="badge bg-orange text-white px-3 py-2 rounded-pill text-uppercase fw-semibold mb-2">
            Exhibition Directory
          </span>
          <h1 className="display-6 fw-bold text-navy mb-2">Upcoming Trade Shows & Expos</h1>
          <p className="text-muted">
            Browse our curated calendar of global expos. Filter by industry sector or search by city and keywords.
          </p>
        </div>

        {/* Filter & Search Bar */}
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
                  placeholder="Search by event title, location, or keyword..."
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

        {/* Results Counter */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <p className="text-muted small mb-0">
            Showing <strong className="text-navy">{filteredExpos.length}</strong> of{' '}
            {sampleExpos.length} exhibitions
          </p>
          {(selectedCategory !== 'All' || searchTerm) && (
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchTerm('');
              }}
              className="btn btn-link btn-sm text-decoration-none text-orange p-0"
            >
              <i className="bi bi-arrow-counterclockwise me-1"></i> Reset Filters
            </button>
          )}
        </div>

        {/* Expos Grid */}
        {filteredExpos.length > 0 ? (
          <div className="row g-4">
            {filteredExpos.map((expo) => (
              <div className="col-md-6 col-lg-4" key={expo.id}>
                <EventCard event={expo} />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-4 p-5 text-center shadow-sm">
            <i className="bi bi-calendar-x fs-1 text-muted mb-3 d-block"></i>
            <h5 className="fw-bold text-navy">No exhibitions match your criteria</h5>
            <p className="text-muted small mb-3">
              Try adjusting your search terms or selecting a different category.
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

export default Expos;

