import { useEffect, useState } from 'react';
import { supabase } from '../api/supabaseClient';
import AdminHeader from '../components/AdminHeader';
import { Search, Trash2, ChevronDown, Edit2, Check, X } from 'lucide-react';

export default function AdminManagement() {
  const [table, setTable] = useState('USERS');
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', role: '' });

  useEffect(() => {
    let ignore = false;
    setRecords([]);
    fetchTableData().then((data) => {
      if (!ignore) setRecords(data);
    });
    return () => {
      ignore = true;
    };
  }, [table]);

  async function fetchTableData() {
    const { data } = await supabase.from(table).select('*').order('created_at', { ascending: false });
    return data || [];
  }

  const handleDelete = async (id) => {
    const pk = table === 'USERS' ? 'user_id' : 'trip_id';
    if (window.confirm("Confirm delete record?")) {
      await supabase.from(table).delete().eq(pk, id);
      const data = await fetchTableData();
      setRecords(data);
    }
  };

  const startEditing = (user) => {
    setEditingId(user.user_id);
    setEditForm({ name: user.name, role: user.role });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({ name: '', role: '' });
  };

  const saveUser = async (id) => {
    try {
      const { error } = await supabase
        .from('USERS')
        .update({ name: editForm.name, role: editForm.role })
        .eq('user_id', id);

      if (error) throw error;

      setEditingId(null);
      const data = await fetchTableData();
      setRecords(data);
    } catch (error) {
      alert('Error updating user: ' + error.message);
    }
  };

  const filtered = records.filter(r => {
    if (!search) return true;
    const term = search.toLowerCase();
    if (table === 'USERS') return r.email?.toLowerCase().includes(term);
    if (table === 'TRIPS') return r.name?.toLowerCase().includes(term);
    return Object.values(r).some(val => String(val).toLowerCase().includes(term));
  });

  return (
    <div className="min-h-screen bg-bg-main font-sans">
      <AdminHeader />
      <main className="p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="relative group">
            <select 
              onChange={(e) => setTable(e.target.value)}
              className="appearance-none bg-white border border-border-subtle px-6 py-3 pr-12 rounded-2xl font-black text-sm text-text-primary shadow-sm outline-none focus:ring-2 focus:ring-primary-blue transition-all"
            >
              <option value="USERS">Manage Users</option>
              <option value="TRIPS">Manage Trips</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" size={16} />
          </div>

          <div className="relative w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
            <input 
              type="text" 
              placeholder={table === 'USERS' ? "Search by email..." : "Search by trip name..."}
              className="w-full pl-12 pr-4 py-3 bg-white border border-border-subtle rounded-2xl outline-none focus:ring-2 focus:ring-primary-orange shadow-sm text-sm"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-border-subtle overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-border-subtle">
                {table === 'USERS' ? (
                  <>
                    <th className="p-5 text-[11px] font-black uppercase text-text-secondary">Name</th>
                    <th className="p-5 text-[11px] font-black uppercase text-text-secondary">Email</th>
                    <th className="p-5 text-[11px] font-black uppercase text-text-secondary">Role</th>
                  </>
                ) : (
                  <>
                    <th className="p-5 text-[11px] font-black uppercase text-text-secondary">Name</th>
                    <th className="p-5 text-[11px] font-black uppercase text-text-secondary">Destination</th>
                    <th className="p-5 text-[11px] font-black uppercase text-text-secondary">Budget</th>
                    <th className="p-5 text-[11px] font-black uppercase text-text-secondary">Status</th>
                  </>
                )}
                <th className="p-5 text-right text-[11px] font-black uppercase text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={table === 'USERS' ? item.user_id : item.trip_id} className="border-b border-gray-50 hover:bg-bg-main/30 transition-colors">
                  {table === 'USERS' ? (
                    <>
                      <td className="p-5 text-sm font-bold text-text-primary">
                        {editingId === item.user_id ? (
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="w-full p-2 border border-border-subtle rounded-lg outline-none focus:border-primary-blue"
                          />
                        ) : item.name}
                      </td>
                      <td className="p-5 text-sm text-text-secondary">{item.email}</td>
                      <td className="p-5">
                        {editingId === item.user_id ? (
                          <select
                            value={editForm.role}
                            onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                            className="p-2 border border-border-subtle rounded-lg text-xs font-bold uppercase outline-none focus:border-primary-blue"
                          >
                            <option value="traveler">Traveler</option>
                            <option value="admin">Admin</option>
                          </select>
                        ) : (
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${item.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-primary-blue/10 text-primary-blue'}`}>
                            {item.role}
                          </span>
                        )}
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-5 text-sm font-bold text-text-primary">{item.name}</td>
                      <td className="p-5 text-sm font-bold text-text-primary">{item.destination}</td>
                      <td className="p-5 text-sm text-text-secondary">RM {item.budget_total}</td>
                      <td className="p-5 text-sm font-bold">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                          item.status === 'Completed' ? 'bg-status-completed/10 text-status-completed' : 'bg-status-ongoing/10 text-status-ongoing'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </>
                  )}
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2">
                      {table === 'USERS' && editingId === item.user_id ? (
                        <>
                          <button onClick={() => saveUser(item.user_id)} className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition-all">
                            <Check size={18} />
                          </button>
                          <button onClick={cancelEditing} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all">
                            <X size={18} />
                          </button>
                        </>
                      ) : (
                        <>
                          {table === 'USERS' && (
                            <button onClick={() => startEditing(item)} className="p-2 text-text-secondary hover:text-primary-blue hover:bg-blue-50 rounded-xl transition-all">
                              <Edit2 size={18} />
                            </button>
                          )}
                          <button 
                            onClick={() => handleDelete(table === 'USERS' ? item.user_id : item.trip_id)}
                            className="p-2 text-text-secondary hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}