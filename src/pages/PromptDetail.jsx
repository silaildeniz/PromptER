import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { getDetailImage, isVideo } from '../lib/utils';
import { ArrowLeft, Lock, Copy, Check, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const PromptDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [prompt, setPrompt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [checkingOwnership, setCheckingOwnership] = useState(true);
  const [unlocking, setUnlocking] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch prompt from Supabase
  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('prompts')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;

        setPrompt(data);
      } catch (err) {
        console.error('Error fetching prompt:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrompt();
  }, [id]);

  // Check if user owns this prompt (permanent access)
  useEffect(() => {
    const checkOwnership = async () => {
      if (!user || !id) {
        setCheckingOwnership(false);
        return;
      }

      try {
        const { data, error: ownershipError } = await supabase
          .from('purchases')
          .select('id')
          .eq('user_id', user.id)
          .eq('prompt_id', id)
          .single();

        if (data) {
          setIsUnlocked(true);
        }
      } catch (err) {
        // No ownership found (expected for new users)
        setIsUnlocked(false);
      } finally {
        setCheckingOwnership(false);
      }
    };

    if (!loading) {
      checkOwnership();
    }
  }, [user, id, loading]);

  const handleUnlock = async () => {
    if (!user) {
      toast.error('Please sign in to unlock prompts');
      navigate('/login');
      return;
    }

    setUnlocking(true);

    try {
      const { data, error: rpcError } = await supabase.rpc('unlock_prompt', {
        prompt_uuid: id,
        cost: prompt.cost
      });

      if (rpcError) throw rpcError;

      if (data.success) {
        setIsUnlocked(true);
        
        if (data.already_owned) {
          toast.success('Prompt already unlocked!');
        } else {
          toast.success(`Prompt unlocked! ${data.credits_remaining} credits remaining`);
        }
      } else {
        if (data.error === 'insufficient_funds') {
          toast.error(`Not enough credits! You need ${data.required} but have ${data.available}`);
        } else {
          toast.error(data.message || 'Failed to unlock prompt');
        }
      }
    } catch (err) {
      console.error('Unlock error:', err);
      toast.error('Failed to unlock prompt');
    } finally {
      setUnlocking(false);
    }
  };

  const handleCopy = () => {
    if (isUnlocked) {
      navigator.clipboard.writeText(prompt.prompt_text);
      setCopied(true);
      toast.success('Prompt copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatModelName = () => {
    const modelLower = prompt?.model?.toLowerCase() || '';
    
    const modelMap = {
      'midjourney': 'Midjourney',
      'chatgpt': 'ChatGPT',
      'veo3': 'Veo3',
      'sora': 'Sora',
      'leonardo': 'Leonardo',
      'dalle': 'DALL-E',
      'stable-diffusion': 'Stable Diffusion'
    };
    
    return modelMap[modelLower] || prompt?.model || 'Unknown';
  };

  // Loading state
  if (loading || checkingOwnership) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-slate-400">Loading prompt...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !prompt) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-2">Prompt not found</p>
          <p className="text-slate-500 text-sm mb-4">{error || 'This prompt does not exist'}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Image/Video */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-navy-900">
              {isVideo(prompt.media_type) ? (
                <video
                  src={prompt.media_url}
                  controls
                  className="w-full h-auto object-cover"
                />
              ) : (
                <img
                  src={getDetailImage(prompt.media_url)}
                  alt={prompt.title}
                  className="w-full h-auto object-cover"
                  loading="eager"
                  onError={(e) => {
                    // Fallback to original URL if transformation fails
                    e.target.src = prompt.media_url;
                  }}
                />
              )}
              
              {/* Model Badge (Glassmorphism) */}
              <div className="absolute top-4 left-4 bg-black/30 backdrop-blur-md border border-white/20 text-white text-sm font-medium px-4 py-2 rounded-full z-10">
                <span className="font-semibold">{formatModelName()}</span>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div>
            {/* Category Badge */}
            <div className="inline-block px-3 py-1 bg-navy-800/50 rounded-lg border border-white/10 mb-4">
              <span className="text-sm text-slate-300 capitalize">{prompt.category}</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-white mb-6">{prompt.title}</h1>

            {/* Description */}
            {prompt.description && (
              <p className="text-slate-300 mb-8 leading-relaxed">
                {prompt.description}
              </p>
            )}

            {/* Variables Info */}
            {prompt.variables && prompt.variables.length > 0 && (
              <div className="mb-8 p-4 bg-navy-800/50 rounded-xl border border-white/10">
                <h3 className="text-white font-semibold mb-3">Variables:</h3>
                <div className="flex flex-wrap gap-2">
                  {prompt.variables.map((variable, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-300 text-sm"
                    >
                      [{variable}]
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Prompt Box */}
            <div className="relative mb-8">
              <div className="bg-navy-800/50 rounded-xl border border-white/10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Prompt</h3>
                  {isUnlocked && (
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white text-sm transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Prompt Text */}
                <div className="relative">
                  {isUnlocked ? (
                    // Unlocked: Full height, no restrictions
                    <p className="text-slate-300 leading-relaxed font-mono text-sm whitespace-pre-wrap">
                      {prompt.prompt_text}
                    </p>
                  ) : (
                    // Locked: Fixed 3-line height with blur overlay
                    <div className="relative h-32 overflow-hidden">
                      <p className="text-slate-300 leading-relaxed font-mono text-sm whitespace-pre-wrap blur-sm select-none">
                        {prompt.prompt_text}
                      </p>
                      
                      {/* Blur Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-navy-800/50 to-navy-800 flex items-end justify-center pb-4">
                        <Lock className="w-8 h-8 text-purple-400" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex gap-4">
              {!isUnlocked ? (
                <button
                  onClick={handleUnlock}
                  disabled={unlocking}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl text-white font-semibold transition-all hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {unlocking ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Unlocking...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      Unlock Prompt ({prompt.cost} Credits)
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleCopy}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-green-600 hover:bg-green-500 rounded-xl text-white font-semibold transition-all hover:shadow-lg hover:shadow-green-500/50"
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      Copy Prompt
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptDetail;
