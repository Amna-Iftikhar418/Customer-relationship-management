import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import useAuth from '@/hooks/useAuth';
import WhatsAppIcon from '@/components/WhatsAppIcon';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-wa-deep text-white flex relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[28rem] h-[28rem] rounded-full bg-wa/20 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[24rem] h-[24rem] rounded-full bg-[#0e7490]/20 blur-[120px]" />
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]" />
      </div>

      <div className="relative z-10 hidden lg:flex w-1/2 flex-col justify-between p-12 border-r border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-wa text-wa-deep flex items-center justify-center shadow-[0_8px_24px_-8px_rgba(37,211,102,0.7)]">
            <WhatsAppIcon className="w-5 h-5" />
          </div>
          <span className="font-display font-bold tracking-tight text-lg">WhatsApp CRM</span>
        </div>

        <div>
          <h1 className="font-display font-bold leading-[1.05] text-4xl xl:text-5xl tracking-tight">
            Welcome back.
            <span className="block text-wa mt-2">Your team&apos;s conversations are waiting.</span>
          </h1>
          <p className="mt-5 text-gray-300 max-w-sm leading-relaxed">
            Sign in to route, answer, and resolve every WhatsApp message from one calm inbox.
          </p>
          <div className="mt-8 flex flex-wrap gap-2 text-[11px] text-gray-300">
            <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10">Inbox</span>
            <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10">Customers</span>
            <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10">Dashboard</span>
          </div>
        </div>

        <p className="text-xs text-gray-500">Meta WhatsApp Cloud API · Prisma · PostgreSQL</p>
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-wa-panel/80 backdrop-blur border border-white/10 rounded-3xl p-8 shadow-2xl animate-rise">
          <div className="lg:hidden flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-wa text-wa-deep flex items-center justify-center">
              <WhatsAppIcon className="w-5 h-5" />
            </div>
            <span className="font-display font-bold tracking-tight text-lg">WhatsApp CRM</span>
          </div>

          <h2 className="font-display font-bold text-2xl tracking-tight">Sign In</h2>
          <p className="mt-1 text-sm text-gray-400">Access your team inbox</p>

          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@company.com"
                className="w-full px-4 py-2.5 bg-wa-deep border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-wa/60 focus:border-wa/40 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-wa-deep border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-wa/60 focus:border-wa/40 transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-wa text-wa-deep rounded-xl font-semibold hover:bg-wa-mint transition-colors disabled:opacity-50 shadow-[0_16px_40px_-16px_rgba(37,211,102,0.8)]"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-wa font-medium hover:text-wa-mint">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
