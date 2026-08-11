import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import useAuth from '@/hooks/useAuth';
import api from '@/hooks/useApi';

export default function Customers() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

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

  if (loading || !user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <Layout>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Customers</h1>
        <div className="mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, number, or email..."
            className="w-full max-w-md px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
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
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => fetchCustomerDetail(customer.id)}
                >
                  <td className="px-6 py-4 text-sm font-medium">{customer.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{customer.whatsapp_number}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{customer.email || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {customer.conversations?.length || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedCustomer && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">
              {selectedCustomer.name} — History
            </h2>
            {selectedCustomer.conversations?.length === 0 ? (
              <p className="text-gray-400 text-sm">No conversations</p>
            ) : (
              <div className="space-y-4">
                {selectedCustomer.conversations?.map((conv) => (
                  <div key={conv.id} className="border rounded-lg p-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Conversation #{conv.id}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(conv.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">Status: {conv.status}</p>
                    {conv.messages?.slice(-3).map((msg) => (
                      <p key={msg.id} className="text-xs text-gray-400 mt-1 truncate">
                        {msg.direction}: {msg.message}
                      </p>
                    ))}
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
