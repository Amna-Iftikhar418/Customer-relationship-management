import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import useAuth from '@/hooks/useAuth';
import WhatsAppIcon from '@/components/WhatsAppIcon';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('AGENT');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password, role);
      router.push('/dashboard');
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Registration failed';
      setError(errorMsg);
      console.error('Registration error:', err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { value: 'AGENT', label: 'Agent', desc: 'Handle assigned conversations' },
    { value: 'ADMIN', label: 'Admin', desc: 'Manage users & assign chats' },
  ];

  return (
    <div className="min-h-screen bg-wa-deep text-white flex relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[28rem] h-[28rem] rounded-full bg-wa/20 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[24rem] h-[24rem] rounded-full bg-[#0e7490]/20 blur-[120px]" />
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]" />
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-wa-panel/80 backdrop-blur border border-white/10 rounded-3xl p-8 shadow-2xl animate-rise">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-wa text-wa-deep flex items-center justify-center">
              <WhatsAppIcon className="w-5 h-5" />
            </div>
            <span className="font-display font-bold tracking-tight text-lg">WhatsApp CRM</span>
          </div>

          <h2 className="font-display font-bold text-2xl tracking-tight text-center">Create your account</h2>
          <p className="mt-1 text-sm text-gray-400 text-center">Set up your role and start handling chats</p>

          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your name"
                className="w-full px-4 py-2.5 bg-wa-deep border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-wa/60 focus:border-wa/40 transition"
              />
            </div>
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
                minLength={6}
                placeholder="At least 6 characters"
                className="w-full px-4 py-2.5 bg-wa-deep border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-wa/60 focus:border-wa/40 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Role</label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`text-left px-4 py-3 rounded-xl border transition ${
                      role === r.value
                        ? 'bg-wa/15 border-wa text-white'
                        : 'bg-wa-deep border-white/10 text-gray-400 hover:border-white/25'
                    }`}
                  >
                    <p className="text-sm font-semibold">{r.label}</p>
                    <p className="text-[11px] mt-0.5 leading-snug">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-wa text-wa-deep rounded-xl font-semibold hover:bg-wa-mint transition-colors disabled:opacity-50 shadow-[0_16px_40px_-16px_rgba(37,211,102,0.8)]"
            >
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-wa font-medium hover:text-wa-mint">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      <div className="relative z-10 hidden lg:flex w-1/2 flex-col justify-between p-12 border-l border-white/10">
        <div className="ml-auto flex items-center gap-3">
          <span className="font-display font-bold tracking-tight text-lg">WhatsApp CRM</span>
          <div className="w-10 h-10 rounded-2xl bg-wa text-wa-deep flex items-center justify-center shadow-[0_8px_24px_-8px_rgba(37,211,102,0.7)]">
            <WhatsAppIcon className="w-5 h-5" />
          </div>
        </div>

        <div className="text-right ml-auto">
          <h1 className="font-display font-bold leading-[1.05] text-4xl xl:text-5xl tracking-tight">
            New team?
            <span className="block text-wa mt-2">Spin up an inbox in minutes.</span>
          </h1>
          <p className="mt-5 text-gray-300 ml-auto max-w-sm leading-relaxed">
            Create an account as an Agent or an Admin — get role-based access to a shared,
            calm customer conversation inbox.
          </p>
          <div className="mt-8 flex flex-wrap justify-end gap-2 text-[11px] text-gray-300">
            <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10">No credit card</span>
            <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10">Free to start</span>
            <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10">2 roles</span>
          </div>
        </div>

        <p className="text-right text-xs text-gray-500">Meta WhatsApp Cloud API · Prisma · PostgreSQL</p>
      </div>
    </div>
  );
}
