import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { MOCK_PROMPTS } from '../data/mockData';
import { ArrowLeft, Star, Download, Lock, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const PromptDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [copied, setCopied] = useState(false);

  const prompt = MOCK_PROMPTS.find(p => p.id === parseInt(id));

  if (!prompt) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white">Prompt not found</p>
      </div>
    );
  }

  const handleUnlock = () => {
    // Here you would integrate with your payment/credit system
    setIsUnlocked(true);
  };

  const handleCopy = () => {
    if (isUnlocked) {
      navigator.clipboard.writeText(prompt.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getModelBadgeColor = () => {
    if (prompt.model.includes('Midjourney')) {
      return 'bg-gradient-to-r from-purple-500 to-pink-500';
    } else if (prompt.model.includes('DALL-E')) {
      return 'bg-gradient-to-r from-blue-500 to-cyan-500';
    } else if (prompt.model.includes('GPT')) {
      return 'bg-gradient-to-r from-green-500 to-emerald-500';
    }
    return 'bg-gradient-to-r from-purple-500 to-blue-500';
  };

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
          {/* Left Column - Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden border border-white/10">
              <img
                src={prompt.imageUrl}
                alt={prompt.title}
                className="w-full h-auto object-cover"
              />
              
              {/* Model Badge */}
              <div className={`absolute top-4 left-4 px-4 py-2 ${getModelBadgeColor()} rounded-lg shadow-lg`}>
                <span className="text-sm font-bold text-white">{prompt.model}</span>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div>
            {/* Category Badge */}
            <div className="inline-block px-3 py-1 bg-navy-800/50 rounded-lg border border-white/10 mb-4">
              <span className="text-sm text-slate-300">{prompt.category}</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-white mb-4">{prompt.title}</h1>

            {/* Author & Stats */}
            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600" />
                <span className="text-slate-300">{prompt.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-slate-300">{prompt.rating}</span>
              </div>
              <div className="text-slate-400 text-sm">
                {prompt.sales} sales
              </div>
            </div>

            {/* Description */}
            <p className="text-slate-300 mb-8 leading-relaxed">
              {prompt.description}
            </p>

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
                  <p className={`text-slate-300 leading-relaxed font-mono text-sm ${!isUnlocked ? 'blur-md select-none' : ''}`}>
                    {prompt.prompt}
                  </p>

                  {/* Unlock Overlay */}
                  {!isUnlocked && (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center bg-navy-900/80 backdrop-blur-md rounded-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <button
                        onClick={handleUnlock}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl text-white font-semibold transition-all hover:shadow-lg hover:shadow-purple-500/50"
                      >
                        <Lock className="w-5 h-5" />
                        Unlock ({prompt.price} Credits)
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              {!isUnlocked && (
                <button
                  onClick={handleUnlock}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl text-white font-semibold transition-all hover:shadow-lg hover:shadow-purple-500/50"
                >
                  <Download className="w-5 h-5" />
                  Purchase - {prompt.price} Credits
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

