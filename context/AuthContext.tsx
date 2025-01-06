import React, { createContext, useContext, useState } from 'react';

interface User {
  displayName?: string;
  // Add other user properties as needed
}

interface AuthContextType {
  user: User | null;
  // Add other auth methods as needed
}

const AuthContext = createContext<AuthContextType>({
  user: null
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user] = useState<User | null>({ displayName: "User" }); // Temporary default user

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 