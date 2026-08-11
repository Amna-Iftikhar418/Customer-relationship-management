import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import useAuth from '@/hooks/useAuth';
import api from '@/hooks/useApi';

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
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const statCards = [
    { label: 'Total', value: stats?.total || 0, color: 'bg-blue-500' },
    { label: 'New', value: stats?.new || 0, color: 'bg-blue-400' },
    { label: 'Assigned', value: stats?.assigned || 0, color: 'bg-yellow-500' },
    { label: 'In Progress', value: stats?.inProgress || 0, color: 'bg-purple-500' },
    { label: 'Resolved', value: stats?.resolved || 0, color: 'bg-green-500' },
    { label: 'Closed', value: stats?.closed || 0, color: 'bg-gray-500' },
  ];

  return (
    <Layout>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">
          Dashboard
          <span className="text-sm font-normal text-gray-500 ml-2">
            ({user.role})
          </span>
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {statCards.map((card) => (
            <div
              key={card.label}
              className={`${card.color} text-white rounded-xl p-6 shadow`}
            >
              <p className="text-sm font-medium opacity-80">{card.label}</p>
              <p className="text-3xl font-bold mt-2">{card.value}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
