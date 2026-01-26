import React from 'react';
import { ShoppingCart, Search, ArrowRight } from 'lucide-react';
import { I18N } from '../constants';
import { useApp } from '../context/AppContext';
import { Product } from '../types';

const BoutiquePage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { products, language } = useApp();

  const l = I18N[language].landing;
  const nav = I18N[language].nav;

  const handleAddToCart = (product: Product) => {
    // In a real app, this would add the product to the cart
    alert(`${product.name} has been added to your cart!`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-[#00235b] py-16 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{nav.marketplace}</h1>
          <p className="text-blue-100 max-w-3xl">
            Découvrez une variété de produits offerts par nos partenaires vérifiés dans votre ville.
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="bg-white py-6 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-slate-50 p-3 rounded-2xl flex items-center border border-slate-200">
            <div className="pl-4 text-slate-500"><Search size={20} /></div>
            <input 
              type="text" 
              placeholder="Rechercher des produits..." 
              className="flex-1 bg-transparent border-none text-slate-700 px-4 py-3 focus:ring-0 placeholder-slate-400"
            />
            <button className="bg-[#f97316] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#ea580c] transition-all active:scale-95 shadow-md flex items-center justify-center gap-2">
              <Search size={18} />
              {language === 'FR' ? 'Rechercher' : 'Chèche'}
            </button>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-[#00235b] mb-2">Nos Produits</h2>
              <p className="text-slate-600">Découvrez les derniers produits de nos partenaires vérifiés.</p>
            </div>
            <button 
              onClick={() => onNavigate('dashboard')}
              className="text-[#f97316] font-bold flex items-center gap-2 hover:gap-3 transition-all"
            >
              {l.viewAll} <ArrowRight size={20} />
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-[#00235b]/20 hover:shadow-md transition">
                <div className="mb-4 aspect-square rounded-xl overflow-hidden bg-slate-100">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-[#00235b] mb-2 line-clamp-2">{product.name}</h3>
                <p className="text-slate-500 text-sm mb-4 line-clamp-3">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-[#f97316]">{product.price.toFixed(2)} €</span>
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="bg-[#00235b] text-white p-3 rounded-xl hover:bg-[#00337d] transition"
                  >
                    <ShoppingCart size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {products.length === 0 && (
            <div className="text-center py-20">
              <div className="bg-slate-100 p-8 rounded-full w-32 h-32 mx-auto flex items-center justify-center mb-6">
                <ShoppingCart size={48} className="text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-700 mb-2">Aucun produit disponible</h3>
              <p className="text-slate-500 mb-8">Revenez plus tard pour découvrir nos nouveaux produits.</p>
              <button 
                onClick={() => onNavigate('landing')}
                className="bg-[#00235b] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#00337d] transition"
              >
                Retour à l'accueil
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-2xl font-bold text-white mb-6">WanaLenk</div>
          <div className="flex justify-center gap-8 mb-8 text-slate-400 text-sm">
            <a href="#" className="hover:text-[#f97316] transition">Politique de Confidentialité</a>
            <a href="#" className="hover:text-[#f97316] transition">Conditions d'Utilisation</a>
            <a href="#" className="hover:text-[#f97316] transition">Contactez-Nous</a>
          </div>
          <p className="text-slate-500 text-xs">© 2026 WanaLenk. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default BoutiquePage;