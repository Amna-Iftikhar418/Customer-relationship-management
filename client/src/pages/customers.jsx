import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import useAuth from '@/hooks/useAuth';
import api from '@/hooks/useApi';

export default function Customers() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchCustomers();
    }
  }, [user]);

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/customers');
      setCustomers(res.data);
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    }
  };

  const filtered = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.whatsapp_number?.includes(search) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
  );

  const fetchCustomerDetail = async (id) => {
    try {
      const res = await api.get(`/customers/${id}`);
      setSelectedCustomer(res.data);
    } catch (err) {
      console.error('Failed to fetch customer detail:', err);
    }
  };

  const handleDeleteConversation = async (convId) => {
    if (!window.confirm('Delete this conversation and all of its messages?')) return;
    setDeleting(convId);
    try {
      await api.delete(`/conversations/${convId}`);
      await fetchCustomerDetail(selectedCustomer.id);
      await fetchCustomers();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete conversation');
    } finally {
      setDeleting(null);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (loading || !user) {
    return <div className="flex items-center justify-center h-screen bg-gray-50">Loading...</div>;
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6 lg:p-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display font-bold text-2xl tracking-tight text-gray-900">Customers</h1>
            <p className="mt-1 text-sm text-gray-500">
              Everyone who has reached out on WhatsApp, and their conversation history.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, number, or email..."
              className="w-full sm:w-64 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-wa/60 focus:border-wa/40 transition"
            />
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3V9a.75.75 0 0 1-1.5 0V5.25a1.5 1.5 0 0 0-1.5-1.5h-6Zm10.72 4.72a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06l1.72-1.72H9.75a.75.75 0 0 1 0-1.5h10.19l-1.72-1.72a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">WhatsApp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conversations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((customer) => (
                <tr
                  key={customer.id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => fetchCustomerDetail(customer.id)}
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">{customer.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{customer.whatsapp_number}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{customer.email || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {customer._count?.conversations ?? 0}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-400">
                    No customers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {selectedCustomer && (
          <div className="mt-8 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-lg tracking-tight text-gray-900">
                  {selectedCustomer.name} — History
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">{selectedCustomer.whatsapp_number}</p>
              </div>
              <span className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                {selectedCustomer.conversations?.length || 0} conversations
              </span>
            </div>

            {selectedCustomer.conversations?.length === 0 ? (
              <p className="mt-4 text-gray-400 text-sm">No conversations</p>
            ) : (
              <div className="mt-4 space-y-4">
                {selectedCustomer.conversations?.map((conv) => (
                  <div key={conv.id} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-800">Conversation #{conv.id.slice(0, 8)}</span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 uppercase tracking-wide">
                          {conv.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400">
                          {new Date(conv.created_at).toLocaleDateString()}
                        </span>
                        {user?.role === 'ADMIN' && (
                          <button
                            onClick={() => handleDeleteConversation(conv.id)}
                            disabled={deleting === conv.id}
                            className="text-xs px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 disabled:opacity-50 transition-colors"
                          >
                            {deleting === conv.id ? 'Deleting...' : 'Del'}
                          </button>
                        )}
                      </div>
                    </div>
                    {conv.messages?.length ? (
                      <div className="mt-2 space-y-1">
                        {conv.messages.map((msg) => (
                          <p key={msg.id} className="text-xs text-gray-400 truncate">
                            <span className={`font-medium ${msg.direction === 'OUTBOUND' ? 'text-wa-dark' : 'text-gray-600'}`}>
                              {msg.direction === 'OUTBOUND' ? 'Agent' : 'Customer'}:
                            </span>{' '}
                            {msg.message}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-300">No messages</p>
                    )}
                    {conv.agent && (
                      <p className="mt-2 text-xs text-gray-400">Assigned to: {conv.agent.name}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
