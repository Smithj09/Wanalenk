import React from 'react';
import { Search, ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react';
import { CATEGORIES, I18N, APP_NAME } from '../constants';
import { useApp } from '../context/AppContext';
import Footer from '../components/Footer';

const LandingPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { jobs, language } = useApp();

  const h = I18N[language].hero;
  const l = I18N[language].landing;
  const catLabels = I18N[language].categories;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section - Using Primary Navy for background */}
      <section className="relative bg-primary-navy py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          {/* Subtle Orange glow in the background to match logo flair */}
          <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-primary-orange rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-info rounded-full blur-[120px]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight">
            
            <div className="flex items-center justify-center ">
                    <h1 className="text-5xl sm:text-4xl md:text-7xl lg:text-7xl font-extrabold text-white tracking-tight">
                    WanaLenk
                    </h1>
            </div>
            
            
            
             <br/>
            <span className="text-primary-orange">{h.title}</span>
          </h1>
          <p className="text-xl text-neutral-100/80 max-w-2xl mx-auto mb-10">
            {h.tagline}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => onNavigate('register')}
              className="btn-primary w-full sm:w-auto"
            >
              {h.ctaPrimary}
            </button>
            <button 
              onClick={() => onNavigate('login')}
              className="w-full sm:w-auto px-8 py-4 bg-white/10 text-white border border-white/20 backdrop-blur-md rounded-xl font-bold text-lg hover:bg-white/20 transition"
            >
              {h.ctaSecondary}
            </button>
          </div>

          {/* <div className="mt-16 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md p-2 rounded-2xl flex items-center border border-white/20">
              <div className="pl-4 text-blue-200"><Search size={20} /></div>
              <input 
                type="text" 
                placeholder={h.searchPlaceholder} 
                className="flex-1 bg-transparent border-none text-white px-4 py-3 focus:ring-0 placeholder-blue-200/50"
              />
              <button className="bg-[#f97316] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#ea580c]">Search</button>
            </div>
          </div> */}

              <div className="mt-16 max-w-3xl mx-auto px-4">
  {/* The 'flex-col' stacks them on mobile; 'sm:flex-row' puts them in a line on desktop */}
  <div className="bg-white/10 backdrop-blur-md p-2 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center border border-white/20 gap-3">
    
    <div className="flex items-center flex-1">
      <div className="pl-4 text-blue-200"><Search size={20} /></div>
      <input 
        type="text" 
        placeholder={h.searchPlaceholder} 
        className="w-full bg-transparent border-none text-white px-4 py-3 focus:ring-0 placeholder-blue-200/50"
      />
    </div>

    <button 
      className="w-full sm:w-auto px-10 py-3 bg-[#f97316] text-white rounded-xl font-bold hover:bg-[#ea580c] transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2"
    >
      <Search size={18} />
      {language === 'FR' ? 'Rechercher' : 'Chèche'}
    </button>
    
  </div>
</div>




        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary-navy mb-4">{l.explore}</h2>
            <p className="text-neutral-600">{l.exploreSub}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
            {CATEGORIES.map((cat, i) => (
              <button 
                key={i}
                className="card-hover flex flex-col items-center p-6 group"
              >
                <div className="mb-4 p-3 rounded-xl group-hover:bg-primary-navy group-hover:text-white transition-all">
                  {cat.icon}
                </div>
                <span className="font-semibold text-neutral-700 text-sm group-hover:text-primary-navy">{catLabels[cat.label]}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Opportunities Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-[#00235b] mb-2">{l.opportunities}</h2>
              <p className="text-slate-600">{l.opportunitiesSub}</p>
            </div>
            <button 
              onClick={() => onNavigate('jobs')}
              className="text-[#f97316] font-bold flex items-center gap-2 hover:gap-3 transition-all"
            >
              {l.viewAll} <ArrowRight size={20} />
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs.slice(0, 3).map((job) => (
              <div key={job.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-[#00235b]/20 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-[#00235b]/10 text-[#00235b] px-3 py-1 rounded-full text-xs font-bold uppercase">
                    {catLabels[job.category]}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-[#00235b] mb-1">{job.title}</h3>
                <p className="text-slate-500 text-sm mb-4">{job.institutionName}</p>
                <button 
                  onClick={() => onNavigate('login')}
                  className="w-full py-3 border border-slate-200 text-[#00235b] rounded-xl font-bold hover:bg-[#00235b] hover:text-white transition"
                >
                  {l.applyNow}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section - Themed Navy */}
      <section className="py-20 bg-primary-navy text-white">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="bg-white/10 text-primary-orange w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3">{l.trustPartners}</h3>
            <p className="text-neutral-100/70">{l.trustPartnersSub}</p>
          </div>
          <div className="text-center">
            <div className="bg-white/10 text-primary-orange w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Zap size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3">{l.trustFast}</h3>
            <p className="text-neutral-100/70">{l.trustFastSub}</p>
          </div>
          <div className="text-center">
            <div className="bg-white/10 text-primary-orange w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Globe size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3">{l.trustGlobal}</h3>
            <p className="text-neutral-100/70">{l.trustGlobalSub}</p>
          </div>
        </div>
      </section>

      {/* Professional Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;