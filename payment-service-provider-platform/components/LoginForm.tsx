"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CreditCard, Shield, Users } from "lucide-react";
import { InteractiveLoading } from "@/components/ui/interactive-loading";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const success = await login(email, password);
    if (!success) {
      setError("Invalid credentials. Please try again.");
    }
  };

  const demoAccounts = [
    {
      email: "user@chapa.co",
      role: "User",
      icon: CreditCard,
      color: "text-blue-600",
    },
    {
      email: "admin@chapa.co",
      role: "Admin",
      icon: Shield,
      color: "text-orange-600",
    },
    {
      email: "superadmin@chapa.co",
      role: "Super Admin",
      icon: Users,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-bg">
      <div className="w-full max-w-md space-y-6">
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center">
            <div className="flex justify-center ">
              <img
                src="/chapa-login-logo.png"
                alt="Chapa Logo"
                className="w-20 h-20 object-contain"
              />
            </div>
            <CardTitle className="text-2xl">Payment Service Provider</CardTitle>
            <CardDescription>Sign in to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-[#7DC400] hover:bg-[#6bb000]  text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <InteractiveLoading size="sm" />
                    <span>Signing In...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-6">
              <p className="text-sm text-gray-600 mb-3">
                Demo Accounts (Password: chapa123):
              </p>
              <div className="space-y-2">
                {demoAccounts.map((account) => (
                  <button
                    key={account.email}
                    onClick={() => {
                      setEmail(account.email);
                      setPassword("chapa123");
                    }}
                    className="w-full p-2 text-left rounded-lg border hover:bg-gray-50 hover:text-[#0D1B34] transition-colors flex items-center gap-3"
                  >
                    <account.icon className={`h-4 w-4 ${account.color}`} />
                    <div>
                      <div className="font-medium text-sm">{account.role}</div>
                      <div className="text-xs text-gray-500">
                        {account.email}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
