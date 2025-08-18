import { useContext } from 'react';
import { AuthContext } from './provider';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('Missing AuthProvider');
  return context;
};