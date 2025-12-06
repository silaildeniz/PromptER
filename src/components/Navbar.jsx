import { Sparkles, User, LogOut, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useRef, useEffect } from 'react';
import CreditModal from './CreditModal';

// CONSTANTS: AI Models and Styles (Source of Truth)
const AI_MODELS_LIST = [
  "ChatGPT Image", "Claude", "Dall-E", "Deepseek", "Flux", "Gemini",
  "Gemini Image", "ChatGPT", "Grok", "Grok Image", "Hailou AI", "Hunyuan",
  "Ideogram", "Imagen", "Kling AI", "Leonardo AI", "Llama", "Midjourney",
  "Qwen Image", "Recraft", "Seedance", "Seedream", "Sora", "Stable Diffusion",
  "Veo", "Wan", "Midjourney Video"
];

const STYLE_TAGS = [
  "3D", "Abstract", "Accesory", "Animal", "Anime", "Art", "Avatar", "Architecture",
  "Cartoon", "Celebrity", "Clothing", "Clip Art", "Cute", "Cyberpunk", "Drawing",
  "Drink", "Fantasy", "Fashion", "Food", "Future", "Gaming", "Glass", "Graphic Design",
  "Holiday", "Icon", "Ink", "Interior Illustration", "Jewelry", "Landscape", "Logo",
  "Mockup", "Monogram", "Monster", "Nature", "Pattern", "Painting", "People",
  "Photographic", "Pixel Art", "Poster", "Product", "Psychedelic", "Retro", "Scary",
  "Space", "Steampunk", "Statue", "Sticker", "Unique Style", "Synthwave", "Texture",
  "Vehicle", "Wallpaper"
];

// ART DATA (Hierarchical Structure)
const ART_PARENTS = ["Anime", "Cartoon", "Painting", "Illustration"];
const ART_HIERARCHY = {
  "Anime": ["All", "Fantasy", "Landscapes"],
  "Cartoon": ["Animal", "Food", "People"],
  "Painting": ["Animals", "Nature", "People", "Landscapes"],
  "Illustration": ["Animals", "Food and Drink", "Nature"]
};

// LOGO DATA
const LOGO_PARENTS = ["Logo Designs", "Icon Designs"];
const LOGO_DATA = {
  "Logo Designs": ["3D", "Animal", "Business Startup", "Cartoon", "Cute", "Food", "Lettered", "Hand-Drawn", "Minimalist", "Modern", "Painted", "Styled"],
  "Icon Designs": ["3D", "Animal", "Clip", "Cute", "Flat Graphic", "Pixel Art", "UI", "Video Games"]
};

// GRAPHICS DATA
const GRAPHIC_PARENTS = ["Product", "Productivity", "Writing", "Games"];
const GRAPHIC_DATA = {
  "Product": ["Book Cover", "Cards", "Coloring Books", "Laser", "Posters", "Stickers", "Tshirt Print", "Tattoos", "UX/UI"],
  "Productivity": ["Coaching", "Health Fitness", "Food Diet", "Planing", "Meditation", "Studying"],
  "Writing": ["Email", "Translation", "Music", "Coding"],
  "Games": ["Games General"]
};

