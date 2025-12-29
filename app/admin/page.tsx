'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    pendingAssociations: 0,
    pendingEvents: 0,
    totalUsers: 0,
    totalAssociations: 0,
    totalEvents: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      // Ако не е logged in, препращаме към login с callbackUrl към admin
      router.push('/auth/signin?callbackUrl=/admin');
      return;
    }

    // Само zhaltushaipriyateli@gmail.com има достъп
    if (session?.user?.email !== 'zhaltushaipriyateli@gmail.com') {
      router.push('/dashboard');
      return;
    }

    fetchStats();
  }, [status, session, router]);

  const fetchStats = async () => {
    try {
      const [associationsRes, eventsRes, usersRes, allAssociationsRes, allEventsRes] = await Promise.all([
        fetch('/api/admin/associations'),
        fetch('/api/admin/events'),
        fetch('/api/admin/users'),
        fetch('/api/associations'),
        fetch('/api/events'),
      ]);

      if (associationsRes.ok && eventsRes.ok && usersRes.ok && allAssociationsRes.ok && allEventsRes.ok) {
        const associations = await associationsRes.json();
        const events = await eventsRes.json();
        const users = await usersRes.json();
        const allAssociations = await allAssociationsRes.json();
        const allEvents = await allEventsRes.json();

        setStats({
          pendingAssociations: associations.length,
          pendingEvents: events.length,
          totalUsers: users.length,
          totalAssociations: allAssociations.length,
          totalEvents: allEvents.length,
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!session || session.user.email !== 'zhaltushaipriyateli@gmail.com') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-red-600 text-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Admin Panel</h1>
              <p className="text-red-100 mt-1">Управление на Фолклорика</p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-white text-red-600 rounded-lg hover:bg-red-50 transition"
            >
              ← Към сайта
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Добре дошли, {session.user.name}
          </h2>
          <p className="text-gray-600">
            Управлявайте сдружения и събития, които чакат одобрение.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Общо потребители</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalUsers}
                </p>
              </div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Общо сдружения</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalAssociations}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.pendingAssociations} за одобрение
                </p>
              </div>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Общо събития</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalEvents}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.pendingEvents} за одобрение
                </p>
              </div>
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Link
            href="/admin/users"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition group"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">
              Потребители
            </h3>
            <p className="text-gray-600 mb-4">
              Преглед на всички регистрирани потребители
            </p>
            <div className="flex items-center text-blue-600 font-medium">
              Отвори
              <svg
                className="w-5 h-5 ml-2 group-hover:translate-x-2 transition"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>

          <Link
            href="/admin/associations"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition group"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition">
              Сдружения
            </h3>
            <p className="text-gray-600 mb-4">
              Преглед и одобряване на регистрирани фолклорни сдружения
            </p>
            <div className="flex items-center text-green-600 font-medium">
              Отвори
              <svg
                className="w-5 h-5 ml-2 group-hover:translate-x-2 transition"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>

          <Link
            href="/admin/events"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition group"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition">
              События
            </h3>
            <p className="text-gray-600 mb-4">
              Преглед и одобряване на публикувани фолклорни събития
            </p>
            <div className="flex items-center text-purple-600 font-medium">
              Отвори
              <svg
                className="w-5 h-5 ml-2 group-hover:translate-x-2 transition"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
