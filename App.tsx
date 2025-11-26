import React, { useState, useEffect } from 'react';
import Background from './components/Background';
import Navigation from './components/Navigation';
import GlassCard from './components/GlassCard';
import ChatWidget from './components/ChatWidget';
import { NewsCategory, NewsResponse } from './types';
import { fetchSpaceNews } from './services/geminiService';
import { ArrowUpRight, Loader2, Info } from 'lucide-react';

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<NewsCategory>(NewsCategory.GENERAL);
  const [newsData, setNewsData] = useState<Record<NewsCategory, NewsResponse>>({
    [NewsCategory.GENERAL]: { content: '', sources: [], isLoading: true },
    [NewsCategory.ROCKETS]: { content: '', sources: [], isLoading: true },
    [NewsCategory.ASTRONOMY]: { content: '', sources: [], isLoading: true },
    [NewsCategory.ISS]: { content: '', sources: [], isLoading: true },
    [NewsCategory.MARS]: { content: '', sources: [], isLoading: true },
  });

  const loadNews = async (category: NewsCategory) => {
    // If we already have data and not loading, don't refetch immediately (simple cache)
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
    <div className="min-h-screen relative text-gray-100 selection:bg-cyan-500/30 selection:text-cyan-100">
      <Background />
      <Navigation activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <header className="mb-12 text-center relative">
           <div className="inline-block mb-4 px-4 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/30 text-cyan-400 text-xs font-display tracking-widest uppercase animate-pulse">
             System Status: Online
           </div>
           <h1 className="text-4xl md:text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 mb-4 tracking-tight">
             {activeCategory === NewsCategory.GENERAL ? 'DAILY BRIEFING' : activeCategory}
           </h1>
           <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base font-light">
             Gemini AIが{activeCategory}に関する最新ニュースを検索・解析し、リアルタイムでお届けします。
           </p>
        </header>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main News Feed (AI Generated) */}
          <div className="lg:col-span-8 space-y-6">
            <GlassCard className="min-h-[400px]">
              {currentNews.isLoading ? (
                <div className="h-full flex flex-col items-center justify-center space-y-4 py-20">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <Loader2 className="w-6 h-6 text-cyan-400 animate-pulse" />
                    </div>
                  </div>
                  <p className="text-cyan-400/80 font-display tracking-widest text-sm animate-pulse">CONNECTING TO DEEP SPACE NETWORK...</p>
                </div>
              ) : currentNews.error ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-20">
                  <Info className="w-12 h-12 text-red-400 mb-4" />
                  <p className="text-red-300 mb-2">通信エラーが発生しました</p>
                  <p className="text-sm text-gray-500">{currentNews.error}</p>
                  <button 
                    onClick={() => loadNews(activeCategory)}
                    className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm transition-colors"
                  >
                    再試行
                  </button>
                </div>
              ) : (
                <div className="space-y-6 animate-float" style={{ animationDuration: '0.5s', animationName: 'fadeIn' }}>
                  {/* Generated Text Content */}
                  <div className="prose prose-invert prose-lg max-w-none">
                    <div className="whitespace-pre-wrap leading-relaxed font-light text-gray-200">
                      {currentNews.content}
                    </div>
                  </div>
                </div>
              )}
            </GlassCard>
          </div>

          {/* Sidebar: Sources & Related */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Sources Widget */}
            <GlassCard className="lg:sticky lg:top-24">
              <h3 className="text-sm font-display font-bold text-gray-400 mb-4 uppercase tracking-wider flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Incoming Signals
              </h3>
              
              {currentNews.isLoading ? (
                 <div className="space-y-3">
                   {[1,2,3].map(i => (
                     <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse"></div>
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
                      className="group block p-3 rounded-xl bg-white/5 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-sm font-medium text-gray-200 group-hover:text-cyan-300 line-clamp-2">
                          {source.title}
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-cyan-400 flex-shrink-0 ml-2" />
                      </div>
                      <div className="mt-2 text-xs text-gray-600 group-hover:text-cyan-500/60 truncate font-mono">
                        {new URL(source.uri || '').hostname}
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 italic py-4">
                  No direct transmission signals detected.
                </div>
              )}
            </GlassCard>

            {/* Promo / Decor Card */}
            <div className="relative rounded-2xl overflow-hidden min-h-[200px] border border-white/10 group">
              <img 
                src="https://picsum.photos/400/300?grayscale&blur=2" 
                alt="Space Visual" 
                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                 <h4 className="font-display font-bold text-xl mb-1 text-white">FUTURE READY</h4>
                 <p className="text-xs text-gray-400">Join the exploration of the final frontier.</p>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-black/40 backdrop-blur-md py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-600 text-sm font-light">
            © 2024 U-SPACE. Powered by Google Gemini.
          </p>
        </div>
      </footer>

      <ChatWidget />
    </div>
  );
};

export default App;