const Navbar = ({ onFilterChange }) => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState(null); // Tracks which menu is open
  
  // Active parent states for each split-view menu
  const [activeModel, setActiveModel] = useState('ChatGPT Image');
  const [activeArtParent, setActiveArtParent] = useState('Anime');
  const [activeLogoParent, setActiveLogoParent] = useState('Logo Designs');
  const [activeGraphicParent, setActiveGraphicParent] = useState('Product');
  
  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null); // Grace period timeout
  
  // Helper function to slugify text (e.g., "ChatGPT Image" -> "chatgpt-image")
  const slugify = (text) => {
    return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setShowDropdown(false);
    navigate('/');
  };

  // GRACE PERIOD HANDLERS (Gap-Proof Hover Logic)
  const handleMenuEnter = (menuName) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    // Set active menu immediately
    setHoveredMenu(menuName);
    
    // Reset active states based on menu
    if (menuName === 'MODELS') {
      setActiveModel(AI_MODELS_LIST[0]);
    } else if (menuName === 'ART') {
      setActiveArtParent(ART_PARENTS[0]);
    } else if (menuName === 'LOGO') {
      setActiveLogoParent(LOGO_PARENTS[0]);
    } else if (menuName === 'GRAPHICS') {
      setActiveGraphicParent(GRAPHIC_PARENTS[0]);
    }
  };

  const handleMenuLeave = () => {
    // Don't close immediately - set a grace period
    timeoutRef.current = setTimeout(() => {
      setHoveredMenu(null);
    }, 200); // 200ms grace period
  };

  // Unified navigation helper for dropdown items
  const handleNavigation = (key, value, subKey = null, subValue = null) => {
    const params = new URLSearchParams();
    if (key && value) params.set(key, slugify(value));
    if (subKey && subValue) params.set(subKey, slugify(subValue));
    navigate(`/?${params.toString()}`, { replace: false });
    if (onFilterChange) {
      onFilterChange({
        [key]: slugify(value),
        ...(subKey && subValue ? { [subKey]: slugify(subValue) } : {})
      });
    }
    setHoveredMenu(null);
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
  };


  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 border-b border-nude-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-purple-900">PromptER</span>
          </Link>

          {/* CENTERED FIXED MEGA MENUS - Center */}
          <div className="hidden md:flex flex-1 items-center justify-center gap-1 mx-8">

            {/* MODELS - Split-View Mega Menu */}
            <div
              className="relative group"
              onMouseEnter={() => handleMenuEnter('MODELS')}
              onMouseLeave={handleMenuLeave}
            >
              {/* MODELS Trigger Button */}
              <button className="px-4 py-2 text-sm text-purple-900 hover:text-purple-950 bg-white/60 hover:bg-white/80 border border-purple-200 hover:border-purple-300 rounded-lg transition-all flex items-center gap-1 font-semibold">
                MODELS
                <ChevronDown className={`w-3 h-3 transition-transform ${hoveredMenu === 'MODELS' ? 'rotate-180' : ''}`} />
              </button>

              {/* Split-View Mega Menu (Centered Fixed) */}
              {hoveredMenu === 'MODELS' && (
                <div 
                  className="fixed left-1/2 -translate-x-1/2 top-[65px] z-[9999]"
                  onMouseEnter={() => handleMenuEnter('MODELS')}
                  onMouseLeave={handleMenuLeave}
                >
                  {/* Large Container: 900px × 600px */}
                  <div className="bg-[#F5E6D3] border border-nude-300 shadow-2xl rounded-xl w-[900px] h-[600px] flex overflow-hidden">
                    
                    {/* LEFT COLUMN: AI Models (1/3 width) */}
                    <div className="w-1/3 border-r border-gray-800 overflow-y-auto custom-scrollbar">
                      {AI_MODELS_LIST.map((model) => (
                        <button
                          key={model}
                          onMouseEnter={() => setActiveModel(model)}
                          onClick={() => handleNavigation('model', model)}
                          className={`w-full text-left px-4 py-3 text-sm transition-all border-l-4 ${
                            activeModel === model
                              ? 'bg-purple-500/10 text-purple-400 border-purple-500'
                              : 'bg-transparent text-purple-900 hover:text-purple-950 hover:bg-purple-100/70 border-transparent'
                          }`}
                        >
                          {model}
                        </button>
                      ))}
                    </div>

                    {/* RIGHT COLUMN: Styles (2/3 width) */}
                    <div className="w-2/3 flex flex-col">
                      {/* Header */}
                      <div className="px-6 py-4 border-b border-gray-800">
                        <h3 className="text-nude-900 font-semibold text-sm uppercase tracking-wide">
                          Select Style for: <span className="text-purple-400">{activeModel}</span>
                        </h3>
                      </div>

                      {/* Styles Grid */}
                      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                        <div className="grid grid-cols-3 gap-3">
                          {STYLE_TAGS.map((style) => (
                            <button
                              key={style}
                              onClick={() => handleNavigation('model', activeModel, 'category', style)}
                              className="text-left px-4 py-3 text-sm text-purple-700 hover:text-purple-900 hover:bg-purple-100/50 rounded-lg transition-all border border-transparent hover:border-purple-500/30"
                            >
                              {style}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ART - Split-View Mega Menu */}
            <div
              className="relative group"
              onMouseEnter={() => handleMenuEnter('ART')}
              onMouseLeave={handleMenuLeave}
            >
              <button className="px-4 py-2 text-sm text-purple-900 hover:text-purple-950 bg-white/60 hover:bg-white/80 border border-purple-200 hover:border-purple-300 rounded-lg transition-all flex items-center gap-1 font-semibold">
                ART
                <ChevronDown className={`w-3 h-3 transition-transform ${hoveredMenu === 'ART' ? 'rotate-180' : ''}`} />
              </button>

              {hoveredMenu === 'ART' && (
                <div 
                  className="fixed left-1/2 -translate-x-1/2 top-[65px] z-[9999]"
                  onMouseEnter={() => handleMenuEnter('ART')}
                  onMouseLeave={handleMenuLeave}
                >
                  <div className="bg-[#F5E6D3] border border-nude-300 shadow-2xl rounded-xl w-[900px] h-[600px] flex overflow-hidden">
                    {/* LEFT: Art Categories */}
                    <div className="w-1/3 border-r border-gray-800 overflow-y-auto custom-scrollbar">
                      {ART_PARENTS.map((artParent) => (
                        <button
                          key={artParent}
                          onMouseEnter={() => setActiveArtParent(artParent)}
                          onClick={() => handleNavigation('category', artParent)}
                          className={`w-full text-left px-4 py-3 text-sm transition-all border-l-4 ${
                            activeArtParent === artParent
                              ? 'bg-purple-500/10 text-purple-400 border-purple-500'
                              : 'bg-transparent text-purple-900 hover:text-purple-950 hover:bg-purple-100/70 border-transparent'
                          }`}
                        >
                          {artParent}
                        </button>
                      ))}
                    </div>

                    {/* RIGHT: Styles */}
                    <div className="w-2/3 flex flex-col">
                      <div className="px-6 py-4 border-b border-gray-800">
                        <h3 className="text-nude-900 font-semibold text-sm uppercase tracking-wide">
                          Select Style for: <span className="text-purple-400">{activeArtParent}</span>
                        </h3>
                      </div>
                      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                        <div className="grid grid-cols-3 gap-3">
                          {ART_HIERARCHY[activeArtParent]?.map((subCategory) => (
                            <button
                              key={subCategory}
                              onClick={() => handleNavigation('category', subCategory)}
                              className="text-left px-4 py-3 text-sm text-purple-700 hover:text-purple-900 hover:bg-purple-100/50 rounded-lg transition-all border border-transparent hover:border-purple-500/30"
                            >
                              {subCategory}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* LOGO - Split-View Mega Menu */}
            <div
              className="relative group"
              onMouseEnter={() => handleMenuEnter('LOGO')}
              onMouseLeave={handleMenuLeave}
            >
              <button className="px-4 py-2 text-sm text-purple-900 hover:text-purple-950 bg-white/60 hover:bg-white/80 border border-purple-200 hover:border-purple-300 rounded-lg transition-all flex items-center gap-1 font-semibold">
                LOGO
                <ChevronDown className={`w-3 h-3 transition-transform ${hoveredMenu === 'LOGO' ? 'rotate-180' : ''}`} />
              </button>

              {hoveredMenu === 'LOGO' && (
                <div 
                  className="fixed left-1/2 -translate-x-1/2 top-[65px] z-[9999]"
                  onMouseEnter={() => handleMenuEnter('LOGO')}
                  onMouseLeave={handleMenuLeave}
                >
                  <div className="bg-[#F5E6D3] border border-nude-300 shadow-2xl rounded-xl w-[900px] h-[600px] flex overflow-hidden">
                    {/* LEFT: Logo Types */}
                    <div className="w-1/3 border-r border-gray-800 overflow-y-auto custom-scrollbar">
                      {LOGO_PARENTS.map((logoParent) => (
                        <button
                          key={logoParent}
                          onMouseEnter={() => setActiveLogoParent(logoParent)}
                          className={`w-full text-left px-4 py-3 text-sm transition-all border-l-4 ${
                            activeLogoParent === logoParent
                              ? 'bg-purple-500/10 text-purple-400 border-purple-500'
                              : 'bg-transparent text-purple-900 hover:text-purple-950 hover:bg-purple-100/70 border-transparent'
                          }`}
                        >
                          {logoParent}
                        </button>
                      ))}
                    </div>

                    {/* RIGHT: Logo Options */}
                    <div className="w-2/3 flex flex-col">
                      <div className="px-6 py-4 border-b border-gray-800">
                        <h3 className="text-nude-900 font-semibold text-sm uppercase tracking-wide">
                          Select Type: <span className="text-purple-400">{activeLogoParent}</span>
                        </h3>
                      </div>
                      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                        <div className="grid grid-cols-3 gap-3">
                          {LOGO_DATA[activeLogoParent]?.map((item) => (
                            <button
                              key={item}
                              onClick={() => handleNavigation('category', item)}
                              className="text-left px-4 py-3 text-sm text-purple-700 hover:text-purple-900 hover:bg-purple-100/50 rounded-lg transition-all border border-transparent hover:border-purple-500/30"
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* GRAPHICS - Split-View Mega Menu */}
            <div
              className="relative group"
              onMouseEnter={() => handleMenuEnter('GRAPHICS')}
              onMouseLeave={handleMenuLeave}
            >
              <button className="px-4 py-2 text-sm text-purple-900 hover:text-purple-950 bg-white/60 hover:bg-white/80 border border-purple-200 hover:border-purple-300 rounded-lg transition-all flex items-center gap-1 font-semibold">
                GRAPHICS
                <ChevronDown className={`w-3 h-3 transition-transform ${hoveredMenu === 'GRAPHICS' ? 'rotate-180' : ''}`} />
              </button>

              {hoveredMenu === 'GRAPHICS' && (
                <div 
                  className="fixed left-1/2 -translate-x-1/2 top-[65px] z-[9999]"
                  onMouseEnter={() => handleMenuEnter('GRAPHICS')}
                  onMouseLeave={handleMenuLeave}
                >
                  <div className="bg-[#F5E6D3] border border-nude-300 shadow-2xl rounded-xl w-[900px] h-[600px] flex overflow-hidden">
                    {/* LEFT: Graphic Categories */}
                    <div className="w-1/3 border-r border-gray-800 overflow-y-auto custom-scrollbar">
                      {GRAPHIC_PARENTS.map((graphicParent) => (
                        <button
                          key={graphicParent}
                          onMouseEnter={() => setActiveGraphicParent(graphicParent)}
                          className={`w-full text-left px-4 py-3 text-sm transition-all border-l-4 ${
                            activeGraphicParent === graphicParent
                              ? 'bg-purple-500/10 text-purple-400 border-purple-500'
                              : 'bg-transparent text-purple-900 hover:text-purple-950 hover:bg-purple-100/70 border-transparent'
                          }`}
                        >
                          {graphicParent}
                        </button>
                      ))}
                    </div>

                    {/* RIGHT: Graphic Options */}
                    <div className="w-2/3 flex flex-col">
                      <div className="px-6 py-4 border-b border-gray-800">
                        <h3 className="text-nude-900 font-semibold text-sm uppercase tracking-wide">
                          Select Type: <span className="text-purple-400">{activeGraphicParent}</span>
                        </h3>
                      </div>
                      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                        <div className="grid grid-cols-3 gap-3">
                          {GRAPHIC_DATA[activeGraphicParent]?.map((item) => (
                            <button
                              key={item}
                              onClick={() => handleNavigation('category', item)}
                              className="text-left px-4 py-3 text-sm text-purple-700 hover:text-purple-900 hover:bg-purple-100/50 rounded-lg transition-all border border-transparent hover:border-purple-500/30"
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {/* Clickable Credits Badge */}
                <button
                  onClick={() => setShowCreditModal(true)}
                  className="px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 hover:border-purple-500/50 hover:scale-105 hover:bg-purple-500/10 transition-all cursor-pointer group"
                  title="Click to earn more credits"
                >
                  <div className="flex items-center gap-2">
                    <Plus className="w-3.5 h-3.5 text-purple-400 group-hover:text-purple-300 transition-colors" />
                    <span className="text-sm font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                      {profile?.credits || 0} Cr
                    </span>
                  </div>
                </button>

                {/* User Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                  >
                    <User className="w-5 h-5 text-white" />
                  </button>

                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-64 bg-navy-800 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                      {/* User Header */}
                      <div className="p-4 border-b border-white/10 bg-gradient-to-r from-purple-900/50 to-navy-800">
                        <p className="text-white font-bold text-lg truncate">
                          {profile?.username || user.user_metadata?.username || user.email?.split('@')[0]}
                        </p>
                        <p className="text-slate-400 text-sm truncate">{user.email}</p>
                        <p className="text-purple-400 text-sm mt-1 font-medium">{profile?.credits || 0} Credits</p>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        {/* My Library */}
                        <Link
                          to="/library"
                          onClick={() => setShowDropdown(false)}
                          className="w-full px-4 py-3 flex items-center gap-3 text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                        >
                          <span className="text-lg">🔓</span>
                          My Library
                        </Link>

                        {/* Admin Panel - Conditional */}
                        {profile?.role === 'admin' && (
                          <Link
                            to="/admin/upload"
                            onClick={() => setShowDropdown(false)}
                            className="w-full px-4 py-3 flex items-center gap-3 text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                          >
                            <span className="text-lg">⚡</span>
                            Admin Panel
                          </Link>
                        )}

                        {/* Divider */}
                        <div className="my-2 border-t border-white/10" />

                        {/* Sign Out */}
                        <button
                          onClick={handleSignOut}
                          className="w-full px-4 py-3 flex items-center gap-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Sign In Button */}
                <Link
                  to="/login"
                  className="hidden sm:block px-4 py-2 text-purple-700 hover:text-purple-900 transition-colors"
                >
                  Sign In
                </Link>

                {/* Sign Up Button */}
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-lg text-white text-sm font-medium transition-all hover:shadow-lg hover:shadow-purple-600/25"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Credit Modal */}
      <CreditModal 
        isOpen={showCreditModal} 
        onClose={() => setShowCreditModal(false)} 
      />
    </nav>
  );
};

export default Navbar;

