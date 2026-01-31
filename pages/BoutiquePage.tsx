import React from 'react';
import { ShoppingCart, Search, ArrowRight } from 'lucide-react';
import { I18N } from '../constants';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import Footer from '../components/Footer';

const BoutiquePage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { products, language } = useApp();

  const l = I18N[language].landing;
  const nav = I18N[language].nav;

  const handleAddToCart = (product: Product) => {
    // In a real app, this would add the product to the cart
    alert(`${product.name} has been added to your cart!`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-[#00235b] to-[#003370] text-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold mb-6">{l.boutiqueTitle}</h1>
              <p className="text-xl mb-8 opacity-90">{l.boutiqueDescription}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => onNavigate('landing')}
                  className="bg-[#f97316] hover:bg-[#ea580c] text-white px-6 py-3 rounded-lg font-bold transition flex items-center justify-center gap-2"
                >
                  {l.backToHome}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#00235b] mb-4">{l.productsTitle}</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">{l.productsDescription}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden group">
                  <div className="h-48 bg-gradient-to-r from-[#00235b] to-[#003370] flex items-center justify-center">
                    {product.imageUrl ? (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-slate-900 truncate">{product.name}</h3>
                      <span className="font-bold text-[#00235b] ml-2">{product.price.toFixed(2)} $</span>
                    </div>
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-[#00235b] hover:bg-[#001a45] text-white px-4 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {l.addToCart}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {products.length === 0 && (
              <div className="text-center py-16">
                <div className="text-slate-400 text-lg">{l.noProducts}</div>
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default BoutiquePage;