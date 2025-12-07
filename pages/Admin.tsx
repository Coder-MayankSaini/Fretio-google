import React, { useEffect, useState } from 'react';
import { User, UserRole, SubscriptionStatus, PurchaseRecord } from '../types';
import { DB } from '../services/db';
import { Filter, ArrowUpDown } from 'lucide-react';

interface AdminProps {
  currentUser: User;
}

const Admin: React.FC<AdminProps> = ({ currentUser }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [purchases, setPurchases] = useState<PurchaseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, PRO, TRIAL
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [u, p] = await Promise.all([DB.getAllUsers(), DB.getAllPurchases()]);
        setUsers(u);
        setPurchases(p);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (currentUser.role !== UserRole.ADMIN) {
    return <div className="pt-24 text-center text-red-500">Access Denied</div>;
  }

  // Filter
  let displayUsers = users.filter(u => {
    if (filter === 'ALL') return true;
    if (filter === 'PRO') return u.subscriptionStatus === SubscriptionStatus.PRO_ACTIVE;
    if (filter === 'TRIAL') return u.subscriptionStatus === SubscriptionStatus.TRIAL_ACTIVE;
    return true;
  });

  // Sort
  displayUsers.sort((a, b) => {
    if (sortOrder === 'newest') return b.createdAt - a.createdAt;
    return a.createdAt - b.createdAt;
  });

  const toggleSort = () => {
    setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest');
  }

  return (
    <div className="pt-24 min-h-screen bg-slate-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Console</h1>
            <p className="text-sm text-slate-500">Overview of users and revenue.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
             <button 
               onClick={toggleSort}
               className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border shadow-sm text-sm font-medium text-slate-600 hover:bg-slate-50"
             >
               <ArrowUpDown size={14} />
               <span>{sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}</span>
             </button>

            <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border shadow-sm">
              <Filter size={16} className="text-slate-400" />
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className="bg-transparent border-none text-sm font-medium focus:ring-0 text-slate-600 outline-none pr-2"
              >
                <option value="ALL">All Users</option>
                <option value="PRO">Pro Members</option>
                <option value="TRIAL">Active Trials</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <div className="text-xs text-slate-500 uppercase font-semibold">Total Users</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{users.length}</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <div className="text-xs text-slate-500 uppercase font-semibold">Revenue</div>
            <div className="text-2xl font-bold text-green-600 mt-1">₹{purchases.reduce((acc, curr) => acc + curr.amount, 0)}</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <div className="text-xs text-slate-500 uppercase font-semibold">Pro Members</div>
            <div className="text-2xl font-bold text-brand-purple mt-1">
              {users.filter(u => u.subscriptionStatus === SubscriptionStatus.PRO_ACTIVE).length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <div className="text-xs text-slate-500 uppercase font-semibold">Trials Used</div>
            <div className="text-2xl font-bold text-brand-teal mt-1">
              {users.filter(u => u.trialStartedAt).length}
            </div>
          </div>
        </div>

        {/* User Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name / Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Canva Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Trial</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {loading ? (
                  <tr><td colSpan={5} className="px-6 py-10 text-center">Loading...</td></tr>
                ) : displayUsers.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-10 text-center">No users found</td></tr>
                ) : (
                  displayUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-slate-900">{u.name}</div>
                            <div className="text-sm text-slate-500">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-600">{u.canvaEmail}</div>
                        <div className="text-xs text-slate-400">{u.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${u.subscriptionStatus === SubscriptionStatus.PRO_ACTIVE ? 'bg-green-100 text-green-800' : 
                            u.subscriptionStatus === SubscriptionStatus.TRIAL_ACTIVE ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'}`}>
                          {u.subscriptionStatus.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {u.trialStartedAt ? new Date(u.trialStartedAt).toLocaleDateString() : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;