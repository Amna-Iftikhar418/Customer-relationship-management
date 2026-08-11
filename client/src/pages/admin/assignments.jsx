import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import useAuth from '@/hooks/useAuth';
import StatusBadge from '@/components/StatusBadge';
import api from '@/hooks/useApi';

export default function Assignments() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState([]);
  const [agents, setAgents] = useState([]);

   useEffect(() => {
     if (!loading && !user) {
       router.push('/login');
     } else if (!loading && user && user.role !== 'ADMIN') {
       router.push('/dashboard');
     }
   }, [user, loading, router]);

   useEffect(() => {
     if (user?.role === 'ADMIN') {
       fetchData();
     }
   }, [user]);

  const fetchData = async () => {
    try {
      const [convRes, usersRes] = await Promise.all([
        api.get('/conversations'),
        api.get('/users'),
      ]);
      setConversations(convRes.data);
      setAgents(usersRes.data.filter((u) => u.role === 'AGENT'));
    } catch (err) {
      console.error('Failed to fetch data:', err);
    }
  };

  const handleAssign = async (conversationId, agentId) => {
    try {
      await api.post(`/conversations/${conversationId}/assign`, {
        agent_id: agentId,
      });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to assign conversation');
    }
  };

   if (loading || !user || user.role !== 'ADMIN') {
     return <div className="flex items-center justify-center h-screen">Loading...</div>;
   }

   return (
     <Layout>
       <div className="p-8">
         <h1 className="text-2xl font-bold mb-6">Chat Assignments</h1>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assign</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {conversations.map((conv) => (
                <tr key={conv.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">#{conv.id}</td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {conv.customer?.name || conv.customer?.whatsapp_number}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <StatusBadge status={conv.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {conv.assigned_to
                      ? agents.find((a) => a.id === conv.assigned_to)?.name || `User #${conv.assigned_to}`
                      : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <select
                      value={conv.assigned_to || ''}
                      onChange={(e) => handleAssign(conv.id, e.target.value)}
                      className="px-2 py-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Unassigned</option>
                      {agents.map((agent) => (
                        <option key={agent.id} value={agent.id}>
                          {agent.name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
