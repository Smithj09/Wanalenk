import React from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../constants';
import Footer from '../components/Footer';

const Marketplace: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { products, language } = useApp();

  const translations = {
    FR: {
      marketplace: 'Boutique',
      allCategories: 'Toutes les catégories',
      filterByCategory: 'Filtrer par catégorie',
      noProducts: 'Aucun produit disponible actuellement',
      price: 'Prix',
      viewDetails: 'Voir les détails',
      backToHome: 'Retour à l\'accueil'
    },
    KH: {
      marketplace: 'Boutik',
      allCategories: 'Tout kategori yo',
      filterByCategory: 'Trie pa kategori',
      noProducts: 'Pa gen pwodui disponib pou kounye a',
      price: 'Pri',
      viewDetails: 'Wè detay yo',
      backToHome: 'Retounen paj dakèy'
    }
  };

  const t = translations[language];

  // Get unique categories from products
  const categories = Array.from(new Set(products.map(p => p.category)));
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const getCategoryLabel = (category: string) => {
    const categoryMap: Record<string, string> = {
      'Education': language === 'FR' ? 'Éducation' : 'Edikasyon',
      'Business': language === 'FR' ? 'Affaires' : 'Biznis',
      'Health': language === 'FR' ? 'Santé' : 'Sante',
      'Technology': language === 'FR' ? 'Technologie' : 'Teknoloji',
      'Agriculture': language === 'FR' ? 'Agriculture' : 'Agrikilti',
      'Government': language === 'FR' ? 'Gouvernement' : 'Gouvènman',
      'NGOs': language === 'FR' ? 'ONGs' : 'ONG'
    };
    return categoryMap[category] || category;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <div className="bg-slate-50 py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <h1 className="text-3xl font-bold text-[#00235b]">{t.marketplace}</h1>
              <button 
                onClick={() => onNavigate('landing')}
                className="px-4 py-2 bg-[#00235b] text-white rounded-lg hover:bg-[#001a45] transition"
              >
                {t.backToHome}
              </button>
            </div>

            {/* Category Filter */}
            <div className="mb-8 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-bold text-slate-700 mb-3">{t.filterByCategory}</h2>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    selectedCategory === 'all'
                      ? 'bg-[#00235b] text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {t.allCategories}
                </button>
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                      selectedCategory === category
                        ? 'bg-[#00235b] text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {getCategoryLabel(category)}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                  <div 
                    key={product.id} 
                    className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition"
                  >
                    <div className="h-48  from-[#00235b] to-[#003370] flex items-center justify-center">
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
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-slate-900 truncate">{product.name}</h3>
                        <span className="font-bold text-[#00235b] ml-2">{product.price.toFixed(2)} $</span>
                      </div>
                      <p className="text-slate-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                      
                      <div className="flex justify-between items-center">
                        <span className="inline-block px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">
                          {getCategoryLabel(product.category)}
                        </span>
                        <button className="text-sm font-medium text-[#00235b] hover:text-[#001a45]">
                          {t.viewDetails}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-slate-400 text-lg">{t.noProducts}</div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Marketplace;