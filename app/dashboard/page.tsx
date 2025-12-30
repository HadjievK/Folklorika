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
    <div className="min-h-screen relative overflow-hidden">
      {/* Video Background */}
      <div className="fixed inset-0 w-full h-full z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src="/videos/dashboard-background.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Welcome Section */}
        <div className="container mx-auto px-4 py-8 md:py-12 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Добре дошъл, {session.user.name || session.user.email}!
          </h1>
          <Link href="/" className="inline-block text-white hover:text-gray-200 transition underline">
            ← Към началото
          </Link>
        </div>

        {/* Dashboard Cards */}
        <div className="container mx-auto px-4 pb-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Create Event Card */}
            <Link
              href="/dashboard/events/create"
              className="bg-white bg-opacity-90 rounded-lg shadow-lg p-8 hover:bg-opacity-100 hover:shadow-xl transition group"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition">🎭</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Създай събитие
              </h3>
              <p className="text-gray-600">
                Добави нов концерт, фестивал или работилница
              </p>
            </Link>

            {/* My Events Card */}
            <Link
              href="/dashboard/events"
              className="bg-white bg-opacity-90 rounded-lg shadow-lg p-8 hover:bg-opacity-100 hover:shadow-xl transition group"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition">📅</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Моите събития
              </h3>
              <p className="text-gray-600">
                Управлявай създадените от теб събития
              </p>
            </Link>

            {/* Register Association Card */}
            <Link
              href="/dashboard/associations/create"
              className="bg-white bg-opacity-90 rounded-lg shadow-lg p-8 hover:bg-opacity-100 hover:shadow-xl transition group"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition">🎪</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Регистрирай сдружение
              </h3>
              <p className="text-gray-600">
                Създай профил на твоето фолклорно сдружение
              </p>
            </Link>

            {/* My Profile Card */}
            <Link
              href="/dashboard/profile"
              className="bg-white bg-opacity-90 rounded-lg shadow-lg p-8 hover:bg-opacity-100 hover:shadow-xl transition group"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition">👤</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Моят профил
              </h3>
              <p className="text-gray-600">
                Виж информацията за твоя профил и активност
              </p>
            </Link>

            {/* Admin Panel (Only for zhaltushaipriyateli@gmail.com) */}
            {isAdmin && (
              <Link
                href="/admin"
                className="bg-red-600 bg-opacity-90 rounded-lg shadow-lg p-8 hover:bg-opacity-100 hover:shadow-xl transition group"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition">⚙️</div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Админ панел
                </h3>
                <p className="text-red-100">
                  Управление на платформата (само за Жълтуша)
                </p>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
