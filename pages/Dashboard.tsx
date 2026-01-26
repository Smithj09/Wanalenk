
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  Briefcase, 
  ShoppingBag, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Plus, 
  FileText,
  AlertTriangle,
  BarChart3,
  ShieldAlert,
  Trash2,
  Filter
} from 'lucide-react';
import { UserRole, ApprovalStatus } from '../types';
import { I18N } from '../constants';

const Dashboard: React.FC = () => {
  const { 
    currentUser, 
    users, 
    jobs, 
    products, 
    applications, 
    updateUserStatus, 
    deleteJob, 
    deleteProduct,
    language
  } = useApp();
  
  const [adminTab, setAdminTab] = useState<'analytics' | 'users' | 'moderation'>('analytics');
  const [statusFilter, setStatusFilter] = useState<ApprovalStatus | 'ALL'>('PENDING');

  const catLabels = I18N[language].categories;

  const labels = {
    FR: {
      loginRequired: 'Veuillez vous connecter.',
      accountReview: 'Compte en cours de révision',
      accountReviewDesc: (isInstitution: boolean) => `Vos documents d'inscription sont en cours de vérification par nos administrateurs. Une fois approuvé, vous pourrez ${isInstitution ? 'publier des offres et des produits' : 'postuler à des emplois'}.`,
      statusPending: 'Statut : En attente',
      welcome: (name: string) => `Bienvenue, ${name}`,
      dashboardRole: (role: string) => `Tableau de bord ${role}`,
      analytics: 'Analyses',
      usersTab: 'Utilisateurs',
      contentTab: 'Contenu',
      totalRegistered: 'Total Inscrits',
      pending: 'En attente',
      activeJobs: 'Emplois Actifs',
      totalApps: 'Total Candidatures',
      distribution: 'Répartition des Utilisateurs',
      systemHealth: 'État du Système',
      allSystems: 'Tous les systèmes opérationnels',
      verificationRate: 'Taux de Vérification Plateforme',
      userDir: 'Répertoire des Utilisateurs et Institutions',
      allStatus: 'Tous les statuts',
      approved: 'Approuvé',
      rejected: 'Rejeté',
      entity: 'Entité',
      role: 'Rôle',
      status: 'Statut',
      joined: 'Inscrit le',
      actions: 'Actions',
      activePostings: "Offres d'emploi actives",
      marketplaceListings: 'Annonces Marketplace',
      items: 'éléments',
      managePostings: 'Gérer les annonces',
      newJob: 'Nouveau Poste',
      viewApplicants: 'Voir les candidats',
      myApps: 'Mes candidatures récentes',
      noApps: "Vous n'avez pas encore postulé à des emplois.",
      quickActions: 'Actions Rapides',
      postProduct: 'Publier un produit',
      viewStats: 'Voir les statistiques',
      exploreJobs: 'Explorer les emplois',
      localMarket: 'Marché local',
      platformVerif: 'Vérification de la plateforme',
      platformVerifDesc: 'Votre compte est entièrement vérifié. Vous pouvez postuler à toutes les opportunités civiques disponibles.',
      verifiedCitizen: 'Citoyen Vérifié',
      deleteConfirm: 'Supprimer cet élément ?',
      roles: { ADMIN: 'Administrateur', INSTITUTION: 'Institution', USER: 'Citoyen' }
    },
    KH: {
      loginRequired: 'Tanpri konekte.',
      accountReview: 'Kont lan ap verifye',
      accountReviewDesc: (isInstitution: boolean) => `Dokiman enskripsyon ou yo ap verifye pa administratè nou yo. Yon fwa yo apwouve, ou pral kapab ${isInstitution ? 'pibliye travay ak pwodwi' : 'postile pou travay'}.`,
      statusPending: 'Estati: An atant',
      welcome: (name: string) => `Byenvini, ${name}`,
      dashboardRole: (role: string) => `Tablo bò ${role}`,
      analytics: 'Analiz',
      usersTab: 'Itilizatè yo',
      contentTab: 'Kontni',
      totalRegistered: 'Total Enskri',
      pending: 'An atant',
      activeJobs: 'Travay ki aktif',
      totalApps: 'Total Aplikasyon',
      distribution: 'Distribisyon Itilizatè yo',
      systemHealth: 'Eta Sistèm lan',
      allSystems: 'Tout sistèm yo ap mache byen',
      verificationRate: 'To Verifikasyon Platfòm lan',
      userDir: 'Lis Itilizatè yo ak Enstitisyon yo',
      allStatus: 'Tout estati yo',
      approved: 'Apwouve',
      rejected: 'Rejte',
      entity: 'Entite',
      role: 'Wòl',
      status: 'Estati',
      joined: 'Enskri nan dat',
      actions: 'Aksyon yo',
      activePostings: "Travay ki disponib kounye a",
      marketplaceListings: 'Anons nan mache a',
      items: 'atik',
      managePostings: 'Jere anons yo',
      newJob: 'Nouvo Travay',
      viewApplicants: 'Wè kandida yo',
      myApps: 'Dènye aplikasyon mwen yo',
      noApps: "Ou poko postile pou okenn travay ankò.",
      quickActions: 'Aksyon Rapid',
      postProduct: 'Pibliye yon pwodwi',
      viewStats: 'Wè estatistik yo',
      exploreJobs: 'Chèche travay',
      localMarket: 'Mache lokal',
      platformVerif: 'Verifikasyon platfòm lan',
      platformVerifDesc: 'Kont ou verifye nèt. Ou ka postile pou tout opòtinite ki disponib.',
      verifiedCitizen: 'Sitwayen Verifye',
      deleteConfirm: 'Efase atik sa a?',
      roles: { ADMIN: 'Administratè', INSTITUTION: 'Enstitisyon', USER: 'Sitwayen' }
    }
  }[language];

  if (!currentUser) return <div className="p-20 text-center">{labels.loginRequired}</div>;

  const isAdmin = currentUser.role === 'ADMIN';
  const isInstitution = currentUser.role === 'INSTITUTION';
  const isUser = currentUser.role === 'USER';

  if (currentUser.status === 'PENDING' && !isAdmin) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-amber-50 border border-amber-200 p-8 rounded-2xl text-center">
          <AlertTriangle className="mx-auto text-amber-500 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">{labels.accountReview}</h2>
          <p className="text-slate-600 mb-6">{labels.accountReviewDesc(isInstitution)}</p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full font-medium">
            <Clock size={16} /> {labels.statusPending}
          </div>
        </div>
      </div>
    );
  }

  const filteredUsers = users.filter(u => statusFilter === 'ALL' || u.status === statusFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{labels.welcome(currentUser.name)}</h1>
          <p className="text-slate-500">{labels.dashboardRole((labels.roles as any)[currentUser.role])}</p>
        </div>
        {isAdmin && (
          <div className="flex bg-slate-200 p-1 rounded-xl">
            <button 
              onClick={() => setAdminTab('analytics')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition ${adminTab === 'analytics' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'}`}
            >
              {labels.analytics}
            </button>
            <button 
              onClick={() => setAdminTab('users')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition ${adminTab === 'users' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'}`}
            >
              {labels.usersTab}
            </button>
            <button 
              onClick={() => setAdminTab('moderation')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition ${adminTab === 'moderation' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'}`}
            >
              {labels.contentTab}
            </button>
          </div>
        )}
      </div>

      {isAdmin && (
        <div className="space-y-8">
          {adminTab === 'analytics' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Users size={24} /></div>
                    <div>
                      <div className="text-sm text-slate-500">{labels.totalRegistered}</div>
                      <div className="text-2xl font-bold">{users.length}</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-100 text-amber-600 rounded-xl"><Clock size={24} /></div>
                    <div>
                      <div className="text-sm text-slate-500">{labels.pending}</div>
                      <div className="text-2xl font-bold">{users.filter(u => u.status === 'PENDING').length}</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl"><Briefcase size={24} /></div>
                    <div>
                      <div className="text-sm text-slate-500">{labels.activeJobs}</div>
                      <div className="text-2xl font-bold">{jobs.length}</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl"><BarChart3 size={24} /></div>
                    <div>
                      <div className="text-sm text-slate-500">{labels.totalApps}</div>
                      <div className="text-2xl font-bold">{applications.length}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-2xl border border-slate-200">
                  <h3 className="text-lg font-bold mb-6">{labels.distribution}</h3>
                  <div className="space-y-4">
                    {(['ADMIN', 'INSTITUTION', 'USER'] as UserRole[]).map(role => {
                      const count = users.filter(u => u.role === role).length;
                      const percentage = (count / users.length) * 100;
                      return (
                        <div key={role}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-slate-600 uppercase tracking-wider">{(labels.roles as any)[role]}</span>
                            <span className="font-bold">{count}</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full transition-all" style={{ width: `${percentage}%` }}></div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div className="bg-white p-8 rounded-2xl border border-slate-200">
                  <h3 className="text-lg font-bold mb-6">{labels.systemHealth}</h3>
                  <div className="flex items-center gap-4 p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
                    <CheckCircle size={20} />
                    <span className="font-medium">{labels.allSystems}</span>
                  </div>
                  <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-sm text-slate-500 mb-2">{labels.verificationRate}</div>
                    <div className="text-3xl font-bold text-slate-800">84.5%</div>
                  </div>
                </div>
              </div>
            </>
          )}

          {adminTab === 'users' && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-xl font-bold">{labels.userDir}</h2>
                <div className="flex items-center gap-2 text-sm">
                  <Filter size={16} className="text-slate-400" />
                  <select 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ALL">{labels.allStatus}</option>
                    <option value="PENDING">{labels.pending}</option>
                    <option value="APPROVED">{labels.approved}</option>
                    <option value="REJECTED">{labels.rejected}</option>
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm md:text-base">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold tracking-wider">
                    <tr>
                      <th className="px-6 py-4">{labels.entity}</th>
                      <th className="px-6 py-4">{labels.role}</th>
                      <th className="px-6 py-4">{labels.status}</th>
                      <th className="px-6 py-4">{labels.joined}</th>
                      <th className="px-6 py-4 text-right">{labels.actions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map(u => (
                      <tr key={u.id} className="hover:bg-slate-50/50 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                              {u.name.charAt(0)}
                            </div>
                            <div className="truncate max-w-[120px]">
                              <div className="font-bold text-slate-900 truncate">{u.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded text-slate-600">{(labels.roles as any)[u.role]}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                            u.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-600' : 
                            u.status === 'PENDING' ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'
                          }`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-xs">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-1 md:gap-2">
                            {u.status !== 'APPROVED' && (
                              <button onClick={() => updateUserStatus(u.id, 'APPROVED')} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"><CheckCircle size={16} /></button>
                            )}
                            {u.status !== 'REJECTED' && (
                              <button onClick={() => updateUserStatus(u.id, 'REJECTED')} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"><XCircle size={16} /></button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {adminTab === 'moderation' && (
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <h2 className="font-bold flex items-center gap-2"><Briefcase size={18} className="text-blue-500" /> {labels.activePostings}</h2>
                  <span className="text-xs font-bold text-slate-400 uppercase">{jobs.length} {labels.items}</span>
                </div>
                <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
                  {jobs.map(job => (
                    <div key={job.id} className="p-4 hover:bg-slate-50 transition flex items-start justify-between">
                      <div>
                        <div className="font-bold text-slate-900">{job.title}</div>
                        <div className="text-xs text-slate-500">{job.institutionName} • {catLabels[job.category]}</div>
                      </div>
                      <button onClick={() => { if(confirm(labels.deleteConfirm)) deleteJob(job.id); }} className="p-2 text-slate-300 hover:text-rose-600 transition"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <h2 className="font-bold flex items-center gap-2"><ShoppingBag size={18} className="text-indigo-500" /> {labels.marketplaceListings}</h2>
                  <span className="text-xs font-bold text-slate-400 uppercase">{products.length} {labels.items}</span>
                </div>
                <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
                  {products.map(prod => (
                    <div key={prod.id} className="p-4 hover:bg-slate-50 transition flex items-start gap-3">
                      <img src={prod.imageUrl} alt="" className="w-10 h-10 rounded object-cover" />
                      <div className="flex-1">
                        <div className="font-bold text-slate-900">{prod.name}</div>
                        <div className="text-xs text-slate-500">{prod.price.toFixed(2)} • {catLabels[prod.category]}</div>
                      </div>
                      <button onClick={() => { if(confirm(labels.deleteConfirm)) deleteProduct(prod.id); }} className="p-2 text-slate-300 hover:text-rose-600 transition"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {!isAdmin && (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {isInstitution && (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <h2 className="text-xl font-bold">{labels.managePostings}</h2>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition">
                    <Plus size={16} /> {labels.newJob}
                  </button>
                </div>
                <div className="divide-y divide-slate-100">
                  {jobs.filter(j => j.institutionId === currentUser.id).map(job => (
                    <div key={job.id} className="p-6 flex justify-between items-center hover:bg-slate-50 transition">
                      <div>
                        <div className="font-bold text-lg">{job.title}</div>
                        <div className="text-sm text-slate-500">{catLabels[job.category]} • {applications.filter(a => a.jobId === job.id).length} kandida</div>
                      </div>
                      <button className="text-blue-600 font-medium hover:underline">{labels.viewApplicants}</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {isUser && (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                  <h2 className="text-xl font-bold">{labels.myApps}</h2>
                </div>
                <div className="divide-y divide-slate-100">
                  {applications.filter(a => a.userId === currentUser.id).length > 0 ? (
                    applications.filter(a => a.userId === currentUser.id).map(app => {
                      const job = jobs.find(j => j.id === app.jobId);
                      return (
                        <div key={app.id} className="p-6 flex justify-between items-center hover:bg-slate-50 transition">
                          <div>
                            <div className="font-bold">{job?.title}</div>
                            <div className="text-sm text-slate-500">{job?.institutionName}</div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                            app.status === 'PENDING' ? 'bg-amber-100 text-amber-600' : 
                            app.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'
                          }`}>{app.status}</div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-12 text-center text-slate-500">{labels.noApps}</div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="font-bold mb-4">{labels.quickActions}</h2>
              <div className="grid grid-cols-1 gap-3">
                {isInstitution ? (
                  <>
                    <button className="flex items-center gap-3 p-3 bg-slate-50 text-slate-700 rounded-xl hover:bg-blue-50 transition text-left">
                      <Plus size={20} className="text-blue-500" /> {labels.postProduct}
                    </button>
                    <button className="flex items-center gap-3 p-3 bg-slate-50 text-slate-700 rounded-xl hover:bg-blue-50 transition text-left">
                      <FileText size={20} className="text-indigo-500" /> {labels.viewStats}
                    </button>
                  </>
                ) : (
                  <>
                    <button className="flex items-center gap-3 p-3 bg-slate-50 text-slate-700 rounded-xl hover:bg-blue-50 transition text-left">
                      <Briefcase size={20} className="text-blue-500" /> {labels.exploreJobs}
                    </button>
                    <button className="flex items-center gap-3 p-3 bg-slate-50 text-slate-700 rounded-xl hover:bg-blue-50 transition text-left">
                      <ShoppingBag size={20} className="text-indigo-500" /> {labels.localMarket}
                    </button>
                  </>
                )}
              </div>
            </div>
            {isUser && (
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl text-white shadow-lg">
                <h3 className="font-bold mb-2">{labels.platformVerif}</h3>
                <p className="text-sm text-blue-100 mb-4">{labels.platformVerifDesc}</p>
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg text-xs font-bold border border-white/20">
                  <ShieldAlert size={14} /> {labels.verifiedCitizen}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
