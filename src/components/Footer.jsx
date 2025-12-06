import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-purple-200 bg-[#F5E6D3] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Simple Footer Content */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-purple-900">PromptER</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <Link to="/terms" className="text-sm text-purple-700 hover:text-purple-900 transition-colors">
              Terms of Service
            </Link>
            <Link to="/privacy" className="text-sm text-purple-700 hover:text-purple-900 transition-colors">
              Privacy Policy
            </Link>
            <a href="mailto:support@prompter.com" className="text-sm text-purple-700 hover:text-purple-900 transition-colors">
              Contact
            </a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-purple-600">
            © 2025 PromptER
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
