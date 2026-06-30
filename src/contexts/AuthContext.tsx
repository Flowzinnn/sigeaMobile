import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { loginUser, type AuthUser, type LoginPayload } from '@/services/authService';

const TOKEN_KEY = 'ifms_auth_token';
const REMEMBER_KEY = 'ifms_auth_remember';

interface AuthContextValue {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  /** true enquanto o token salvo ainda esta sendo lido do armazenamento do dispositivo */
  isLoading: boolean;
  login: (payload: LoginPayload, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(TOKEN_KEY)
      .then(stored => setToken(stored))
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (payload: LoginPayload, rememberMe = false) => {
    const response = await loginUser(payload);
    // "Manter sessao ativa" controla se o token sobrevive ao fechar o app.
    if (rememberMe) {
      await AsyncStorage.setItem(TOKEN_KEY, response.token);
      await AsyncStorage.setItem(REMEMBER_KEY, '1');
    } else {
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(REMEMBER_KEY);
    }
    setToken(response.token);
    setUser(response.user);
  };

  const logout = async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(REMEMBER_KEY);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated: !!token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
