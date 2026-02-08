'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [companyName, setCompanyName] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;

    // Navigate to dashboard immediately with processing state
    router.push(`/dashboard?company=${encodeURIComponent(companyName)}&processing=true`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2d2420] to-[#1a1a1a] relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]"></div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center px-8 py-6">
        <h1 className="text-3xl font-bold text-white tracking-tight">GameReel</h1>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 py-20 flex flex-col items-center justify-center min-h-[80vh]">
        {/* Hero Text */}
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-7xl md:text-8xl font-bold text-white leading-tight mb-8 tracking-tight">
            Super Bowl Clips<br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              That Drive Engagement
            </span>
          </h2>
          <p className="text-2xl text-white/70 mb-12 leading-relaxed max-w-2xl mx-auto">
            Transform epic Super Bowl moments from ESPN NFL into viral-ready reels for your brand in minutes.
          </p>
          
          {/* CTA Form */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 mb-12 max-w-2xl mx-auto">
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter your company name"
              className="flex-1 px-8 py-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all text-lg"
            />
            <button
              type="submit"
              disabled={!companyName.trim()}
              className="px-10 py-5 rounded-2xl bg-white text-black font-bold hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap text-lg shadow-2xl"
            >
              Get Started →
            </button>
          </form>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center items-center gap-12 text-white/40 text-sm">
            <span>Powered by ESPN NFL clips</span>
            <span>•</span>
            <span>Instant delivery</span>
            <span>•</span>
            <span>Cloud storage</span>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-8 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
            <div className="text-4xl mb-4">⚡</div>
            <h4 className="text-xl font-semibold text-white mb-3">Lightning Fast</h4>
            <p className="text-white/60">Get your Super Bowl reels processed and ready to download in minutes.</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
            <div className="text-4xl mb-4">🏈</div>
            <h4 className="text-xl font-semibold text-white mb-3">ESPN NFL Content</h4>
            <p className="text-white/60">Access official ESPN NFL footage and highlights from the biggest games.</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
            <div className="text-4xl mb-4">☁️</div>
            <h4 className="text-xl font-semibold text-white mb-3">Cloud Storage</h4>
            <p className="text-white/60">All your reels stored securely in the cloud, accessible anytime.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">© 2026 GameReel. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-white/40">
            <span>Built for brands that win</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
