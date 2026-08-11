import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import WhatsAppIcon from '@/components/WhatsAppIcon';

const features = [
  { label: 'Inbound webhook', detail: 'Meta messages auto-ingest' },
  { label: 'Admin assigns', detail: 'Route chats to the right agent' },
  { label: 'Agent replies', detail: 'One clean shared inbox' },
  { label: 'Resolved → Closed', detail: 'Trackable status pipeline' },
];

const bubbles = [
  { left: '6%', top: '24%', delay: '0s', msg: 'Can you help with my order?' },
  { left: '15%', top: '62%', delay: '2.4s', msg: 'Thanks a lot 🙏' },
  { right: '7%', top: '32%', delay: '1.2s', msg: 'Is the pricing final?' },
  { right: '14%', top: '70%', delay: '3.6s', msg: 'Perfect, confirming now' },
];

export default function Home() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.replace('/dashboard');
    } else {
      setChecking(false);
    }
  }, [router]);

  if (checking) {
    return (
      <div className="flex items-center justify-center h-screen bg-wa-deep">
        <WhatsAppIcon className="w-10 h-10 text-wa animate-blink" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-wa-deep text-white overflow-y-auto lg:overflow-hidden relative">
      <Head>
        <title>WhatsApp CRM — One calm inbox for every conversation</title>
      </Head>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-32 w-[34rem] h-[34rem] rounded-full bg-wa/25 blur-[130px]" />
        <div className="absolute -bottom-48 -left-32 w-[30rem] h-[30rem] rounded-full bg-[#0e7490]/25 blur-[130px]" />
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)]" />
        {bubbles.map((b, i) => (
          <div
            key={i}
            className={`absolute text-[10px] bg-white/10 backdrop-blur border border-white/10 rounded-2xl rounded-bl-sm px-3 py-2 text-gray-200 animate-drift hidden md:block`}
            style={{ left: b.left, right: b.right, top: b.top, animationDelay: b.delay }}
          >
            {b.msg}
          </div>
        ))}
      </div>

      <header className="relative z-10 max-w-6xl w-full mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-wa text-wa-deep flex items-center justify-center shadow-[0_8px_24px_-8px_rgba(37,211,102,0.7)]">
            <WhatsAppIcon className="w-5 h-5" />
          </div>
          <span className="font-display font-bold tracking-tight text-lg">WhatsApp CRM</span>
        </div>
        <nav className="hidden sm:flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 rounded-full text-sm text-gray-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-5 py-2 rounded-full text-sm font-semibold bg-wa text-wa-deep hover:bg-wa-mint transition-colors"
          >
            Get Started
          </Link>
        </nav>
      </header>

      <main className="relative z-10 flex-1 flex items-center max-w-6xl w-full mx-auto px-6 grid lg:grid-cols-2 gap-8 lg:gap-14 pb-4">
        <div>
          <div
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-gray-200 animate-rise"
            style={{ animationDelay: '0.05s' }}
          >
            <span className="w-2 h-2 rounded-full bg-wa animate-blink" />
            Live · Meta WhatsApp Cloud API
          </div>

          <h1
            className="mt-4 font-display font-bold leading-[1.05] text-3xl sm:text-4xl xl:text-5xl tracking-tight animate-rise"
            style={{ animationDelay: '0.15s' }}
          >
            Every conversation.
            <span className="block text-wa">One calm inbox.</span>
          </h1>

          <p
            className="mt-3 text-gray-300 text-sm sm:text-base max-w-md leading-relaxed animate-rise"
            style={{ animationDelay: '0.25s' }}
          >
            A role-based CRM that turns incoming WhatsApp chatter into a smooth pipeline —
            auto-assigned to your agents, answered, resolved, and closed.
          </p>

          <div
            className="mt-6 flex flex-wrap items-center gap-4 animate-rise"
            style={{ animationDelay: '0.35s' }}
          >
            <Link
              href="/login"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-wa text-wa-deep font-semibold hover:bg-wa-mint transition-all shadow-[0_16px_40px_-16px_rgba(37,211,102,0.8)] hover:-translate-y-0.5"
            >
              Sign In
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M3 10a.75.75 0 0 1 .75-.75h9.69l-2.72-2.72a.75.75 0 0 1 1.06-1.06l4 4a.75.75 0 0 1 0 1.06l-4 4a.75.75 0 1 1-1.06-1.06l2.72-2.72H3.75A.75.75 0 0 1 3 10Z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 text-white font-semibold hover:border-wa hover:text-wa transition-colors"
            >
              Create Account
            </Link>
          </div>

          <div
            className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-5 border-t border-white/10 pt-6 animate-rise"
            style={{ animationDelay: '0.45s' }}
          >
            {features.map((f) => (
              <div key={f.label}>
                <p className="text-wa text-[11px] font-semibold tracking-wide uppercase">{f.label}</p>
                <p className="mt-1 text-gray-400 text-[11px] leading-relaxed">{f.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative hidden lg:block animate-rise" style={{ animationDelay: '0.3s' }}>
          <div className="relative mx-auto max-w-[19rem] animate-floaty">
            <div className="rounded-3xl bg-wa-panel border border-white/10 overflow-hidden animate-glow">
              <div className="px-5 py-4 bg-wa-dark flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-wa/30 flex items-center justify-center font-display font-bold text-sm">
                  AK
                </div>
                <div>
                  <p className="font-semibold text-sm">Ayesha Khan</p>
                  <p className="text-[11px] text-white/70 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-wa-mint" />
                    Customer · online
                  </p>
                </div>
                <span className="ml-auto text-[10px] px-2 py-1 rounded-full bg-white/15 text-white/80">
                  #2417
                </span>
              </div>

              <div className="p-5 space-y-3 min-h-[210px] flex flex-col justify-end">
                <div className="max-w-[80%] ml-auto bg-wa text-wa-deep text-xs px-3.5 py-2 rounded-2xl rounded-tr-sm">
                  Hi Ayesha! Thanks for reaching out — this is Rizwan from support 🙂
                </div>
                <div className="max-w-[80%] bg-[#202623] text-gray-100 text-xs px-3.5 py-2 rounded-2xl rounded-tl-sm">
                  Perfect — can you share the final price for 5 seats?
                </div>
                <div className="max-w-[80%] ml-auto bg-wa text-wa-deep text-xs px-3.5 py-2 rounded-2xl rounded-tr-sm">
                  Sure, sending the quote now 💬
                </div>
                <div className="inline-flex self-start items-center gap-1.5 mt-2 px-3 py-1.5 rounded-full bg-wa/15 border border-wa/30 text-wa text-[11px] font-semibold">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Resolved
                </div>
              </div>

              <div className="px-5 pb-5">
                <div className="flex items-center gap-2 bg-wa-deep rounded-full px-4 py-2.5 border border-white/10">
                  <span className="text-gray-500 text-xs flex-1">Type a reply…</span>
                  <span className="w-7 h-7 rounded-full bg-wa flex items-center justify-center text-wa-deep">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-4 -left-10 hidden xl:block rounded-2xl bg-wa-panel/90 backdrop-blur border border-white/10 px-4 py-3 shadow-xl">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Pipeline</p>
            <p className="text-xs text-gray-200 mt-0.5 font-medium">
              New → Assigned → <span className="text-wa">In Progress</span> → Resolved → Closed
            </p>
          </div>
        </div>
      </main>

      <footer className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-gray-500">
        <span>Role-based access · Admin &amp; Agent</span>
        <span className="hidden sm:inline text-white/15">•</span>
        <span>Prisma · PostgreSQL</span>
        <span className="hidden sm:inline text-white/15">•</span>
        <span>Meta WhatsApp Cloud API</span>
      </footer>
    </div>
  );
}
