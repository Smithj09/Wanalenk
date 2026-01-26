import React, { useState } from 'react';
import { Menu, X, LogOut, LayoutDashboard, Languages } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { APP_NAME, I18N } from '../constants';

const Navbar: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { currentUser, setCurrentUser, language, setLanguage } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const t = I18N[language].nav;

  // We use the Deep Navy (#00235b) and Sunset Orange (#f97316) from your logo
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button 
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-2"
            >
              <img 
                src="https://i.postimg.cc/VvCNb5b6/logo1.png" 
                alt={APP_NAME} 
                className="h-48 w-auto object-contain" 
              />
            </button>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => setLanguage(language === 'FR' ? 'KH' : 'FR')} 
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold hover:bg-slate-50 transition text-slate-700"
            >
              <Languages size={14} />
              {language === 'FR' ? 'Kreyòl' : 'Français'}
            </button>
            
            {/* Nav Links use the Navy color on hover */}
            <button onClick={() => onNavigate('marketplace')} className="text-slate-600 hover:text-[#00235b] font-medium transition-colors">{t.marketplace}</button>
            <button onClick={() => onNavigate('jobs')} className="text-slate-600 hover:text-[#00235b] font-medium transition-colors">{t.jobs}</button>
            
            {currentUser ? (
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => onNavigate('dashboard')}
                  className="flex items-center gap-2 px-4 py-2 bg-[#00235b]/10 text-[#00235b] rounded-full font-medium hover:bg-[#00235b]/20 transition"
                >
                  <LayoutDashboard size={18} />
                  {t.dashboard}
                </button>
                <button 
                  onClick={() => setCurrentUser(null)}
                  className="p-2 text-slate-400 hover:text-rose-500 transition"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => onNavigate('login')}
                  className="px-4 py-2 text-slate-600 font-medium hover:text-[#00235b]"
                >
                  {t.login}
                </button>
                {/* Register button uses the Orange from the logo */}
                <button 
                  onClick={() => onNavigate('register')}
                  className="px-5 py-2 bg-[#f97316] text-white rounded-lg font-bold hover:bg-[#ea580c] shadow-sm transition-all active:scale-95"
                >
                  {t.register}
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-600">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 p-4 space-y-4">
          <button onClick={() => { setLanguage(language === 'FR' ? 'KH' : 'FR'); setIsOpen(false); }} className="flex items-center gap-2 w-full text-left p-2 text-[#00235b] font-bold">
            <Languages size={18} />
            {language === 'FR' ? 'Kreyòl' : 'Français'}
          </button>
          <button onClick={() => { onNavigate('marketplace'); setIsOpen(false); }} className="block w-full text-left p-2 text-slate-600 font-medium">{t.marketplace}</button>
          <button onClick={() => { onNavigate('jobs'); setIsOpen(false); }} className="block w-full text-left p-2 text-slate-600 font-medium">{t.jobs}</button>
          {currentUser ? (
            <>
              <button onClick={() => { onNavigate('dashboard'); setIsOpen(false); }} className="block w-full text-left p-2 text-[#00235b] font-bold">{t.dashboard}</button>
              <button onClick={() => { setCurrentUser(null); setIsOpen(false); }} className="block w-full text-left p-2 text-rose-500 font-medium">Logout</button>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
              <button onClick={() => { onNavigate('login'); setIsOpen(false); }} className="block w-full p-3 text-center border border-[#00235b] text-[#00235b] rounded-lg font-bold">{t.login}</button>
              <button onClick={() => { onNavigate('register'); setIsOpen(false); }} className="block w-full p-3 text-center bg-[#f97316] text-white rounded-lg font-bold">{t.register}</button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;