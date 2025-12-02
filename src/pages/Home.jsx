import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Hero from '../components/Hero';
import FilterBar from '../components/FilterBar';
import Marquee from '../components/Marquee';
import PromptCard from '../components/PromptCard';
import { Search, Loader } from 'lucide-react';

const Home = ({ aiFilter }) => {
  const [searchParams] = useSearchParams();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const promptsRef = useRef(null);

  // Extract filters from URL params
  const urlTool = searchParams.get('tool');
  const urlType = searchParams.get('type');
  const urlCategory = searchParams.get('category');

  // Sync selectedFilter with URL (for visual state)
  useEffect(() => {
    if (urlCategory) {
      setSelectedFilter(urlCategory);
    } else if (urlTool || urlType) {
      // If AI tool/type is active, clear category selection
      setSelectedFilter('All');
    }
  }, [urlCategory, urlTool, urlType]);

  // Scroll to results when filters change (skip on initial load)
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // When filters change, scroll past hero to results
    if ((urlTool || urlType || urlCategory || selectedFilter !== 'All') && promptsRef.current) {
      setTimeout(() => {
        const yOffset = -80;
        const y = promptsRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }, 300); // Small delay to let navigation complete
    }
  }, [urlTool, urlType, urlCategory, selectedFilter]);

  // Fetch prompts from Supabase with filtering
  useEffect(() => {
    const fetchPrompts = async () => {
      setLoading(true);
      setError(null);

      try {
        let query = supabase
          .from('prompts')
          .select('*')
          .order('created_at', { ascending: false });

        // EXCLUSIVE FILTERING: Apply only ONE filter type at a time
        
        // Priority 1: Category filter (from FilterBar)
        if (urlCategory) {
          query = query.ilike('category', urlCategory);
        }
        // Priority 2: AI Tool + Media Type (from Navbar)
        else if (urlTool) {
          query = query.ilike('model', urlTool);
          
          // Also filter by media type if specified
          if (urlType) {
            query = query.ilike('media_type', urlType);
          }
        }
        // Priority 3: Legacy aiFilter prop (fallback)
        else if (aiFilter?.tool) {
          query = query.ilike('model', aiFilter.tool);
          
          if (aiFilter?.type) {
            query = query.ilike('media_type', aiFilter.type);
          }
        }
        // No URL filters, check selectedFilter state
        else if (selectedFilter !== 'All') {
          query = query.ilike('category', selectedFilter);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;

        setPrompts(data || []);
      } catch (err) {
        console.error('Error fetching prompts:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrompts();
  }, [aiFilter, selectedFilter, urlTool, urlType, urlCategory]);

  const handleExploreClick = () => {
    // Scroll to prompts grid, offsetting for fixed navbar (h-16 = 64px)
    if (promptsRef.current) {
      const yOffset = -80; // Extra offset for smooth experience
      const y = promptsRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <Hero onExploreClick={handleExploreClick} />

      {/* Infinite Marquee - Right after hero */}
      <Marquee />

      {/* Search Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for prompts, styles, or AI tools..."
              className="w-full pl-6 pr-32 py-4 bg-navy-800/80 backdrop-blur-sm border border-white/10 rounded-2xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl text-white font-medium flex items-center gap-2 transition-all hover:shadow-lg hover:shadow-purple-500/25">
              <Search className="w-4 h-4" />
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Filter Bar - Below search */}
      <div ref={promptsRef}>
        <FilterBar 
          selectedFilter={selectedFilter} 
          onFilterChange={setSelectedFilter} 
        />
      </div>

      {/* Prompts Grid Section - Right below filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader className="w-12 h-12 animate-spin text-blue-500" />
            <p className="ml-4 text-slate-400 text-lg">Loading prompts...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <p className="text-red-400 text-lg mb-2">Failed to load prompts</p>
            <p className="text-slate-500 text-sm">{error}</p>
          </div>
        )}

        {/* Prompts Grid */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {prompts.map((prompt) => (
                <PromptCard key={prompt.id} prompt={prompt} />
              ))}
            </div>

            {/* No Results Message */}
            {prompts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-slate-400 text-lg">
                  No prompts found matching your filters.
                </p>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Home;

