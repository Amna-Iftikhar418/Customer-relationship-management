const statusColors = {
  NEW: 'bg-blue-100 text-blue-800',
  ASSIGNED: 'bg-yellow-100 text-yellow-800',
  IN_PROGRESS: 'bg-purple-100 text-purple-800',
  RESOLVED: 'bg-green-100 text-green-800',
  CLOSED: 'bg-gray-100 text-gray-800',
};

export default function StatusBadge({ status }) {
  if (!status) return null;
  const colorClass = statusColors[status] || 'bg-gray-100 text-gray-800';
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${colorClass}`}>
      {status.replace('_', ' ')}
    </span>
  );
}
