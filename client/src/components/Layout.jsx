import { useRouter } from 'next/router';
import Link from 'next/link';
import useAuth from '@/hooks/useAuth';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', roles: ['ADMIN', 'AGENT'] },
  { href: '/inbox', label: 'Inbox', roles: ['ADMIN', 'AGENT'] },
  { href: '/customers', label: 'Customers', roles: ['ADMIN', 'AGENT'] },
  { href: '/admin/users', label: 'Users', roles: ['ADMIN'] },
  { href: '/admin/assignments', label: 'Assignments', roles: ['ADMIN'] },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-64 bg-green-700 text-white flex flex-col">
        <div className="p-4 border-b border-green-600">
          <h1 className="text-xl font-bold">WhatsApp CRM</h1>
          {user && (
            <p className="text-sm text-green-200 mt-1">
              {user.name} ({user.role})
            </p>
          )}
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems
            .filter((item) => user && item.roles.includes(user.role))
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 rounded text-sm font-medium transition-colors ${
                  router.pathname === item.href
                    ? 'bg-green-800 text-white'
                    : 'text-green-100 hover:bg-green-600'
                }`}
              >
                {item.label}
              </Link>
            ))}
        </nav>
        <div className="p-4 border-t border-green-600">
          <button
            onClick={handleLogout}
            className="w-full px-3 py-2 text-sm font-medium text-green-100 hover:bg-green-600 rounded transition-colors text-left"
          >
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
