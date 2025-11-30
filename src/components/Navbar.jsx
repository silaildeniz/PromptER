import { Sparkles, User, LogOut, Plus, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useRef, useEffect } from 'react';
import CreditModal from './CreditModal';
import { AI_NAV_ITEMS } from '../data/aiNavigation';

const Navbar = ({ onFilterChange }) => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [hoveredTool, setHoveredTool] = useState(null);
  const dropdownRef = useRef(null);
  const toolDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (toolDropdownRef.current && !toolDropdownRef.current.contains(event.target)) {
        setHoveredTool(null);
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

  const handleToolClick = (tool, type) => {
    setHoveredTool(null);
    if (onFilterChange) {
      onFilterChange({ tool: tool.id, type });
    }
  };

  const handleShowAll = () => {
    if (onFilterChange) {
      onFilterChange({ tool: null, type: null });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-navy-900/50 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">PromptER</span>
          </Link>

          {/* AI Tools Navigation - Center */}
          <div className="hidden md:flex flex-1 items-center justify-center gap-1 mx-8">
            {/* Show All Button */}
            <button
              onClick={handleShowAll}
              className="px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            >
              All
            </button>

            {/* AI Tool Items */}
            {AI_NAV_ITEMS.map((tool) => (
              <div
                key={tool.id}
                className="relative"
                onMouseEnter={() => setHoveredTool(tool.id)}
                onMouseLeave={() => setHoveredTool(null)}
                ref={hoveredTool === tool.id ? toolDropdownRef : null}
              >
                <button
                  className="px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-all flex items-center gap-1"
                >
                  {tool.label}
                  <ChevronDown className="w-3 h-3" />
                </button>

                {/* Dropdown for Media Types */}
                {hoveredTool === tool.id && (
                  <div className="absolute top-full left-0 mt-1 w-40 bg-navy-800 border border-white/10 rounded-lg shadow-2xl overflow-hidden z-50">
                    {tool.types.map((type) => (
                      <button
                        key={type}
                        onClick={() => handleToolClick(tool, type)}
                        className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-purple-500/20 hover:text-white transition-colors"
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
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
                    <div className="absolute right-0 mt-2 w-56 bg-navy-800 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                      <div className="p-4 border-b border-white/10">
                        <p className="text-white font-medium truncate">{user.email}</p>
                        <p className="text-slate-400 text-sm mt-1">{profile?.credits || 0} Credits</p>
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="w-full px-4 py-3 flex items-center gap-3 text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Sign In Button */}
                <Link
                  to="/login"
                  className="hidden sm:block px-4 py-2 text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>

                {/* Sign Up Button */}
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-lg text-white text-sm font-medium transition-all hover:shadow-lg hover:shadow-purple-500/25"
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

