'use client';

import Link from 'next/link';
import { useTranslations } from '@/lib/i18n';

export default function Home() {
  const t = useTranslations();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">🏎️ Downforce</h1>
        <p className="text-center text-gray-600 mb-8">{t.home.subtitle}</p>
        
        <div className="space-y-4">
          <Link
            href="/create"
            className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-6 rounded-lg text-center transition"
          >
            {t.home.createRoom}
          </Link>
          
          <Link
            href="/join"
            className="block w-full bg-white hover:bg-gray-50 text-indigo-600 font-semibold py-4 px-6 rounded-lg text-center border-2 border-indigo-600 transition"
          >
            {t.home.joinRoom}
          </Link>
        </div>
      </div>
    </div>
  );
}
