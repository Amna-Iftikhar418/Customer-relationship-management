import { useState, useEffect, useRef } from 'react';
import api from '@/hooks/useApi';
import useAuth from '@/hooks/useAuth';
import MessageBubble from './MessageBubble';
import StatusBadge from './StatusBadge';

export default function ChatPanel({ conversationId, conversation }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!conversationId) return;
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [conversationId]);

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/conversations/${conversationId}`);
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setSending(true);
    try {
      await api.post('/send', {
        conversation_id: conversationId,
        message: newMessage.trim(),
      });
      setNewMessage('');
      fetchMessages();
    } catch (err) {
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await api.patch(`/conversations/${conversationId}`, { status: newStatus });
      fetchMessages();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update status');
    }
  };

  if (!conversationId) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Select a conversation to start chatting
      </div>
    );
  }

  const statusFlow = ['NEW', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
  const currentIdx = statusFlow.indexOf(conversation?.status);
  const nextStatus = statusFlow[currentIdx + 1];

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b bg-white flex justify-between items-center">
        <div>
          <h2 className="font-semibold">
            {conversation?.customer?.name || conversation?.customer?.whatsapp_number}
          </h2>
          <p className="text-xs text-gray-500">{conversation?.customer?.whatsapp_number}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={conversation?.status} />
          {nextStatus && user?.role === 'AGENT' && (
            <button
              onClick={() => handleStatusChange(nextStatus)}
              className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              → {nextStatus.replace('_', ' ')}
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 border-t bg-white flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={sending}
        />
        <button
          type="submit"
          disabled={sending || !newMessage.trim()}
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sending ? '...' : 'Send'}
        </button>
      </form>
    </div>
  );
}
