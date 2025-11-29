const FilterBar = ({ selectedFilter, onFilterChange }) => {
  const filters = ['All', 'Video', 'Image', 'Text'];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              className={`px-8 py-3 rounded-full text-base font-medium transition-all ${
                selectedFilter === filter
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25 scale-105'
                  : 'bg-navy-800/50 border border-white/10 text-slate-300 hover:border-purple-500/50 hover:text-white hover:scale-105'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;

