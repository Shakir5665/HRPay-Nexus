import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  CreditCard,
  Hourglass,
  Building2,
  LineChart,
  User,
  Calendar,
  Briefcase,
  History,
  Download,
  FileText
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await api.get('/dashboard/stats');
      return response.data;
    },
  });

  const { data: payrollHistory } = useQuery({
    queryKey: ['dashboard-payroll-history'],
    queryFn: async () => {
      const response = await api.get('/payroll/history');
      return response.data;
    },
    enabled: user?.role === 'Employee',
  });

  const handleDownloadPayslip = async (id: string) => {
    try {
      const response = await api.get(`/payroll/${id}/payslip`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Payslip_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Failed to download payslip:', err);
      alert('Failed to download payslip. Please try again later.');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-12 w-64 bg-slate-200 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-100 rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4 bg-white rounded-3xl border border-slate-200 p-12">
        <Building2 className="w-16 h-16 text-slate-300" />
        <h2 className="text-xl font-bold text-slate-800">Connection Interrupted</h2>
        <p className="text-slate-500 max-w-md text-sm">We couldn't synchronize with the Nexus core. Please check your network or refresh the page.</p>
        <button onClick={() => window.location.reload()} className="btn-primary mt-4">Retry Sync</button>
      </div>
    );
  }

  const departments = stats.departmentStats || [];

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <div className="flex items-center gap-3">
          <LineChart className="w-6 h-6 sm:w-8 sm:h-8 text-slate-800" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">The Overview</h1>
        </div>
        <p className="text-slate-500 font-medium text-xs sm:text-sm">Real-time systemic analytics of the HRPay Nexus Ecosystem</p>
      </header>

      <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 ${user?.role === 'Employee' ? 'lg:grid-cols-3' : 'lg:grid-cols-[repeat(13,minmax(0,1fr))]'}`}>
        {user?.role === 'Employee' ? (
          <>
            <StatCard
              title="Leave Balance"
              value={stats.leaveBalance}
              icon={Calendar}
              color="blue"
              onClick={() => navigate('/leaves')}
            />
            <StatCard
              title="Designation"
              value={stats.designation}
              icon={Briefcase}
              color="sky"
            />
            <StatCard
              title="Years with Nexus"
              value={new Date().getFullYear() - new Date(stats.joinedDate).getFullYear()}
              icon={History}
              color="green"
            />
          </>
        ) : (
          <>
            <StatCard
              title="Total Employees"
              value={stats.totalEmployees}
              icon={Users}
              color="blue"
              onClick={() => navigate('/employees')}
              className="lg:col-span-3"
            />
            <StatCard
              title="Monthly Payroll"
              value={`${stats.totalPayrollThisMonth?.toLocaleString() || 0}.00`}
              icon={CreditCard}
              color="green"
              onClick={() => navigate('/payroll')}
              className="lg:col-span-4"
            />
            <StatCard
              title="Pending Leaves"
              value={stats.pendingLeaves}
              icon={Hourglass}
              color="amber"
              onClick={() => navigate('/leaves')}
              className="lg:col-span-3"
            />
            <StatCard
              title="Departments"
              value={departments.length}
              icon={Building2}
              color="sky"
              className="lg:col-span-3"
            />
          </>
        )}
      </div>

      {user?.role === 'Employee' ? (
        <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm mt-8">
          <div className="p-6 border-b-4 border-cyan-400 bg-slate-50/30">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-slate-700" />
              <h2 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-tight">Payment History</h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-slate-900 text-xs font-black uppercase tracking-wider">
                  <th className="px-8 py-5">Period</th>
                  <th className="px-8 py-5">Net Pay</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payrollHistory?.slice(0, 5).map((p: any) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-8 py-5 text-sm font-bold text-slate-900 uppercase">
                      {new Date(p.year, p.month - 1).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                        LKR {p.netSalary?.toLocaleString() || '0.00'}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${p.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {p.status || 'Paid'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button onClick={() => handleDownloadPayslip(p.id)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors" title="Download Payslip">
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {(!payrollHistory || payrollHistory.length === 0) && (
                  <tr>
                    <td colSpan={4} className="px-8 py-12 text-center text-slate-400 text-xs font-black uppercase tracking-widest italic">No Payment Records Found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
          <div className="p-6 border-b-4 border-cyan-400 bg-slate-50/30">
            <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-slate-700" />
            <h2 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-tight">Departments Overview</h2>
          </div>
        </div>

        {/* Desktop View Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-900 text-xs font-black uppercase tracking-wider">
                <th className="px-8 py-5">Department Code</th>
                <th className="px-8 py-5">Name</th>
                <th className="px-8 py-5">Employees</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {departments.map((dept: any) => (
                <tr key={dept.code} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 bg-slate-800 text-white text-[10px] font-bold rounded-lg uppercase">
                      {dept.code}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-900">
                    {dept.name}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-700">{dept.count}</span>
                      <User className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View Cards */}
        <div className="md:hidden divide-y divide-slate-100">
            {departments.map((dept: any) => (
                <div key={dept.code} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="space-y-1">
                        <span className="px-2 py-0.5 bg-slate-800 text-white text-[9px] font-black rounded-md uppercase tracking-tighter">
                            {dept.code}
                        </span>
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">{dept.name}</h3>
                    </div>
                    <div className="flex flex-col items-end">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Staff</p>
                        <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                            <span className="text-xs font-black text-slate-900">{dept.count}</span>
                            <User className="w-3 h-3 text-slate-400" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color, onClick, className = '' }: any) => {
  const iconStyles: any = {
    blue: 'text-blue-500 bg-blue-50',
    green: 'text-emerald-500 bg-emerald-50',
    amber: 'text-amber-500 bg-amber-50',
    sky: 'text-sky-500 bg-sky-50',
  };

  return (
    <div 
      onClick={onClick}
      className={`bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex items-center justify-between group transition-all ${onClick ? 'cursor-pointer hover:shadow-xl hover:-translate-y-1 hover:border-slate-300' : ''} ${className}`}
    >
      <div className="min-w-0">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 truncate">{title}</p>
        <p className={`text-2xl sm:text-3xl font-black tracking-tight ${color === 'green' ? 'text-emerald-600' : 'text-slate-900'} break-words`}>
          {value}
        </p>
      </div>
      <div className={`p-4 rounded-2xl transition-all group-hover:scale-110 shrink-0 ${iconStyles[color]}`}>
        <Icon className="w-6 h-6 sm:w-8 sm:h-8 stroke-[1.5]" />
      </div>
    </div>
  );
};

export default Dashboard;
