import { useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  adminCode?: string;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null
  });

  // Vérifier l'authentification au chargement
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        setAuthState({ user: null, isLoading: false, error: null });
        return;
      }

      // Vérifier le token avec le backend
      const response = await fetch('http://localhost:3001/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setAuthState({ user: userData, isLoading: false, error: null });
      } else {
        localStorage.removeItem('admin_token');
        setAuthState({ user: null, isLoading: false, error: 'Token invalide' });
      }
    } catch (error) {
      console.error('Erreur de vérification d\'authentification:', error);
      setAuthState({ user: null, isLoading: false, error: 'Erreur de connexion' });
    }
  };

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok && data.user.role === 'ADMIN') {
        localStorage.setItem('admin_token', data.token);
        setAuthState({ user: data.user, isLoading: false, error: null });
        return true;
      } else {
        setAuthState({ user: null, isLoading: false, error: data.error || 'Accès administrateur refusé' });
        return false;
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      setAuthState({ user: null, isLoading: false, error: 'Erreur de connexion au serveur' });
      return false;
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Vérification du code administrateur pour les inscriptions ADMIN
      if (credentials.role === 'ADMIN') {
        if (!credentials.adminCode || credentials.adminCode !== process.env.REACT_APP_ADMIN_SECRET) {
          setAuthState({ user: null, isLoading: false, error: 'Code administrateur invalide' });
          return false;
        }
      }

      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('admin_token', data.token);
        setAuthState({ user: data.user, isLoading: false, error: null });
        return true;
      } else {
        setAuthState({ user: null, isLoading: false, error: data.error || 'Erreur d\'inscription' });
        return false;
      }
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      setAuthState({ user: null, isLoading: false, error: 'Erreur de connexion au serveur' });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setAuthState({ user: null, isLoading: false, error: null });
  };

  const hasPermission = (requiredRole: UserRole): boolean => {
    if (!authState.user) return false;
    
    const roleHierarchy = { 'USER': 1, 'INSTITUTION': 2, 'ADMIN': 3 };
    return roleHierarchy[authState.user.role] >= roleHierarchy[requiredRole];
  };

  return {
    user: authState.user,
    isLoading: authState.isLoading,
    error: authState.error,
    login,
    register,
    logout,
    hasPermission,
    checkAuthStatus
  };
};