import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import PromptCard from '../components/PromptCard';
import { Loader, Library as LibraryIcon, ArrowLeft, Lock } from 'lucide-react';

const Library = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { state: { from: '/library' } });
    }
  }, [user, authLoading, navigate]);

  // Fetch user's purchased prompts
  useEffect(() => {
    if (!user) return;

    const fetchPurchases = async () => {
      setLoading(true);
      setError(null);

      try {
        // Query purchases table with inner join to prompts
        const { data, error: fetchError } = await supabase
          .from('purchases')
          .select('*, prompts(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        // Flatten: Extract the prompt object from each purchase
        const prompts = (data || [])
          .map((purchase) => purchase.prompts)
          .filter(Boolean); // Remove nulls if prompt was deleted

        setPurchases(prompts);
      } catch (err) {
        console.error('Error fetching library:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [user]);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5E6D3' }}>
        <Loader className="w-8 h-8 text-purple-700 animate-spin" />
      </div>
    );
  }

  // Not logged in (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4" style={{ backgroundColor: '#F5E6D3' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-purple-700 hover:text-purple-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center">
              <LibraryIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-purple-900">My Library</h1>
              <p className="text-purple-700">Your unlocked prompts collection</p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader className="w-10 h-10 text-purple-600 animate-spin" />
            <p className="ml-4 text-purple-700 text-lg">Loading your library...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16 bg-white/60 rounded-2xl border border-red-200">
            <p className="text-red-700 text-lg mb-2">Failed to load library</p>
            <p className="text-purple-700 text-sm">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && purchases.length === 0 && (
          <div className="text-center py-20 bg-white/60 rounded-2xl border border-purple-200">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-purple-900 mb-3">No prompts yet</h2>
            <p className="text-purple-700 mb-6 max-w-md mx-auto">
              You haven't unlocked any prompts yet. Browse our marketplace and unlock your first prompt!
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-purple-500/30"
            >
              Explore Prompts
            </Link>
          </div>
        )}

        {/* Prompts Grid */}
        {!loading && !error && purchases.length > 0 && (
          <>
            <p className="text-purple-700 mb-6">{purchases.length} prompts in your library</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {purchases.map((prompt) => (
                <PromptCard key={prompt.id} prompt={prompt} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Library;

