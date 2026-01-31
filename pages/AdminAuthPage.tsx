import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Lock, User, Eye, EyeOff } from 'lucide-react';
import Footer from '../components/Footer';

const AdminAuthPage: React.FC<{ type: 'login' | 'register', onNavigate: (page: string) => void }> = ({ type, onNavigate }) => {
  const { login, register, language } = useApp();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const labels = {
    FR: {
      adminPortal: 'Portail Administrateur',
      adminLoginTitle: 'Connexion Administrateur',
      adminRegisterTitle: 'Création de Compte Administrateur',
      adminLoginDesc: 'Accès sécurisé au panneau d\'administration',
      adminRegisterDesc: 'Créer un nouveau compte administrateur',
      adminCodeLabel: 'Code d\'accès administrateur',
      adminCodePlaceholder: 'Entrez le code secret',
      invalidAdminCode: 'Code administrateur invalide',
      nameLabel: 'Nom de l\'administrateur',
      namePlaceholder: 'Entrez votre nom complet',
      emailLabel: 'Email professionnel',
      emailPlaceholder: 'admin@votreville.gov',
      passwordLabel: 'Mot de passe sécurisé',
      passwordPlaceholder: 'Minimum 8 caractères',
      confirmPasswordLabel: 'Confirmation du mot de passe',
      confirmPasswordPlaceholder: 'Retaper votre mot de passe',
      loginBtn: 'Se connecter',
      registerBtn: 'Créer le compte',
      loading: 'Chargement...',
      backToMain: 'Retour à l\'accueil principal'
    },
    KH: {
      adminPortal: 'Pòtay Administratè',
      adminLoginTitle: 'Koneksyon Administratè',
      adminRegisterTitle: 'Kreasyon Kont Administratè',
      adminLoginDesc: 'Aksè sekirize nan panèl administrasyon an',
      adminRegisterDesc: 'Kreye yon nouvo kont administratè',
      adminCodeLabel: 'Kòd aksè administratè',
      adminCodePlaceholder: 'Antre kòd sekrè a',
      invalidAdminCode: 'Kòd administratè envalid',
      nameLabel: 'Non administratè a',
      namePlaceholder: 'Antre non konplè ou',
      emailLabel: 'Imèl pwofesyonèl',
      emailPlaceholder: 'admin@vilou.gov',
      passwordLabel: 'Modpas sekirize',
      passwordPlaceholder: 'Omwen 8 karaktè',
      confirmPasswordLabel: 'Konfimasyon modpas la',
      confirmPasswordPlaceholder: 'Retape modpas ou a',
      loginBtn: 'Konekte',
      registerBtn: 'Kreye kont la',
      loading: 'Chajman...',
      backToMain: 'Retounen nan paj prensipal la'
    }
  }[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (type === 'login') {
        if (!email || !password) {
          alert(language === 'FR' ? 'Veuillez remplir tous les champs' : 'Tanpri ranpli tout chan yo');
          return;
        }
        
        const success = await login(email, password);
        if (success) {
          onNavigate('dashboard');
        }
      } else {
        // Validation pour l'inscription administrateur
        if (!name || !email || !password || !confirmPassword || !adminCode) {
          alert(language === 'FR' ? 'Veuillez remplir tous les champs' : 'Tanpri ranpli tout chan yo');
          return;
        }

        if (password.length < 8) {
          alert(language === 'FR' ? 'Le mot de passe doit contenir au moins 8 caractères' : 'Modpas la dwe gen omwen 8 karaktè');
          return;
        }

        if (password !== confirmPassword) {
          alert(language === 'FR' ? 'Les mots de passe ne correspondent pas' : 'Modpas yo pa koresponn');
          return;
        }

        // Vérification du code administrateur (dans un vrai système, cela serait géré côté serveur)
        if (adminCode !== 'ADMIN2024') {
          alert(labels.invalidAdminCode);
          return;
        }

        const success = await register(name, email, password, 'ADMIN');
        if (success) {
          onNavigate('dashboard');
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-primary-navy via-blue-900 to-primary-navy">
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-white/10 p-3 rounded-full">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">{labels.adminPortal}</h1>
            <h2 className="text-xl font-semibold text-white/90">
              {type === 'login' ? labels.adminLoginTitle : labels.adminRegisterTitle}
            </h2>
            <p className="text-white/70 mt-2">
              {type === 'login' ? labels.adminLoginDesc : labels.adminRegisterDesc}
            </p>
          </div>

          {/* Formulaire */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {type === 'register' && (
                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">
                    {labels.nameLabel}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                    <input 
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent"
                      placeholder={labels.namePlaceholder}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  {labels.emailLabel}
                </label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent"
                    placeholder={labels.emailPlaceholder}
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  {labels.passwordLabel}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent"
                    placeholder={labels.passwordPlaceholder}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {type === 'register' && (
                <>
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      {labels.confirmPasswordLabel}
                    </label>
                    <input 
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent"
                      placeholder={labels.confirmPasswordPlaceholder}
                    />
                  </div>

                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      {labels.adminCodeLabel}
                    </label>
                    <input 
                      type="password"
                      value={adminCode}
                      onChange={(e) => setAdminCode(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent"
                      placeholder={labels.adminCodePlaceholder}
                    />
                  </div>
                </>
              )}

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-orange hover:bg-orange-600 disabled:bg-orange-400 text-white py-4 rounded-lg font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    {labels.loading}
                  </>
                ) : (
                  type === 'login' ? labels.loginBtn : labels.registerBtn
                )}
              </button>
            </form>

            {/* Navigation */}
            <div className="mt-6 pt-6 border-t border-white/20 text-center">
              <button 
                onClick={() => onNavigate('landing')}
                className="text-white/70 hover:text-white text-sm transition-colors"
              >
                {labels.backToMain}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminAuthPage;