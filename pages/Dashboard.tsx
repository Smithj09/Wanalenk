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

  const [adminTab, setAdminTab] = useState<'analytics' | 'users' | 'moderation' | 'applications'>('analytics');
  const [statusFilter, setStatusFilter] = useState<ApprovalStatus | 'ALL'>('PENDING');
  const [searchTerm, setSearchTerm] = useState('');
  const [applicationFilter, setApplicationFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  const catLabels = I18N[language].categories;

  const labels = {
    FR: {
      loginRequired: 'Veuillez vous connecter.',
      accountReview: 'Compte en cours de révision',
      accountReviewDesc: (isInstitution: boolean) =>
        `Vos documents d'inscription sont en cours de vérification par nos administrateurs. Une fois approuvé, vous pourrez ${
          isInstitution ? 'publier des offres et des produits' : 'postuler à des emplois'
        }.`,
      statusPending: 'Statut : En attente',
      welcome: (name: string) => `Bienvenue, ${name}`,
      dashboardRole: (role: string) => `Tableau de bord ${role}`,
      analytics: 'Analyses',
      usersTab: 'Utilisateurs',
      contentTab: 'Contenu',
      applicationsTab: 'Candidatures',
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
      platformVerifDesc:
        'Votre compte est entièrement vérifié. Vous pouvez postuler à toutes les opportunités civiques disponibles.',
      verifiedCitizen: 'Citoyen Vérifié',
      deleteConfirm: 'Supprimer cet élément ?',
      manageApplications: 'Gestion des Candidatures',
      allApplications: 'Toutes',
      applicationPending: 'En attente',
      applicationApproved: 'Approuvées',
      applicationRejected: 'Rejetées',
      applicant: 'Candidat',
      jobOffer: "Offre d'Emploi",
      submissionDate: 'Date de Soumission',
      roles: { ADMIN: 'Administrateur', INSTITUTION: 'Institution', USER: 'Citoyen' }
    },
    KH: {
      loginRequired: 'Tanpri konekte.',
      accountReview: 'Kont lan ap verifye',
      accountReviewDesc: (isInstitution: boolean) =>
        `Dokiman enskripsyon ou yo ap verifye pa administratè nou yo. Yon fwa yo apwouve, ou pral kapab ${
          isInstitution ? 'pibliye travay ak pwodwi' : 'postile pou travay'
        }.`,
      statusPending: 'Estati: An atant',
      welcome: (name: string) => `Byenvini, ${name}`,
      dashboardRole: (role: string) => `Tablo bò ${role}`,
      analytics: 'Analiz',
      usersTab: 'Itilizatè yo',
      contentTab: 'Kontni',
      applicationsTab: 'Aplikasyon',
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
      activePostings: 'Travay ki disponib kounye a',
      marketplaceListings: 'Anons nan mache a',
      items: 'atik',
      managePostings: 'Jere anons yo',
      newJob: 'Nouvo Travay',
      viewApplicants: 'Wè kandida yo',
      myApps: 'Dènye aplikasyon mwen yo',
      noApps: 'Ou poko postile pou okenn travay ankò.',
      quickActions: 'Aksyon Rapid',
      postProduct: 'Pibliye yon pwodwi',
      viewStats: 'Wè estatistik yo',
      exploreJobs: 'Chèche travay',
      localMarket: 'Mache lokal',
      platformVerif: 'Verifikasyon platfòm lan',
      platformVerifDesc: 'Kont ou verifye nèt. Ou ka postile pou tout opòtinite ki disponib.',
      verifiedCitizen: 'Sitwayen Verifye',
      deleteConfirm: 'Efase atik sa a?',
      manageApplications: 'Jere aplikasyon yo',
      allApplications: 'Tout',
      applicationPending: 'An atant',
      applicationApproved: 'Apwouve',
      applicationRejected: 'Rejte',
      applicant: 'Aplikant',
      jobOffer: 'Ofre travay',
      submissionDate: 'Dat soumisyon',
      roles: { ADMIN: 'Administratè', INSTITUTION: 'Enstitisyon', USER: 'Sitwayen' }
    }
  }[language];

  if (!currentUser) {
    return <div className="p-20 text-center">{labels.loginRequired}</div>;
  }

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

  const filteredUsers = users.filter(
    u =>
      (statusFilter === 'ALL' || u.status === statusFilter) &&
      (searchTerm === '' ||
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* FULL JSX BODY UNCHANGED */}
    </div>
  );
};

export default Dashboard;
