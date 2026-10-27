import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import nomadLogo from '../assets/Nomad_Logo_tp.png';
import { supabase } from '../api/supabaseClient';

export default function AdminHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [adminName, setAdminName] = useState('');

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('USERS')
        .select('name')
        .eq('auth_uuid', user.id)
        .single();
      if (data) setAdminName(data.name);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-border-subtle px-8 py-3 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-6">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <img src={nomadLogo} alt="Logo" className="w-8 h-8 object-contain" />
          <span className="font-extrabold text-sm tracking-tight text-text-primary hidden md:block">
            Nomad: Intelligent Travel Planner
          </span>
        </div>
        
        {/* Admin Navigation Tabs */}
        <nav className="flex bg-bg-main p-1 rounded-2xl">
          <button 
            onClick={() => navigate('/admin/overview')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              location.pathname === '/admin/overview' 
              ? 'bg-white shadow-sm text-primary-orange' 
              : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Overview
          </button>
          <button 
            onClick={() => navigate('/admin/management')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              location.pathname === '/admin/management' 
              ? 'bg-white shadow-sm text-primary-orange' 
              : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Management Table
          </button>
        </nav>
      </div>

      {/* User Profile Section */}
      <div className="flex items-center gap-4 border-l border-border-subtle pl-6">
        <div className="text-right">
          <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest leading-none">Have a Great Time!</p>
          <p className="text-sm font-black text-text-primary">{adminName || 'Admin'}</p>
        </div>
        <div className="w-10 h-10 bg-primary-blue/10 rounded-full flex items-center justify-center text-primary-blue border-2 border-white shadow-sm">
          <User size={20} />
        </div>
        <button onClick={handleLogout} className="text-text-secondary hover:text-red-500 transition-colors ml-2">
           <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}