export default function MessageBubble({ message }) {
  const isOutbound = message.direction === 'OUTBOUND';

  return (
    <div className={`flex ${isOutbound ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isOutbound
            ? 'bg-green-500 text-white rounded-br-none'
            : 'bg-white text-gray-900 border rounded-bl-none'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{message.message}</p>
        <p
          className={`text-xs mt-1 ${
            isOutbound ? 'text-green-100' : 'text-gray-400'
          }`}
        >
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          {isOutbound && ` · ${message.status}`}
        </p>
      </div>
    </div>
  );
}
