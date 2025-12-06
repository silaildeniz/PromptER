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
        prompt_id_input: id,
        cost_input: prompt.cost
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
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-slate-400">Loading prompt...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !prompt) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-2">Prompt not found</p>
          <p className="text-slate-500 text-sm mb-4">{error || 'This prompt does not exist'}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </button>

        {/* Glassmorphism Container */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Image/Video */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden border border-purple-500/30 bg-gradient-to-br from-[#2d1560] to-[#8b5cf6] shadow-xl">
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
                
                {/* Model Badge - Top Left (BEIGE) */}
                <div className="absolute top-4 left-4 bg-[#F3E5AB] border border-amber-300 text-purple-900 text-sm font-bold px-4 py-2 rounded-full z-10 shadow-lg">
                  <span className="font-bold">{formatModelName()}</span>
                </div>
              </div>
            </div>

            {/* Right Column - Details */}
            <div>
              {/* Badges Row */}
              <div className="flex items-center gap-3 mb-6">
                {/* Category Badge (BEIGE) */}
                <div className="inline-block px-4 py-2 bg-[#F3E5AB] rounded-full border border-amber-300 shadow-md">
                  <span className="text-sm text-purple-900 font-bold capitalize">{prompt.category}</span>
                </div>

                {/* Cost Badge (BEIGE) */}
                <div className="inline-block px-4 py-2 bg-[#F3E5AB] rounded-full border border-amber-300 shadow-md">
                  <span className="text-sm text-purple-900 font-bold">{prompt.cost} Credits</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">{prompt.title}</h1>

              {/* Description */}
              {prompt.description && (
                <p className="text-slate-300 mb-8 leading-relaxed text-lg">
                  {prompt.description}
                </p>
              )}

              {/* Variables Info */}
              {prompt.variables && prompt.variables.length > 0 && (
                <div className="mb-8 p-5 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl border border-purple-500/30 backdrop-blur-sm">
                  <h3 className="text-white font-bold mb-3 text-sm uppercase tracking-wide">Customizable Variables:</h3>
                  <div className="flex flex-wrap gap-2">
                    {prompt.variables.map((variable, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-[#F3E5AB] border border-amber-300 rounded-full text-purple-900 text-sm font-semibold shadow-sm"
                      >
                        [{variable}]
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Prompt Box (The Crown Jewel) */}
              <div className="relative mb-8">
                <div className="bg-gradient-to-br from-[#2d1560] to-[#8b5cf6] rounded-2xl border border-purple-500/30 p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-bold text-lg uppercase tracking-wide flex items-center gap-2">
                      <span>✨ The Prompt</span>
                    </h3>
                    {isUnlocked && (
                      <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-4 py-2 bg-[#F3E5AB] hover:bg-[#F0DFA0] border border-amber-300 rounded-full text-purple-900 font-bold text-sm transition-all shadow-md hover:shadow-lg"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4" />
                            Copied!
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
                      // ✅ UNLOCKED: Full height, auto-expand, no blur
                      <div className="bg-black/30 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                        <p className="text-white leading-relaxed font-mono text-sm whitespace-pre-wrap">
                          {prompt.prompt_text}
                        </p>
                      </div>
                    ) : (
                      // 🔒 LOCKED: Fixed height (h-32), blur text, gradient overlay
                      <div className="relative h-32 overflow-hidden bg-black/30 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                        <p className="text-white leading-relaxed font-mono text-sm whitespace-pre-wrap blur-md select-none">
                          {prompt.prompt_text}
                        </p>
                        
                        {/* Heavy Blur Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#2d1560]/80 to-[#8b5cf6] flex items-end justify-center pb-4 rounded-xl">
                          <div className="flex flex-col items-center gap-2">
                            <Lock className="w-10 h-10 text-[#F3E5AB] drop-shadow-lg animate-pulse" />
                            <span className="text-[#F3E5AB] font-bold text-sm">Unlock to View</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex gap-4">
                {!isUnlocked ? (
                  <motion.button
                    onClick={handleUnlock}
                    disabled={unlocking}
                    className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 hover:from-purple-500 hover:via-purple-400 hover:to-purple-500 rounded-2xl text-white font-bold text-lg transition-all hover:shadow-2xl hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed border border-purple-400/50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {unlocking ? (
                      <>
                        <Loader className="w-6 h-6 animate-spin" />
                        Unlocking...
                      </>
                    ) : (
                      <>
                        <Lock className="w-6 h-6" />
                        🔓 Unlock Prompt ({prompt.cost} Credits)
                      </>
                    )}
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={handleCopy}
                    className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-[#F3E5AB] hover:bg-[#F0DFA0] border border-amber-300 rounded-2xl text-purple-900 font-bold text-lg transition-all hover:shadow-2xl hover:shadow-amber-300/50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {copied ? (
                      <>
                        <Check className="w-6 h-6" />
                        ✅ Copied to Clipboard!
                      </>
                    ) : (
                      <>
                        <Copy className="w-6 h-6" />
                        📋 Copy Prompt
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptDetail;
