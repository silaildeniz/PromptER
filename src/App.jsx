import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import PromptCard from './components/PromptCard';
import { MOCK_PROMPTS } from './data/mockData';

function App() {
  const [selectedFilter, setSelectedFilter] = useState('All');

  // Filter prompts based on selected filter
  const filteredPrompts = selectedFilter === 'All' 
    ? MOCK_PROMPTS 
    : MOCK_PROMPTS.filter(prompt => prompt.type === selectedFilter);

  return (
    <div className="min-h-screen bg-navy-900">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <Hero 
        selectedFilter={selectedFilter} 
        onFilterChange={setSelectedFilter} 
      />

      {/* Infinite Marquee */}
      <Marquee />

      {/* Prompts Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            {selectedFilter === 'All' ? 'Featured Prompts' : `${selectedFilter} Prompts`}
          </h2>
          <p className="text-slate-400">
            {filteredPrompts.length} {filteredPrompts.length === 1 ? 'prompt' : 'prompts'} available
          </p>
        </div>

        {/* Prompts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>

        {/* No Results Message */}
        {filteredPrompts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-400 text-lg">
              No prompts found for this category.
            </p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-400 text-sm">
              © 2025 PromptER. Premium AI Prompts Marketplace.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">
                Terms
              </a>
              <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">
                Privacy
              </a>
              <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

