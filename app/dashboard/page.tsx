'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Само zhaltushaipriyateli@gmail.com е админ
  const isAdmin = session?.user?.email === 'zhaltushaipriyateli@gmail.com';

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Зареждане...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Добре дошъл, {session.user.name || session.user.email}!
              </h1>
            </div>
            <Link href="/" className="text-red-600 hover:text-red-700">
              ← Към началото
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create Event Card */}
          <Link
            href="/dashboard/events/create"
            className="relative rounded-lg shadow overflow-hidden p-6 hover:shadow-lg transition group h-48 flex flex-col justify-end"
            style={{
              backgroundImage: 'url(/pictures/shevica-blackandwhite.webp)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition"></div>
            <div className="relative z-10">
              <div className="text-4xl mb-4 group-hover:scale-110 transition">🎭</div>
              <h3 className="text-xl font-bold text-white mb-2">
                Създай събитие
              </h3>
              <p className="text-gray-100 text-sm">
                Добави нов концерт, фестивал или работилница
              </p>
            </div>
          </Link>

          {/* My Events Card */}
          <Link
            href="/dashboard/events"
            className="relative rounded-lg shadow overflow-hidden p-6 hover:shadow-lg transition group h-48 flex flex-col justify-end"
            style={{
              backgroundImage: 'url(/pictures/shevica-blackandwhite.webp)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition"></div>
            <div className="relative z-10">
              <div className="text-4xl mb-4 group-hover:scale-110 transition">📅</div>
              <h3 className="text-xl font-bold text-white mb-2">
                Моите събития
              </h3>
              <p className="text-gray-100 text-sm">
                Управлявай създадените от теб събития
              </p>
            </div>
          </Link>

          {/* Register Association Card */}
          <Link
            href="/dashboard/associations/create"
            className="relative rounded-lg shadow overflow-hidden p-6 hover:shadow-lg transition group h-48 flex flex-col justify-end"
            style={{
              backgroundImage: 'url(/pictures/shevica-blackandwhite.webp)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition"></div>
            <div className="relative z-10">
              <div className="text-4xl mb-4 group-hover:scale-110 transition">🎪</div>
              <h3 className="text-xl font-bold text-white mb-2">
                Регистрирай сдружение
              </h3>
              <p className="text-gray-100 text-sm">
                Създай профил на твоето фолклорно сдружение
              </p>
            </div>
          </Link>

          {/* My Profile Card */}
          <Link
            href="/dashboard/profile"
            className="relative rounded-lg shadow overflow-hidden p-6 hover:shadow-lg transition group h-48 flex flex-col justify-end"
            style={{
              backgroundImage: 'url(/pictures/shevica-blackandwhite.webp)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition"></div>
            <div className="relative z-10">
              <div className="text-4xl mb-4 group-hover:scale-110 transition">👤</div>
              <h3 className="text-xl font-bold text-white mb-2">
                Моят профил
              </h3>
              <p className="text-gray-100 text-sm">
                Виж информацията за твоя профил и активност
              </p>
            </div>
          </Link>

          {/* Admin Panel (Only for zhaltushaipriyateli@gmail.com) */}
          {isAdmin && (
            <Link
              href="/admin"
              className="bg-red-50 border-2 border-red-200 rounded-lg shadow p-6 hover:shadow-lg transition group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition">⚙️</div>
              <h3 className="text-xl font-bold text-red-900 mb-2">
                Админ панел
              </h3>
              <p className="text-red-700 text-sm">
                Управление на платформата (само за Жълтуша)
              </p>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
