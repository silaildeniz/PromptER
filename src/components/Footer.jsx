import { Sparkles, Mail, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-white/5 bg-navy-900/50 backdrop-blur-xl mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">PromptER</span>
            </div>
            <p className="text-sm text-slate-400 mb-4">
              Accelerate your work with professional AI prompts. Create agency-quality content.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a href="#" className="w-8 h-8 rounded-lg bg-navy-800 hover:bg-purple-600 flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4 text-slate-400 hover:text-white" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-navy-800 hover:bg-purple-600 flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4 text-slate-400 hover:text-white" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-navy-800 hover:bg-purple-600 flex items-center justify-center transition-colors">
                <Linkedin className="w-4 h-4 text-slate-400 hover:text-white" />
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Explore Prompts</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Categories</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Popular Prompts</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">New Arrivals</a></li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Refund Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-400">
            © 2025 PromptER. All rights reserved.
          </p>
          <p className="text-sm text-slate-400 flex items-center gap-1">
            Made with <span className="text-red-500">❤️</span> in Turkey
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

