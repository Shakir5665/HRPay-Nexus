import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import {
  LayoutDashboard,
  Users,
  CalendarClock,
  CreditCard,
  Menu,
  X,
  FileText,
  Shield,
  Cpu,
  User,
  LogOut
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import ChangeCredentialsModal from './ChangeCredentialsModal';
import shakirLogo from '../assets/shakir_logo.png';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Default closed on mobile

  const { data: employeeProfile } = useQuery({
    queryKey: ['employee-profile', user?.id],
    queryFn: async () => {
      try {
        const response = await api.get('/employee/me');
        return response.data;
      } catch (e) {
        return null;
      }
    },
    enabled: !!user?.id,
    retry: false
  });

  const displayName = employeeProfile?.fullName || user?.email?.split('@')[0] || 'User';

  const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const confirmLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/', roles: ['Admin', 'HR', 'Finance', 'Manager', 'Employee'] },
    { name: 'Leave Center', icon: CalendarClock, path: '/leaves', roles: ['Admin', 'HR', 'Manager', 'Employee'] },
    { name: 'Employee Base', icon: Users, path: '/employees', roles: ['Admin', 'HR', 'Finance'] },
    { name: 'Payroll Ops', icon: CreditCard, path: '/payroll', roles: ['Admin', 'Finance'] },
    { name: 'Intelligence Reports', icon: FileText, path: '/reports', roles: ['Admin', 'HR', 'Finance'] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(user?.role || ''));

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-900 font-['Inter'] overflow-hidden relative">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[45] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-[#0b1120] flex flex-col lg:static lg:translate-x-0 transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="h-20 flex items-center justify-between border-b border-slate-800/50 shrink-0 px-4 lg:px-6">
          <div className="flex items-center gap-2 text-cyan-400">
            <Cpu className="w-5 h-5 lg:w-6 lg:h-6 shrink-0" />
            <span className="text-base lg:text-xl font-black tracking-tight text-white uppercase">
              HR-Pay <span className="text-cyan-400">Nexus</span>
            </span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1.5 hover:bg-white/5 rounded-xl transition-colors shrink-0">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {filteredMenu.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) setIsSidebarOpen(false);
                }}
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'text-slate-400 border border-transparent hover:text-slate-200 hover:bg-white/5'
                  }`}
              >
                <item.icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'group-hover:text-slate-200'}`} />
                <span className="text-sm font-semibold tracking-tight">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Developer Credit */}
        <div className="p-3 lg:p-5 border-t border-slate-800/50 shrink-0">
          <div className="flex flex-row lg:flex-col items-center justify-start lg:justify-center gap-3 lg:text-center bg-[#0d1428] p-3 lg:p-4 rounded-2xl hover:bg-[#111930] transition-colors border border-slate-800/80 shadow-inner">
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center p-1 lg:p-1.5 bg-black shadow-lg shadow-cyan-500/10 shrink-0">
              <img src={shakirLogo} alt="Shakir Tech Solution" className="w-full h-full object-contain" />
            </div>
            <div className="text-left lg:text-center">
              <p className="text-[7px] lg:text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] leading-tight mb-0.5 lg:mb-1">Powered By</p>
              <p className="text-[9px] lg:text-[10px] font-black text-cyan-400 uppercase tracking-widest">Shakir Tech Solutions</p>
            </div>
          </div>
        </div>

        {/* User Quick Info - Sidebar Bottom */}
        <div className="p-4 border-t border-slate-800/50 lg:hidden">
          <div className="bg-slate-800/40 p-4 rounded-2xl space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/20 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">{displayName}</p>
                <p className="text-[10px] text-slate-500 font-medium truncate max-w-[120px]">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#f8fafc] relative overflow-hidden h-full">
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-4 sm:px-8 bg-[#0b1120] text-white shrink-0 z-40 border-b border-white/5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2.5 bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all lg:hidden flex"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop User Profile */}
            <div className="hidden lg:flex items-center gap-3">
              <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/20 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">{displayName}</p>
                <p className="text-[10px] text-slate-500 font-medium truncate max-w-[200px]">{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.1em]">
              <span className="text-slate-500">Security Node:</span>
              <span className="text-emerald-400">Active</span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setIsCredentialsModalOpen(true)}
                className="h-10 px-4 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center gap-2 hover:bg-slate-700 hover:border-cyan-500/50 transition-all group"
                title="Password Change"
              >
                <Shield className="w-4 h-4 text-slate-400 group-hover:text-cyan-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 group-hover:text-white">Change Password</span>
              </button>

              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="h-10 px-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center gap-2 hover:bg-rose-500/20 hover:border-rose-500/30 transition-all group"
                title="Logout"
              >
                <LogOut className="w-4 h-4 text-rose-400 group-hover:text-rose-300" />
                <span className="text-[10px] font-black uppercase tracking-widest text-rose-400 group-hover:text-rose-300">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 relative scroll-smooth flex flex-col">
          <div className="flex-1 max-w-7xl w-full mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <footer className="mt-12 pt-8 pb-4 border-t border-slate-200/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-center sm:text-right">
            HRPAY NEXUS
          </footer>
        </div>
      </main>

      <ChangeCredentialsModal
        isOpen={isCredentialsModalOpen}
        onClose={() => setIsCredentialsModalOpen(false)}
      />

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-sm bg-white border border-slate-200 rounded-[2rem] shadow-2xl overflow-hidden p-10 text-center space-y-6"
            >
              <div className="mx-auto w-16 h-16 rounded-3xl bg-red-50 text-red-500 flex items-center justify-center">
                <Shield className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Confirm Logout</h3>
                <p className="text-slate-500 text-sm font-medium mt-2 leading-relaxed">Are you sure you want to end your secure session?</p>
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full font-black text-[10px] uppercase tracking-widest transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 px-6 py-4 bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 rounded-full font-black text-[10px] uppercase tracking-widest transition-all active:scale-[0.98]"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Layout;
