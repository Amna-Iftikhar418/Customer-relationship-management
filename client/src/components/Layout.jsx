import { useRouter } from 'next/router';
import Link from 'next/link';
import useAuth from '@/hooks/useAuth';
import WhatsAppIcon from '@/components/WhatsAppIcon';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', roles: ['ADMIN', 'AGENT'] },
  { href: '/inbox', label: 'Inbox', roles: ['ADMIN', 'AGENT'] },
  { href: '/customers', label: 'Customers', roles: ['ADMIN', 'AGENT'] },
  { href: '/admin/users', label: 'Users', roles: ['ADMIN'] },
  { href: '/admin/assignments', label: 'Assignments', roles: ['ADMIN'] },
];

const roleStyle = {
  ADMIN: 'bg-amber-400/15 text-amber-300 border-amber-400/30',
  AGENT: 'bg-wa/15 text-wa border-wa/30',
};

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <aside className="w-64 bg-wa-deep text-white flex flex-col shrink-0">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-wa text-wa-deep flex items-center justify-center">
              <WhatsAppIcon className="w-5 h-5" />
            </div>
            <div className="leading-tight">
              <p className="font-display font-bold tracking-tight text-sm">WhatsApp CRM</p>
              <p className="text-[11px] text-gray-400">Shared inbox</p>
            </div>
          </div>
          {user && (
            <div className="mt-4 flex items-center justify-between rounded-xl bg-white/5 border border-white/10 px-3 py-2">
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{user.name}</p>
                <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
              </div>
              <span
                className={`ml-2 text-[10px] font-bold px-2 py-1 rounded-full border ${roleStyle[user.role] || roleStyle.AGENT}`}
              >
                {user.role}
              </span>
            </div>
          )}
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems
            .filter((item) => user && item.roles.includes(user.role))
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  router.pathname === item.href
                    ? 'bg-wa text-wa-deep'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    router.pathname === item.href ? 'bg-wa-deep' : 'bg-gray-600'
                  }`}
                />
                {item.label}
              </Link>
            ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
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
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
