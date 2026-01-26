
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Job, Product, Application, Review, ApprovalStatus, UserRole, Language } from '../types';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  users: User[];
  jobs: Job[];
  products: Product[];
  applications: Application[];
  reviews: Review[];
  language: Language;
  setLanguage: (lang: Language) => void;
  login: (email: string) => void;
  register: (name: string, email: string, role: UserRole) => void;
  updateUserStatus: (userId: string, status: ApprovalStatus) => void;
  postJob: (job: Omit<Job, 'id' | 'createdAt'>) => void;
  postProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  applyForJob: (jobId: string) => void;
  deleteJob: (jobId: string) => void;
  deleteProduct: (productId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [language, setLanguage] = useState<Language>('FR');

  // Initialize with dummy data
  useEffect(() => {
    const mockUsers: User[] = [
      { id: '1', name: 'Admin Ville', email: 'admin@city.gov', role: 'ADMIN', status: 'APPROVED', createdAt: new Date().toISOString() },
      { id: '2', name: 'Global Tech Inc', email: 'hr@globaltech.com', role: 'INSTITUTION', status: 'APPROVED', createdAt: new Date().toISOString() },
      { id: '3', name: 'Jean Dupont', email: 'jean@example.com', role: 'USER', status: 'APPROVED', createdAt: new Date().toISOString() },
      { id: '4', name: 'Santé Pour Tous ONG', email: 'contact@healthfirst.org', role: 'INSTITUTION', status: 'PENDING', createdAt: new Date().toISOString() },
    ];
    const mockJobs: Job[] = [
      { 
        id: 'j1', 
        institutionId: '2', 
        institutionName: 'Global Tech Inc',
        title: 'Ingénieur Logiciel Senior', 
        description: 'Rejoignez notre équipe pour construire les solutions urbaines de demain.', 
        category: 'Technology', 
        requiredDocuments: ['CV', 'Diplôme'], 
        deadline: '2024-12-31', 
        location: 'Centre-ville',
        createdAt: new Date().toISOString() 
      },
      { 
        id: 'j2', 
        institutionId: '2', 
        institutionName: 'Global Tech Inc',
        title: 'Coordinateur de Projet', 
        description: 'Gérer des projets de développement communautaire.', 
        category: 'Business', 
        requiredDocuments: ['CV'], 
        deadline: '2024-11-15', 
        location: 'À distance',
        createdAt: new Date().toISOString() 
      },
    ];
    const mockProducts: Product[] = [
      {
        id: 'p1',
        institutionId: '2',
        name: 'Kit Maison Intelligente Éco',
        description: 'Kit complet pour le suivi de l\'énergie domestique.',
        price: 299.99,
        category: 'Technology',
        imageUrl: 'https://picsum.photos/seed/tech/400/300',
        createdAt: new Date().toISOString()
      },
      {
        id: 'p2',
        institutionId: '4',
        name: 'Pass Santé Communautaire',
        description: 'Accès aux centres de santé premium.',
        price: 50.00,
        category: 'Health',
        imageUrl: 'https://picsum.photos/seed/health/400/300',
        createdAt: new Date().toISOString()
      }
    ];

    setUsers(mockUsers);
    setJobs(mockJobs);
    setProducts(mockProducts);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentUser(data.user);
        localStorage.setItem('token', data.token);
      } else {
        alert(data.error || (language === 'FR' ? 'Erreur de connexion' : 'Erè koneksyon'));
      }
    } catch (error) {
      console.error('Login error:', error);
      alert(language === 'FR' ? 'Erreur de connexion au serveur' : 'Erè koneksyon ak sèvè a');
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentUser(data.user);
        localStorage.setItem('token', data.token);
        alert(language === 'FR' ? data.message : 'Enskripsyon reyisi. Tanpri tann apwobasyon administratè a.');
      } else {
        alert(data.error || (language === 'FR' ? 'Erreur d\'inscription' : 'Erè enskripsyon'));
      }
    } catch (error) {
      console.error('Register error:', error);
      alert(language === 'FR' ? 'Erreur de connexion au serveur' : 'Erè koneksyon ak sèvè a');
    }
  };

  const updateUserStatus = (userId: string, status: ApprovalStatus) => {
    setUsers(users.map(u => u.id === userId ? { ...u, status } : u));
  };

  const postJob = (job: Omit<Job, 'id' | 'createdAt'>) => {
    const newJob: Job = {
      ...job,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    setJobs([newJob, ...jobs]);
  };

  const postProduct = (product: Omit<Product, 'id' | 'createdAt'>) => {
    const newProd: Product = {
      ...product,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    setProducts([newProd, ...products]);
  };

  const applyForJob = (jobId: string) => {
    if (!currentUser) return;
    const newApp: Application = {
      id: Math.random().toString(36).substr(2, 9),
      jobId,
      userId: currentUser.id,
      userName: currentUser.name,
      status: 'PENDING',
      submissionDate: new Date().toISOString(),
    };
    setApplications([...applications, newApp]);
  };

  const deleteJob = (jobId: string) => {
    setJobs(jobs.filter(j => j.id !== jobId));
  };

  const deleteProduct = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
  };

  return (
    <AppContext.Provider value={{ 
      currentUser, setCurrentUser, users, jobs, products, applications, reviews, language, setLanguage,
      login, register, updateUserStatus, postJob, postProduct, applyForJob, deleteJob, deleteProduct
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp doit être utilisé au sein d\'un AppProvider');
  return context;
};