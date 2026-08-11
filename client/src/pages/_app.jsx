import '@/styles/globals.css';
import Head from 'next/head';
import { AuthProvider } from '@/context/AuthContext';

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Unbounded:wght@500;700;900&family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
