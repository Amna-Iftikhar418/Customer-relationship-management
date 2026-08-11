import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import useAuth from '@/hooks/useAuth';
import api from '@/hooks/useApi';

const statCards = [
  { key: 'total', label: 'Total', value: 0, color: 'text-gray-800', ring: 'border-gray-200', dot: 'bg-gray-500' },
  { key: 'new', label: 'New', value: 0, color: 'text-blue-600', ring: 'border-blue-200', dot: 'bg-blue-500' },
  { key: 'assigned', label: 'Assigned', value: 0, color: 'text-amber-600', ring: 'border-amber-200', dot: 'bg-amber-500' },
  { key: 'inProgress', label: 'In Progress', value: 0, color: 'text-purple-600', ring: 'border-purple-200', dot: 'bg-purple-500' },
  { key: 'resolved', label: 'Resolved', value: 0, color: 'text-green-600', ring: 'border-green-200', dot: 'bg-green-500' },
  { key: 'closed', label: 'Closed', value: 0, color: 'text-gray-600', ring: 'border-gray-200', dot: 'bg-gray-400' },
];

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const res = await api.get('/conversations');
      const conversations = res.data;
      setStats({
        total: conversations.length,
        new: conversations.filter((c) => c.status === 'NEW').length,
        assigned: conversations.filter((c) => c.status === 'ASSIGNED').length,
        inProgress: conversations.filter((c) => c.status === 'IN_PROGRESS').length,
        resolved: conversations.filter((c) => c.status === 'RESOLVED').length,
        closed: conversations.filter((c) => c.status === 'CLOSED').length,
      });
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  if (loading || !user) {
    return <div className="flex items-center justify-center h-screen bg-gray-50">Loading...</div>;
  }

  const pipeline = [
    { label: 'New', count: stats?.new || 0, dot: 'bg-blue-500' },
    { label: 'Assigned', count: stats?.assigned || 0, dot: 'bg-amber-500' },
    { label: 'In Progress', count: stats?.inProgress || 0, dot: 'bg-purple-500' },
    { label: 'Resolved', count: stats?.resolved || 0, dot: 'bg-green-500' },
    { label: 'Closed', count: stats?.closed || 0, dot: 'bg-gray-400' },
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6 lg:p-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display font-bold text-2xl tracking-tight text-gray-900">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">
              Welcome back, <span className="font-medium text-gray-800">{user.name}</span>. Here&apos;s how your inbox looks today.
            </p>
          </div>
          <span className="px-3 py-1.5 rounded-full bg-wa/15 border border-wa/30 text-wa text-xs font-bold">
            {user.role}
          </span>
        </div>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {statCards.map((card) => (
            <div
              key={card.key}
              className={`bg-white rounded-2xl border ${card.ring} p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${card.dot}`} />
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{card.label}</p>
              </div>
              <p className={`mt-3 text-3xl font-bold ${card.color}`}>{stats?.[card.key] || 0}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-lg tracking-tight text-gray-900">Conversation pipeline</h2>
            <span className="text-xs text-gray-400">{stats?.total || 0} total</span>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {pipeline.map((step, i) => (
              <div key={step.label} className="flex items-center gap-3">
                <div className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${step.dot}`} />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{step.label}</p>
                    <p className="text-xs text-gray-400">{step.count} chats</p>
                  </div>
                </div>
                {i < pipeline.length - 1 && (
                  <svg className="w-5 h-5 text-gray-300 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M3 10a.75.75 0 0 1 .75-.75h9.69l-2.72-2.72a.75.75 0 0 1 1.06-1.06l4 4a.75.75 0 0 1 0 1.06l-4 4a.75.75 0 1 1-1.06-1.06l2.72-2.72H3.75A.75.75 0 0 1 3 10Z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
