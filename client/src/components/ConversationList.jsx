import StatusBadge from './StatusBadge';

export default function ConversationList({ conversations, selectedId, onSelect }) {
  if (!conversations || conversations.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        No conversations
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-full">
      {conversations.map((conv) => (
        <div
          key={conv.id}
          onClick={() => onSelect(conv.id)}
          className={`p-3 border-b cursor-pointer transition-colors ${
            selectedId === conv.id ? 'bg-green-50 border-l-4 border-l-green-500' : 'hover:bg-gray-50'
          }`}
        >
          <div className="flex justify-between items-start">
            <p className="font-medium text-sm truncate">
              {conv.customer?.name || conv.customer?.whatsapp_number}
            </p>
            <StatusBadge status={conv.status} />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {conv.customer?.whatsapp_number}
          </p>
          {conv.messages?.length > 0 && (
            <p className="text-xs text-gray-400 mt-1 truncate">
              {conv.messages[conv.messages.length - 1].message}
            </p>
          )}
          <p className="text-xs text-gray-300 mt-1">
            {new Date(conv.updated_at).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}
