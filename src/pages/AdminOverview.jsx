import { useEffect, useState } from 'react';
import { supabase } from '../api/supabaseClient';
import AdminHeader from '../components/AdminHeader';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const AppColors = {
  primaryBlue: '#3EBDE0',
  primaryOrange: '#FAA621',
  accentGreen: '#A7D820',
  purple: '#8B5CF6',
  pink: '#EC4899',
  red: '#EF4444',
  cyan: '#06B6D4',
  gray: '#94a3b8'
};

const PurposeColors = {
  'Sightseeing': '#3EBDE0',
  'Food Hunting': '#FAA621',
  'Shopping': '#EC4899',
  'Adventure': '#A7D820',
  'Relaxation': '#60A5FA',
  'Cultural Exploration': '#8B5CF6',
  'Photography': '#F87171',
  'Nature & Wildlife': '#10B981',
  'Fitness & Wellness': '#84CC16',
  'Business': '#64748B',
  'Family Vacation': '#F59E0B',
  'Couple Retreat': '#DB2777',
  'Education / Study Tour': '#6366F1',
  'Event / Festival': '#D97706',
  'Religious / Spiritual': '#7C3AED',
  'Road Trip': '#EA580C',
  'Cruise / Island Hopping': '#06B6D4',
  'Art & Creativity': '#D946EF',
  'Nightlife & Entertainment': '#4F46E5',
  'Unspecified': '#94A3B8'
};

