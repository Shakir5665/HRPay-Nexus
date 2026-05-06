import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, LogIn, Cpu, Loader2, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, accessToken, refreshToken } = response.data;
      setAuth(user, accessToken, refreshToken);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-slate-50 font-['Inter']">
      {/* Dark Header */}
      <header className="h-16 bg-[#0b1120] flex items-center justify-between px-4 sm:px-8 shrink-0 shadow-lg relative z-20">
        <div className="flex items-center gap-2 text-cyan-400">
          <Cpu className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-lg sm:text-xl font-black tracking-tight text-white uppercase">
            HR-Pay <span className="text-cyan-400">Nexus</span>
          </span>
        </div>
        <button className="px-4 sm:px-6 py-1.5 border border-cyan-400/50 text-cyan-400 text-[10px] sm:text-xs font-bold rounded-md hover:bg-cyan-400 hover:text-slate-900 transition-all uppercase tracking-widest">
          Login
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative">
        <div className="w-full max-w-[480px] bg-white rounded-lg shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] overflow-hidden border border-slate-100">
          {/* Card Top: Dark Section */}
          <div className="bg-[#1e293b] p-8 sm:p-10 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#1e293b] border-2 border-cyan-400 rounded-lg flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 fill-cyan-400/10" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">HRPay Nexus</h1>
          </div>

          {/* Card Separator: Cyan Line */}
          <div className="h-2 bg-cyan-400 shadow-[0_4px_10px_rgba(34,211,238,0.3)]"></div>

          {/* Card Bottom: Form Section */}
          <div className="p-6 sm:p-10 sm:pt-12">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-sm sm:text-lg font-bold text-slate-500 uppercase tracking-[0.2em]">Authentication Portal</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 text-red-600 text-sm font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <div className="space-y-4">
                {/* Email Input */}
                <div className="relative group">
                  <div className="absolute top-3 left-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email or Nexus ID</span>
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="admin@test.com"
                    className="block w-full px-4 pt-8 pb-3 bg-[#f0f4ff] border border-transparent rounded-lg text-slate-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/20 focus:border-cyan-400 transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* Password Input */}
                <div className="relative group">
                  <div className="absolute top-3 left-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secure Password</span>
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="block w-full px-4 pt-8 pb-3 bg-[#f0f4ff] border border-transparent rounded-lg text-slate-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/20 focus:border-cyan-400 transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* Authenticate Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-cyan-400 hover:bg-cyan-300 disabled:bg-slate-200 disabled:cursor-not-allowed text-slate-900 font-black rounded-md shadow-[0_10px_25px_-5px_rgba(34,211,238,0.4)] transition-all flex items-center justify-center gap-3 group active:scale-95 mt-4"
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    <span className="uppercase tracking-[0.1em] text-lg">Authenticate</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Branding Footer */}
        <footer className="mt-12 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
          Architected by Shakir | HRPAY NEXUS V1.0
        </footer>
      </main>
    </div>
  );
};

export default Login;
