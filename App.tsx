import React, { useState, useEffect } from 'react';
import Background from './components/Background';
import Navigation from './components/Navigation';
import GlassCard from './components/GlassCard';
import ChatWidget from './components/ChatWidget';
import { NewsCategory, NewsResponse } from './types';
import { fetchSpaceNews } from './services/geminiService';
import { ArrowUpRight, Loader2, AlertTriangle, Activity, Rocket } from 'lucide-react';

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<NewsCategory>(NewsCategory.GENERAL);
  const [stardate, setStardate] = useState<string>('');
  const [newsData, setNewsData] = useState<Record<NewsCategory, NewsResponse>>({
    [NewsCategory.GENERAL]: { content: '', sources: [], isLoading: true },
    [NewsCategory.ROCKETS]: { content: '', sources: [], isLoading: true },
    [NewsCategory.ASTRONOMY]: { content: '', sources: [], isLoading: true },
    [NewsCategory.ISS]: { content: '', sources: [], isLoading: true },
    [NewsCategory.MARS]: { content: '', sources: [], isLoading: true },
  });

  useEffect(() => {
    // Generate a pseudo stardate
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0].replace(/-/g, '.');
    const timeCode = Math.floor((now.getHours() * 60 + now.getMinutes()) / 14.4).toString().padStart(2, '0');
    setStardate(`SD ${dateStr} :: ${timeCode}`);
  }, []);

  const loadNews = async (category: NewsCategory) => {
    if (newsData[category].content && !newsData[category].isLoading) return;

    setNewsData(prev => ({
      ...prev,
      [category]: { ...prev[category], isLoading: true, error: undefined }
    }));

    try {
      const { text, sources } = await fetchSpaceNews(category);
      setNewsData(prev => ({
        ...prev,
        [category]: { content: text, sources, isLoading: false }
      }));
    } catch (error: any) {
      setNewsData(prev => ({
        ...prev,
        [category]: { ...prev[category], isLoading: false, error: error.message }
      }));
    }
  };

  useEffect(() => {
    loadNews(activeCategory);
  }, [activeCategory]);

  const currentNews = newsData[activeCategory];

  return (
    <div className="min-h-screen relative text-gray-100 selection:bg-cyan-500/30 selection:text-cyan-100 font-sans">
      <Background />
      <Navigation activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <header className="mb-12 relative border-l-2 border-cyan-500/50 pl-6 ml-2 md:ml-0">
           <div className="flex items-center gap-3 mb-2">
             <span className="text-cyan-500 font-mono text-xs tracking-widest">{stardate}</span>
             <div className="h-[1px] w-12 bg-cyan-500/30"></div>
             <span className="text-xs text-gray-400 uppercase tracking-wider flex items-center gap-1">
               <Activity size={10} className="text-green-500 animate-pulse" />
               Network Active
             </span>
           </div>
           
           <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-2 tracking-tighter uppercase">
             {activeCategory}
           </h1>
           <p className="text-gray-400 font-light text-sm md:text-base max-w-xl">
             AIが世界中のデータを解析。
             <span className="text-cyan-400 font-medium ml-1">
                {activeCategory === NewsCategory.GENERAL ? '全領域' : activeCategory}
             </span> 
             に関する最新インテリジェンスレポート。
           </p>
        </header>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main News Feed (AI Generated) */}
          <div className="lg:col-span-8 space-y-6">
            <GlassCard className="min-h-[500px] border-t-2 border-t-cyan-500/50">
              {currentNews.isLoading ? (
                <div className="h-full flex flex-col items-center justify-center space-y-6 py-24">
                  <div className="relative">
                    <div className="w-20 h-20 border-2 border-cyan-500/10 rounded-full"></div>
                    <div className="absolute inset-0 w-20 h-20 border-2 border-t-cyan-400 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-0 w-16 h-16 m-2 border-2 border-b-cyan-600 border-t-transparent border-l-transparent border-r-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <Loader2 className="w-6 h-6 text-cyan-400 animate-pulse" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-cyan-400 font-display tracking-[0.2em] text-sm animate-pulse">ESTABLISHING LINK</p>
                    <p className="text-xs text-cyan-500/50 mt-2 font-mono">Decrypting Signals...</p>
                  </div>
                </div>
              ) : currentNews.error ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-24">
                  <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
                    <AlertTriangle className="w-8 h-8 text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold text-red-200 mb-2">SIGNAL LOST</h3>
                  <p className="text-sm text-gray-400 mb-6 font-mono">{currentNews.error}</p>
                  <button 
                    onClick={() => loadNews(activeCategory)}
                    className="px-8 py-3 bg-red-900/30 hover:bg-red-900/50 border border-red-500/30 hover:border-red-500/60 rounded text-red-200 text-sm transition-all"
                  >
                    RECONNECT
                  </button>
                </div>
              ) : (
                <div className="animate-float" style={{ animationDuration: '0.5s', animationName: 'fadeIn' }}>
                  {/* Generated Text Content */}
                  <div className="prose prose-invert prose-lg max-w-none">
                    <div className="whitespace-pre-wrap leading-relaxed font-light text-gray-200 tracking-wide">
                      {currentNews.content}
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                     <span className="text-xs text-gray-600 font-mono">GENERATED BY GEMINI 2.5 FLASH</span>
                     <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/50"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/30"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/10"></div>
                     </div>
                  </div>
                </div>
              )}
            </GlassCard>
          </div>

          {/* Sidebar: Sources & Related */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Sources Widget */}
            <GlassCard className="lg:sticky lg:top-24 border-l-2 border-l-cyan-500/30">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-display font-bold text-cyan-400 uppercase tracking-widest">
                  Source Data
                </h3>
                <div className="text-[10px] bg-cyan-900/30 px-2 py-0.5 rounded text-cyan-300 border border-cyan-500/20">
                  {currentNews.sources.length} LINKS
                </div>
              </div>
              
              {currentNews.isLoading ? (
                 <div className="space-y-3 opacity-50">
                   {[1,2,3].map(i => (
                     <div key={i} className="h-14 bg-white/5 rounded animate-pulse border-l-2 border-transparent"></div>
                   ))}
                 </div>
              ) : currentNews.sources.length > 0 ? (
                <div className="space-y-3">
                  {currentNews.sources.map((source, idx) => (
                    <a 
                      key={idx}
                      href={source.uri}
                      target="_blank" 
                      rel="noreferrer"
                      className="group block p-3 rounded bg-white/5 hover:bg-cyan-500/5 border border-white/5 hover:border-cyan-500/30 transition-all duration-300 relative overflow-hidden"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-transparent group-hover:bg-cyan-500 transition-colors"></div>
                      <div className="flex items-start justify-between pl-2">
                        <span className="text-xs font-medium text-gray-300 group-hover:text-cyan-200 line-clamp-2 leading-relaxed">
                          {source.title}
                        </span>
                        <ArrowUpRight className="w-3 h-3 text-gray-600 group-hover:text-cyan-400 flex-shrink-0 ml-2 mt-0.5" />
                      </div>
                      <div className="mt-2 pl-2 text-[10px] text-gray-600 group-hover:text-cyan-500/60 truncate font-mono uppercase">
                        >> {new URL(source.uri || '').hostname}
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-gray-500 italic py-4 border border-dashed border-white/10 rounded p-4 text-center">
                  No direct transmission signals detected.
                </div>
              )}
            </GlassCard>

            {/* Decor Card */}
            <div className="relative rounded-2xl overflow-hidden min-h-[240px] border border-white/10 group grayscale hover:grayscale-0 transition-all duration-700">
              <img 
                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop" 
                alt="Orbit View" 
                className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
              
              {/* Scanline overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] opacity-20 pointer-events-none"></div>

              <div className="absolute bottom-0 left-0 p-6 w-full">
                 <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center mb-3 group-hover:border-cyan-400 transition-colors">
                    <Rocket className="w-4 h-4 text-white group-hover:text-cyan-400" />
                 </div>
                 <h4 className="font-display font-bold text-xl mb-1 text-white tracking-wide">NEXT FRONTIER</h4>
                 <div className="h-[1px] w-full bg-gradient-to-r from-cyan-500 to-transparent my-2 opacity-50"></div>
                 <p className="text-xs text-gray-400 font-light leading-relaxed">
                   人類は再び星の海へ。<br/>
                   アルテミス計画の最新動向をチェック。
                 </p>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#050505]/80 backdrop-blur-md py-10 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-4 opacity-50">
             <div className="w-1 h-1 bg-white rounded-full"></div>
             <div className="w-1 h-1 bg-white rounded-full"></div>
             <div className="w-1 h-1 bg-white rounded-full"></div>
          </div>
          <p className="text-gray-600 text-xs font-mono tracking-widest uppercase">
            U-SPACE ORBITAL NETWORK SYSTEM © 2024
          </p>
          <p className="text-gray-700 text-[10px] mt-2 font-light">
             Powered by Google Gemini 2.5
          </p>
        </div>
      </footer>

      <ChatWidget />
    </div>
  );
};

export default App;