export default function AdminOverview() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeTrips: 0,
    completedTrips: 0,
    customActivities: 0,
    avgDuration: 0,
    avgBudget: 0
  });
  const [charts, setCharts] = useState({
    pieData: [],
    barData: []
  });
  const [filter, setFilter] = useState('all_time');

  useEffect(() => {
    fetchDashboardData();
  }, [filter]);

  async function fetchDashboardData() {
    try {
      let startDate = null;
      const now = new Date();

      if (filter === 'today') {
        startDate = new Date(now.setHours(0, 0, 0, 0)).toISOString();
      } else if (filter === 'last_week') {
        const d = new Date();
        d.setDate(d.getDate() - 7);
        startDate = d.toISOString();
      } else if (filter === 'last_month') {
        const d = new Date();
        d.setMonth(d.getMonth() - 1);
        startDate = d.toISOString();
      }

      const applyFilter = (query) => {
        if (startDate) {
          return query.gte('created_at', startDate);
        }
        return query;
      };

      // 1. Fetch Users (for count and growth chart)
      let usersQuery = supabase
        .from('USERS')
        .select('created_at')
        .eq('role', 'traveler');
      const { data: users, error: usersError } = await applyFilter(usersQuery);
      if (usersError) throw usersError;

      // 2. Fetch Trips (for stats and purpose distribution)
      let tripsQuery = supabase
        .from('TRIPS')
        .select('status, duration, budget_total, trip_purpose');
      const { data: trips, error: tripsError } = await applyFilter(tripsQuery);
      if (tripsError) throw tripsError;

      // 3. Fetch Custom Activities Count
      let actQuery = supabase
        .from('ACTIVITIES')
        .select('*', { count: 'exact', head: true })
        .eq('is_custom', true);
      const { count: activitiesCount, error: actError } = await applyFilter(actQuery);
      if (actError) throw actError;

      // 4. Fetch Total Active Trips (Global - ignoring date filter)
      const { count: globalActiveTrips, error: activeError } = await supabase
        .from('TRIPS')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Ongoing');
      if (activeError) throw activeError;

      // --- Calculations ---

      // Stats
      const completedTrips = trips.filter(t => t.status === 'Completed').length;
      
      const totalDuration = trips.reduce((acc, curr) => acc + (curr.duration || 0), 0);
      const totalBudget = trips.reduce((acc, curr) => acc + (curr.budget_total || 0), 0);
      
      const avgDuration = trips.length ? (totalDuration / trips.length).toFixed(1) : 0;
      const avgBudget = trips.length ? (totalBudget / trips.length).toFixed(0) : 0;

      setStats({
        totalUsers: users.length,
        activeTrips: globalActiveTrips,
        completedTrips,
        customActivities: activitiesCount || 0,
        avgDuration,
        avgBudget
      });

      // Pie Chart: Trip Purpose Distribution
      const purposeMap = {};
      trips.forEach(t => {
        if (!t.trip_purpose) {
          purposeMap['Unspecified'] = (purposeMap['Unspecified'] || 0) + 1;
        } else {
          t.trip_purpose.split(',').forEach(p => {
            const trimmed = p.trim();
            if (trimmed) purposeMap[trimmed] = (purposeMap[trimmed] || 0) + 1;
          });
        }
      });
      const pieData = Object.entries(purposeMap)
        .map(([name, value]) => ({
          name,
          value,
          color: PurposeColors[name] || AppColors.gray
        }))
        .filter((item) => item.value > 0)
        .sort((a, b) => b.value - a.value);

      // Bar Chart: User Growth (Group by Month)
      const growthMap = {};
      users.forEach(u => {
        const date = new Date(u.created_at);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        growthMap[key] = (growthMap[key] || 0) + 1;
      });
      const barData = Object.keys(growthMap).sort().map(key => {
        const [year, month] = key.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return {
          name: date.toLocaleString('default', { month: 'short' }),
          value: growthMap[key]
        };
      });

      setCharts({ pieData, barData });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  }

  return (
    <div className="min-h-screen bg-bg-main font-sans">
      <AdminHeader />
      <main className="p-8 max-w-7xl mx-auto">
        
        <div className="flex justify-end mb-6">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-white border border-border-subtle text-text-primary font-bold text-sm rounded-xl p-3 focus:outline-none focus:border-primary-blue shadow-sm cursor-pointer"
          >
            <option value="all_time">All Time</option>
            <option value="last_month">Last Month</option>
            <option value="last_week">Last Week</option>
            <option value="today">Today</option>
          </select>
        </div>
        
        {/* 6 Box Grid Alignment */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {[
            { title: 'Total registered users', value: stats.totalUsers, suffix: 'users' },
            { title: 'Total active trips', value: stats.activeTrips, suffix: 'trips' },
            { title: 'Total completed trips', value: stats.completedTrips, suffix: 'trips' },
            { title: 'Total custom activities', value: stats.customActivities, suffix: 'activities' },
            { title: 'Average trip duration', value: stats.avgDuration, suffix: 'days' },
            { title: 'Average trip budget', value: `RM ${stats.avgBudget}`, suffix: '' },
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-4xl shadow-sm border border-border-subtle flex flex-col justify-between h-36 hover:shadow-md transition-shadow">
              <span className="text-text-secondary text-[11px] font-black uppercase tracking-widest">{item.title}</span>
              <div className="flex items-baseline justify-end gap-2">
                 <span className="text-3xl font-black text-text-primary">{item.value}</span>
                 <span className="text-xs font-bold text-text-secondary">{item.suffix}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-border-subtle h-140">
            <h3 className="font-black text-lg text-text-primary mb-6">Trip Purpose Distribution</h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={charts.pieData} 
                  cx="40%" 
                  cy="50%" 
                  innerRadius={80} 
                  outerRadius={110} 
                  paddingAngle={8} 
                  dataKey="value"
                >
                  {charts.pieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ maxHeight: '100%', overflowY: 'auto', paddingLeft: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-border-subtle h-100">
            <h3 className="font-black text-lg text-text-primary mb-6">User Growth Overview</h3>
             <ResponsiveContainer width="100%" height="85%">
              <BarChart data={charts.barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600}} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Legend verticalAlign="top" height={36} align="right" />
                <Bar name="Registered Users" dataKey="value" fill={AppColors.primaryBlue} radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}