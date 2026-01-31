import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, I18N } from '../constants';
import { Search, Filter, MapPin, Calendar, Briefcase, ShieldCheck } from 'lucide-react';
import { Job } from '../types';
import Footer from '../components/Footer';

const JobListPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { currentUser, jobs, language, applyForJob } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');

  const labels = I18N[language];
  const catLabels = labels.categories;

  // Get unique locations from jobs
  const locations = useMemo(() => {
    return Array.from(new Set(jobs.map(job => job.location)));
  }, [jobs]);

  // Filter and sort jobs
  const filteredJobs = useMemo(() => {
    let filtered = jobs;

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(term) ||
        job.description.toLowerCase().includes(term) ||
        job.institutionName.toLowerCase().includes(term)
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(job => job.category === selectedCategory);
    }

    // Location filter
    if (selectedLocation) {
      filtered = filtered.filter(job => job.location === selectedLocation);
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return a.title.localeCompare(b.title);
      }
    });

    return filtered;
  }, [jobs, searchTerm, selectedCategory, selectedLocation, sortBy]);

  const handleApply = (job: Job) => {
    if (!currentUser) {
      onNavigate('login');
      return;
    }

    if (currentUser.status === 'PENDING') {
      alert(labels.hero.limitedPreview);
      return;
    }

    applyForJob(job.id);
    alert(language === 'FR' ? 'Votre candidature a été soumise avec succès!' : 'Aplikasyon ou te soumèt avèk siksè!');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'FR' ? 'fr-FR' : 'km-KH');
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary-navy py-16 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{labels.nav.jobs}</h1>
          <p className="text-xl text-neutral-100/80 max-w-2xl">
            Découvrez toutes les opportunités d'emploi disponibles dans les écoles et institutions partenaires.
          </p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Search Bar */}
            <div className="lg:col-span-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                  <Search size={20} />
                </div>
                <input
                  type="text"
                  placeholder={labels.hero.searchPlaceholder}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-orange focus:border-primary-orange transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Filters */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">{labels.categories.Technology}</label>
                <div className="relative">
                  <select
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-orange focus:border-primary-orange transition-all appearance-none"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">Toutes les catégories</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat.label} value={cat.label}>
                        {catLabels[cat.label]}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                    <Filter size={20} />
                  </div>
                </div>
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Lieu</label>
                <div className="relative">
                  <select
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-orange focus:border-primary-orange transition-all appearance-none"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                  >
                    <option value="">Tous les lieux</option>
                    {locations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                    <MapPin size={20} />
                  </div>
                </div>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Trier par</label>
                <div className="relative">
                  <select
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-orange focus:border-primary-orange transition-all appearance-none"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'date' | 'title')}
                  >
                    <option value="date">Plus récents d'abord</option>
                    <option value="title">A-Z</option>
                  </select>
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                    <Calendar size={20} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">
              {jobs.length} {jobs.length === 1 ? 'emploi' : 'emplois'} disponible{jobs.length > 1 ? 's' : ''}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <div key={job.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-primary-navy/20 transition-all">
                  <div className="p-6">
                    {/* Category Badge */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="bg-primary-navy/10 text-primary-navy px-3 py-1 rounded-full text-xs font-semibold">
                        {catLabels[job.category]}
                      </div>
                      <div className="flex items-center text-green-600 text-xs">
                        <ShieldCheck size={14} className="mr-1" />
                        Vérifié
                      </div>
                    </div>

                    {/* Job Title and Institution */}
                    <h3 className="text-xl font-bold text-slate-900 mb-2 hover:text-primary-orange transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-slate-600 font-medium mb-4">{job.institutionName}</p>

                    {/* Job Details */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-slate-500 text-sm">
                        <MapPin size={16} className="mr-2" />
                        {job.location}
                      </div>
                      <div className="flex items-center text-slate-500 text-sm">
                        <Calendar size={16} className="mr-2" />
                        Deadline: {formatDate(job.deadline)}
                      </div>
                      {job.salary && (
                        <div className="flex items-center text-slate-500 text-sm">
                          <Briefcase size={16} className="mr-2" />
                          {job.salary}
                        </div>
                      )}
                    </div>

                    {/* Job Description Preview */}
                    <p className="text-slate-600 text-sm mb-6 line-clamp-3">
                      {job.description}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApply(job)}
                        className="flex-1 bg-primary-orange text-white py-3 px-4 rounded-xl font-bold hover:bg-orange-600 transition-colors"
                      >
                        {labels.landing.applyNow}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <div className="w-20 h-20 mx-auto mb-6 text-slate-300">
                  <Briefcase size={80} />
                </div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">Aucun emploi trouvé</h3>
                <p className="text-slate-500 mb-6">Essayez de modifier vos filtres de recherche</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('');
                    setSelectedLocation('');
                  }}
                  className="bg-primary-navy text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-navy/90 transition-colors"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Professional Footer */}
      <Footer />
    </div>
  );
};

export default JobListPage;