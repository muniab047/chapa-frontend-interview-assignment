"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "user" | "admin" | "super_admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "user@chapa.co",
    role: "user",
    avatar: "/abstract-geometric-shapes.png",
    isActive: true,
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "admin@chapa.co",
    role: "admin",
    avatar: "/admin-interface.png",
    isActive: true,
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "superadmin@chapa.co",
    role: "super_admin",
    avatar: "/superadmin-interface.png",
    isActive: true,
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("chapa_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const foundUser = mockUsers.find((u) => u.email === email);

    if (foundUser && password === "chapa123") {
      setUser(foundUser);
      localStorage.setItem("chapa_user", JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("chapa_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
