export interface User {
  id: number;
  name: string;
  email: string;
  googleId: string;
  role: string;
}

export interface Stream {
  id: string;
  title: string;
  url: string;
  duration: number;
  status: 'active' | 'completed';
  createdAt: string;
  endedAt?: string;
  updatedAt: string;
}

export interface Chat {
  id: string;
  message: string;
  sentAt: string;
  user: {
    id: number;
    name: string;
  };
  stream: {
    id: string;
  };
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: () => void;
  logout: () => void;
  isAuthenticated: boolean;
  setUserAndToken: (user: User, token: string) => void;
}
