import { useNavigate } from 'react-router-dom';

const FilterBar = ({ selectedFilter, onFilterChange }) => {
  const navigate = useNavigate();

  const filters = [
    { id: 'All', label: 'All' },
    { id: 'Image', label: 'Image' },
    { id: 'Video', label: 'Video' },
    { id: 'Corporate', label: 'Corporate' },
    { id: 'Social Media', label: 'Social Media' },
    { id: 'Gaming', label: 'Gaming' },
    { id: 'Writing & SEO', label: 'Writing & SEO' }
  ];

  const handleCategoryClick = (category) => {
    // EXCLUSIVE FILTERING: Reset ALL other filters (AI tool, media type, etc.)
    if (category === 'All') {
      // Clear all filters - hard reset
      navigate('/', { replace: false });
      onFilterChange('All');
    } else {
      // Create clean URL with ONLY this category filter
      navigate(`/?category=${encodeURIComponent(category)}`, { replace: false });
      onFilterChange(category);
    }

    // Smooth scroll to results
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => handleCategoryClick(filter.id)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                selectedFilter === filter.id
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25 scale-105'
                  : 'bg-navy-800/50 border border-white/10 text-slate-300 hover:border-purple-500/50 hover:text-white hover:scale-105'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;


