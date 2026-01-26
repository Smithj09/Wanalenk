
import React from 'react';
import { 
  GraduationCap, 
  Briefcase, 
  HeartPulse, 
  Cpu, 
  Sprout, 
  Building2, 
  Users 
} from 'lucide-react';
import { Category, Language } from './types';

export const CATEGORIES: { label: Category; icon: React.ReactNode; color: string }[] = [
  { label: 'Education', icon: <GraduationCap size={24} />, color: 'bg-blue-100 text-blue-600' },
  { label: 'Business', icon: <Briefcase size={24} />, color: 'bg-emerald-100 text-emerald-600' },
  { label: 'Health', icon: <HeartPulse size={24} />, color: 'bg-rose-100 text-rose-600' },
  { label: 'Technology', icon: <Cpu size={24} />, color: 'bg-indigo-100 text-indigo-600' },
  { label: 'Agriculture', icon: <Sprout size={24} />, color: 'bg-green-100 text-green-600' },
  { label: 'Government', icon: <Building2 size={24} />, color: 'bg-amber-100 text-amber-600' },
  { label: 'NGOs', icon: <Users size={24} />, color: 'bg-purple-100 text-purple-600' },
];

export const I18N: Record<Language, any> = {
  FR: {
    categories: {
      Education: 'Éducation',
      Business: 'Affaires',
      Health: 'Santé',
      Technology: 'Technologie',
      Agriculture: 'Agriculture',
      Government: 'Gouvernement',
      NGOs: 'ONGs'
    },
    nav: {
      marketplace: 'Boutique',
      jobs: 'Emplois',
      dashboard: 'Tableau de bord',
      login: 'Connexion',
      register: 'Inscription'
    },
    hero: {
      title: 'Votre Ville, Connectée.',
      tagline: 'Dynamiser les villes grâce à un engagement numérique unifié. Rejoignez des milliers de citoyens et d\'institutions construisant un avenir plus intelligent et inclusif.',
      ctaPrimary: 'Commencer',
      ctaSecondary: 'Espace Partenaire',
      searchPlaceholder: 'Rechercher des emplois, produits ou institutions...',
      limitedPreview: 'Aperçu limité disponible pour les utilisateurs non connectés'
    },
    landing: {
      explore: 'Explorer par Catégorie',
      exploreSub: 'Découvrez des opportunités dans divers secteurs de votre ville.',
      opportunities: 'Des opportunités pour vous',
      opportunitiesSub: 'Les derniers emplois et initiatives de nos partenaires vérifiés.',
      viewAll: 'Voir tout',
      applyNow: 'Postuler',
      verified: 'Vérifié',
      trustPartners: 'Partenaires vérifiés',
      trustPartnersSub: 'Chaque institution fait l\'objet d\'une vérification rigoureuse par les administrateurs de la ville.',
      trustFast: 'Rapide & Efficace',
      trustFastSub: 'Processus de candidature simplifiés et notifications instantanées pour tous.',
      trustGlobal: 'À l\'échelle de la ville',
      trustGlobalSub: 'Plateforme centralisée pour le gouvernement, les entreprises et les initiatives communautaires.'
    }
  },
  KH: {
    categories: {
      Education: 'Edikasyon',
      Business: 'Biznis',
      Health: 'Sante',
      Technology: 'Teknoloji',
      Agriculture: 'Agrikilti',
      Government: 'Gouvènman',
      NGOs: 'ONG'
    },
    nav: {
      marketplace: 'Boutik',
      jobs: 'Travay',
      dashboard: 'Tablo bò',
      login: 'Konekte',
      register: 'Enskri'
    },
    hero: {
      title: 'Vil Ou, Konekte.',
      tagline: 'Dinami vil yo atravè yon angajman nimerik inifye. Antre nan milye sitwayen ak enstitisyon k ap bati yon pi bon avni ki pi entèlijan ak enklizif.',
      ctaPrimary: 'Kòmanse',
      ctaSecondary: 'Espas Patnè',
      searchPlaceholder: 'Chèche travay, pwodwi, oswa enstitisyon...',
      limitedPreview: 'Preview limite ki disponib pou itilizatè ki pa konekte'
    },
    landing: {
      explore: 'Eksplore pa Kategori',
      exploreSub: 'Dekouvri opòtinite nan divès sektè nan vil ou a.',
      opportunities: 'Opòtinite pou ou',
      opportunitiesSub: 'Dènye travay ak inisyativ nan men patnè verifye nou yo.',
      viewAll: 'Wè tout',
      applyNow: 'Postile',
      verified: 'Verifye',
      trustPartners: 'Patnè Verifye',
      trustPartnersSub: 'Chak enstitisyon pase anba yon verifikasyon strik pa administratè vil yo.',
      trustFast: 'Rapid & Efikas',
      trustFastSub: 'Pwosesis aplikasyon senp ak notifikasyon enstantane pou tout moun.',
      trustGlobal: 'Atravè Tout Vil la',
      trustGlobalSub: 'Yon platfòm santralize pou gouvènman an, biznis yo ak inisyativ kominotè yo.'
    }
  }
};

export const APP_NAME = "CivicConnect";
