import { User } from 'firebase/auth';

export type AuthUser = User | null;
export interface AuthContextType {
  user: AuthUser;
  loading: boolean;
  signOut: () => Promise<void>;
}