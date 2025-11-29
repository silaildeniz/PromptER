const Hero = () => {
  return (
    <div className="relative pt-24 pb-8 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Gradient Blob */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br from-purple-600/30 via-blue-600/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative max-w-4xl mx-auto text-center">
        {/* Main Heading */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
          <span className="gradient-text">Perfect Prompts</span>
          <br />
          <span className="text-white">for AI</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto">
          Discover premium prompts for Midjourney, ChatGPT, and more. 
          Save time and create stunning results instantly.
        </p>
      </div>
    </div>
  );
};

export default Hero;

