
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { APP_NAME } from '../constants';

const AuthPage: React.FC<{ type: 'login' | 'register', onNavigate: (page: string) => void }> = ({ type, onNavigate }) => {
  const { login, register, language } = useApp();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('USER');
  const [file, setFile] = useState<File | null>(null);

  const labels = {
    FR: {
      welcomeBack: 'Bon retour parmi nous',
      join: `Rejoindre ${APP_NAME}`,
      loginDetails: 'Entrez vos coordonnées pour accéder à votre compte',
      registerDetails: 'Complétez l\'inscription pour commencer',
      fullNameLabel: 'Nom complet / Nom de l\'institution',
      fullNamePlaceholder: 'Entrez votre nom',
      emailLabel: 'Adresse e-mail',
      emailPlaceholder: 'nom@exemple.com',
      passwordLabel: 'Mot de passe',
      passwordPlaceholder: 'Entrez votre mot de passe',
      confirmPasswordLabel: 'Confirmer le mot de passe',
      confirmPasswordPlaceholder: 'Retaper votre mot de passe',
      passwordMinLength: 'Le mot de passe doit contenir au moins 6 caractères',
      passwordsNotMatch: 'Les mots de passe ne correspondent pas',
      accType: 'Type de compte',
      citizen: 'Citoyen',
      institution: 'Institution',
      verifLabel: 'Document de vérification (PDF/JPG)',
      verifHelp: 'Obligatoire pour la sécurité et la confiance sur la plateforme.',
      loginBtn: 'Se connecter',
      registerBtn: 'S\'inscrire',
      noAccount: 'Vous n\'avez pas de compte ?',
      hasAccount: 'Vous avez déjà un compte ?'
    },
    KH: {
      welcomeBack: 'Byenvini ankò',
      join: `Antre nan ${APP_NAME}`,
      loginDetails: 'Antre enfòmasyon ou yo pou w ka jwenn kont ou',
      registerDetails: 'Ranpli enskripsyon an pou w ka kòmanse',
      fullNameLabel: 'Non konplè / Non enstitisyon an',
      fullNamePlaceholder: 'Antre non ou',
      emailLabel: 'Adrès imèl',
      emailPlaceholder: 'non@egzanp.com',
      passwordLabel: 'Modpas',
      passwordPlaceholder: 'Antre modpas ou a',
      confirmPasswordLabel: 'Konfime modpas la',
      confirmPasswordPlaceholder: 'Retape modpas ou a',
      passwordMinLength: 'Modpas la dwe gen omwen 6 karaktè',
      passwordsNotMatch: 'Modpas yo pa koresponn',
      accType: 'Kalite kont',
      citizen: 'Sitwayen',
      institution: 'Enstitisyon',
      verifLabel: 'Dokiman verifikasyon (PDF/JPG)',
      verifHelp: 'Obligatwa pou sekirite ak konfyans sou platfòm lan.',
      loginBtn: 'Konekte',
      registerBtn: 'Enskri',
      noAccount: 'Ou pa gen yon kont?',
      hasAccount: 'Ou deja gen yon kont?'
    }
  }[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (type === 'login') {
      if (!email || !password) {
        alert(language === 'FR' ? 'Veuillez remplir tous les champs' : 'Tanpri ranpli tout chan yo');
        return;
      }
      login(email, password);
    } else {
      if (!name || !email || !password || !confirmPassword) {
        alert(language === 'FR' ? 'Veuillez remplir tous les champs' : 'Tanpri ranpli tout chan yo');
        return;
      }
      
      if (password.length < 6) {
        alert(labels.passwordMinLength);
        return;
      }
      
      if (password !== confirmPassword) {
        alert(labels.passwordsNotMatch);
        return;
      }
      
      register(name, email, password, role);
    }
    onNavigate('dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-neutral-50">
      <div className="card p-8 w-full max-w-md">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
            {type === 'login' ? labels.welcomeBack : labels.join}
          </h2>
          <p className="text-slate-500">
            {type === 'login' ? labels.loginDetails : labels.registerDetails}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {type === 'register' && (
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">{labels.fullNameLabel}</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder={labels.fullNamePlaceholder}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{labels.emailLabel}</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder={labels.emailPlaceholder}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{labels.passwordLabel}</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder={labels.passwordPlaceholder}
            />
          </div>

          {type === 'register' && (
            <>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">{labels.accType}</label>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    type="button"
                    onClick={() => setRole('USER')}
                    className={`p-3 rounded-xl border font-bold transition ${role === 'USER' ? 'bg-blue-50 border-blue-500 text-blue-600' : 'border-slate-200 text-slate-500'}`}
                  >
                    {labels.citizen}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setRole('INSTITUTION')}
                    className={`p-3 rounded-xl border font-bold transition ${role === 'INSTITUTION' ? 'bg-blue-50 border-blue-500 text-blue-600' : 'border-slate-200 text-slate-500'}`}
                  >
                    {labels.institution}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">{labels.confirmPasswordLabel}</label>
                <input 
                  type="password" 
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder={labels.confirmPasswordPlaceholder}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">{labels.verifLabel}</label>
                <input 
                  type="file" 
                  required
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="mt-2 text-xs text-slate-400">{labels.verifHelp}</p>
              </div>
            </>
          )}

          <button 
            type="submit"
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition"
          >
            {type === 'login' ? labels.loginBtn : labels.registerBtn}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-100 text-center text-slate-500">
          {type === 'login' ? (
            <p>{labels.noAccount} <button onClick={() => onNavigate('register')} className="text-blue-600 font-bold hover:underline">{labels.registerBtn}</button></p>
          ) : (
            <p>{labels.hasAccount} <button onClick={() => onNavigate('login')} className="text-blue-600 font-bold hover:underline">{labels.loginBtn}</button></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;