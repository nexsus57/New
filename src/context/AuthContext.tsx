
import { createContext, useContext, ReactNode, FC } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (user: string, pass: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useLocalStorage('tapeindia_auth', false);

  const login = (user: string, pass: string): boolean => {
    // In a real app, this would be a call to a backend API.
    // For this example, we use hardcoded credentials.
    if (user === 'admin' && pass === 'tapeindia@1957') {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const value = { isAuthenticated, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};