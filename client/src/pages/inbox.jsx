import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import useAuth from '@/hooks/useAuth';
import ConversationList from '@/components/ConversationList';
import ChatPanel from '@/components/ChatPanel';
import api from '@/hooks/useApi';

export default function Inbox() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedConv, setSelectedConv] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  const fetchConversations = async () => {
    try {
      const res = await api.get('/conversations');
      setConversations(res.data);
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
    }
  };

  const handleSelect = async (id) => {
    setSelectedId(id);
    try {
      const res = await api.get(`/conversations/${id}`);
      setSelectedConv(res.data);
    } catch (err) {
      console.error('Failed to fetch conversation:', err);
    }
  };

  if (loading || !user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <Layout>
      <div className="flex h-full">
        <div className="w-80 border-r bg-white">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-lg">Conversations</h2>
          </div>
          <ConversationList
            conversations={conversations}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        </div>
        <div className="flex-1">
          <ChatPanel conversationId={selectedId} conversation={selectedConv} />
        </div>
      </div>
    </Layout>
  );
}
