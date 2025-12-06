import { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { formatDisplayName } from '../lib/formatters'; // Import centralized formatter
import Hero from '../components/Hero';
import MarqueeSection from '../components/MarqueeSection';
import PromptCard from '../components/PromptCard';
import { Loader } from 'lucide-react';

const Home = ({ aiFilter }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [prompts, setPrompts] = useState([]);
  const [midjourneyPrompts, setMidjourneyPrompts] = useState([]);
  const [veoPrompts, setVeoPrompts] = useState([]);
  const [chatgptPrompts, setChatgptPrompts] = useState([]);
  const [grokPrompts, setGrokPrompts] = useState([]);
  const [geminiPrompts, setGeminiPrompts] = useState([]);
  const [hailuoPrompts, setHailuoPrompts] = useState([]);
  const [leonardoPrompts, setLeonardoPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marqueeLoading, setMarqueeLoading] = useState(true);
  const [error, setError] = useState(null);
  const [marqueeError, setMarqueeError] = useState(null);
  const promptsRef = useRef(null);

  // Extract filters from URL params
  const urlModel = searchParams.get('model');   // Navbar sends 'model'
  const urlType = searchParams.get('type');
  const urlCategory = searchParams.get('category');
  const searchTerm = searchParams.get('q') || ''; // Get search from URL

  // Local search state (synced with URL)
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const selectedModel = urlModel || '';
  const selectedCategory = urlCategory || '';

  // Sync localSearch with URL on mount/change
  useEffect(() => {
    setLocalSearch(searchTerm);
  }, [searchTerm]);

  // Handle Search Submit
  const handleSearch = (e) => {
    e.preventDefault();
    
    const params = new URLSearchParams(searchParams);
    
    if (localSearch.trim()) {
      params.set('q', localSearch.trim());
    } else {
      params.delete('q');
    }
    
    navigate(`/?${params.toString()}`);
  };

  // Sync selectedFilter with URL (for visual state)
  useEffect(() => {
    if (urlCategory) {
      setSelectedFilter(urlCategory);
    } else if (urlModel || urlType) {
      // If AI tool/type is active, clear category selection
      setSelectedFilter('All');
    }
  }, [urlCategory, urlModel, urlType]);

  // Scroll to results when filters change (skip on initial load)
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // When filters change, scroll past hero to results
    if ((urlModel || urlType || urlCategory || selectedFilter !== 'All') && promptsRef.current) {
      setTimeout(() => {
        const yOffset = -80;
        const y = promptsRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }, 300); // Small delay to let navigation complete
    }
  }, [urlModel, urlType, urlCategory, selectedFilter]);

  // Fetch marquee rows (featured by model)
  useEffect(() => {
    const fetchMarquee = async () => {
      setMarqueeLoading(true);
      setMarqueeError(null);
      try {
        const fetchRow = async (modelLike) => {
          const { data, error: err } = await supabase
            .from('prompts')
            .select('*')
            .ilike('model', modelLike)
            .eq('featured', true)
            .order('created_at', { ascending: false })
            .limit(10);
          if (err) throw err;
          return data || [];
        };

        const [mj, veo, cgpt, grok, gem, hailuo, leo] = await Promise.all([
          fetchRow('midjourney%'),
          fetchRow('veo3%'),
          fetchRow('chatgpt%'),
          fetchRow('grok%'),
          fetchRow('gemini%'),
          fetchRow('hailuo%'),
          fetchRow('leonardo%'),
        ]);

        setMidjourneyPrompts(mj);
        setVeoPrompts(veo);
        setChatgptPrompts(cgpt);
        setGrokPrompts(grok);
        setGeminiPrompts(gem);
        setHailuoPrompts(hailuo);
        setLeonardoPrompts(leo);
      } catch (err) {
        console.error('Error fetching marquee prompts:', err);
        setMarqueeError('Marquee verileri alınamadı');
      } finally {
        setMarqueeLoading(false);
      }
    };

    fetchMarquee();
  }, []);

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

        // CUMULATIVE (AND) FILTERING
        
        // 1. Model Filter (Strict slug match)
        if (urlModel) {
          query = query.eq('model', urlModel);
        } else if (aiFilter?.tool) {
          query = query.eq('model', aiFilter.tool);
        }

        // 2. Media Type Filter (Strict slug match)
        if (urlType) {
          query = query.eq('media_type', urlType);
        } else if (aiFilter?.type) {
          query = query.eq('media_type', aiFilter.type);
        }

        // 3. Category Filter (Strict slug match)
        if (urlCategory) {
          query = query.eq('category', urlCategory);
        } else if (selectedFilter !== 'All') {
          query = query.eq('category', selectedFilter);
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
  }, [aiFilter, selectedFilter, urlModel, urlType, urlCategory]);

  const handleExploreClick = () => {
    // Scroll to prompts grid, offsetting for fixed navbar (h-16 = 64px)
    if (promptsRef.current) {
      const yOffset = -80; // Extra offset for smooth experience
      const y = promptsRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Strict client-side filtering (AND logic)
  const filteredPrompts = prompts.filter((p) => {
    // Normalize / trim
    const promptModel = (p.model || '').toLowerCase().trim();
    const urlModel = selectedModel ? selectedModel.toLowerCase().trim() : null;

    const promptCategory = (p.category || '').toLowerCase().trim();
    const urlCat = selectedCategory ? selectedCategory.toLowerCase().trim() : null;

    // Strict equals (with fallback for non-slugified DB data)
    // If URL is "chatgpt-image", match DB "chatgpt-image" OR "chatgpt image"
    const matchModel = urlModel 
      ? (promptModel === urlModel || promptModel === urlModel.replace(/-/g, ' ')) 
      : true;
    
    const matchCategory = urlCat 
      ? (promptCategory === urlCat || promptCategory === urlCat.replace(/-/g, ' ')) 
      : true;

    // Search: flexible (searches title, description, and prompt_text)
    // Use searchTerm (from URL) for filtering, not localSearch (input state)
    const matchSearch = searchTerm
      ? (
          p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.prompt_text?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : true;

    if (urlModel && !matchModel) {
      console.log(
        `❌ Elendi: URL(${urlModel}) != DB(${promptModel})`
      );
    }

    return matchModel && matchCategory && matchSearch;
  });

  // Check if any filter is active
  const isFiltered = urlModel || urlCategory || searchTerm;

  return (
    <div>
      {/* Hero Section with Search Bar */}
      <Hero 
        searchValue={localSearch}
        onSearchChange={setLocalSearch}
        onSearchSubmit={handleSearch}
      />

      {/* STREAMING-STYLE MARQUEE SECTIONS - Only show on homepage (no filters) */}
      {!isFiltered && (
        <div className="space-y-16 py-12 relative z-0">
          {marqueeLoading && (
            <div className="flex items-center justify-center gap-3 text-purple-700">
              <Loader className="w-6 h-6 animate-spin" />
              <span>Öne çıkan promptlar yükleniyor...</span>
            </div>
          )}
          {marqueeError && (
            <div className="text-center text-red-700">{marqueeError}</div>
          )}
          {!marqueeLoading && !marqueeError && (
            <>
              <MarqueeSection 
                title="Midjourney" 
                items={midjourneyPrompts} 
                direction="left" 
              />
              <MarqueeSection 
                title="Top Veo3 Picks" 
                items={veoPrompts} 
                direction="right" 
              />
              <MarqueeSection 
                title="ChatGPT Favorites" 
                items={chatgptPrompts} 
                direction="left" 
              />
              <MarqueeSection 
                title="Grok Highlights" 
                items={grokPrompts} 
                direction="right" 
              />
              <MarqueeSection 
                title="Gemini Highlights" 
                items={geminiPrompts} 
                direction="left" 
              />
              <MarqueeSection 
                title="Hailuo AI Spotlight" 
                items={hailuoPrompts} 
                direction="right" 
              />
              <MarqueeSection 
                title="Leonardo AI Picks" 
                items={leonardoPrompts} 
                direction="left" 
              />
            </>
          )}
        </div>
      )}

      {/* Filtered Results Grid - Only show when filter is active */}
      {isFiltered && (
        <section ref={promptsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-16">
          {/* Section Header */}
          <div className="mb-8">
          <h2 className="text-3xl font-bold text-purple-900 mb-2">
            {urlModel ? formatDisplayName(urlModel) : 'Prompts'}
            {urlCategory && <span className="text-purple-600"> • {formatDisplayName(urlCategory)}</span>}
          </h2>
            <p className="text-purple-700">
              {loading ? 'Loading...' : `${filteredPrompts.length} results found`}
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <Loader className="w-12 h-12 animate-spin text-purple-600" />
              <p className="ml-4 text-purple-700 text-lg">Loading prompts...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-16">
              <p className="text-red-700 text-lg mb-2">Failed to load prompts</p>
              <p className="text-purple-700 text-sm">{error}</p>
            </div>
          )}

          {/* Prompts Grid */}
          {!loading && !error && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPrompts.map((prompt) => (
                  <PromptCard key={prompt.id} prompt={prompt} />
                ))}
              </div>

              {/* No Results Message */}
              {filteredPrompts.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-purple-700 text-lg">
                    No prompts found matching your filters.
                  </p>
                </div>
              )}
            </>
          )}
        </section>
      )}
    </div>
  );
};

export default Home;

