import { useState } from 'react';
import { useLocation } from "wouter";
import { useAuthStore } from '@/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { FadeIn } from '@/components/animations';

export default function LoginPage() {
  const [, navigate] = useLocation();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('demo@swms.io');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    await login(email, password);

    navigate("/dashboard");

  } catch (err) {
    console.error(err);
  }
};

  return (
    <div
  className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
  style={{
    backgroundImage: "url('/images/warehouse-login.jpg')",
  }}
>
      <FadeIn className="w-full max-w-xl">
        <div className="flex flex-col items-center mb-10">
  <img
    src="/logo/swms-logo.png"
    alt="SWMS Logo"
    className="w-36 h-36 object-contain"
  />

  <p className="mt-3 text-xl font-semibold tracking-wide text-white drop-shadow-lg">
  Smart Warehouse Management System
</p>
</div>
        
        <Card className="w-full max-w-xl rounded-[32px] bg-white/95 border border-slate-200 shadow-[0_20px_60px_rgba(0,0,0,0.18)] px-10 py-8 transition-all duration-500 hover:shadow-[0_30px_80px_rgba(0,0,0,0.22)]">
          <CardHeader className="space-y-1 text-center pb-6">
           <CardTitle className="text-3xl font-bold text-slate-900">
  Login
</CardTitle>
<CardDescription className="text-slate-500">
  Welcome back! Please login to continue.
</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />

  <Input
    id="email"
    type="email"
    placeholder="Enter your email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="h-12 pl-12 rounded-xl border-slate-300 focus:border-blue-600 focus:ring-blue-600"
    required
  />
  
</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-xs text-primary hover:underline" tabIndex={-1}>
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />

  <Input
    id="password"
    type={showPassword ? "text" : "password"}
    placeholder="Enter your password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="h-12 pl-12 pr-12 rounded-xl border-slate-300 focus:border-blue-600 focus:ring-blue-600"
    required
  />

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
  >
    {showPassword ? (
      <EyeOff className="h-5 w-5" />
    ) : (
      <Eye className="h-5 w-5" />
    )}
  </button>
</div>
              </div>
            </CardContent>
<CardFooter className="flex flex-col gap-4">
  <Button
  type="submit"
  className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold tracking-wide transition-all duration-300 shadow-xl hover:shadow-2xl hover:from-blue-700 hover:to-blue-800 hover:scale-[1.02] active:scale-[0.98]"
>
  Login →
</Button>

  <p className="text-sm text-center text-slate-500">
    Don't have an account?{" "}
    <button
  type="button"
  onClick={() => navigate("/register")}
  className="font-semibold text-blue-600 hover:underline"
>
  Create Account
</button>
  </p>
</CardFooter>
          </form>
        </Card>
      </FadeIn>
    </div>
  );
}
