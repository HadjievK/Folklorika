'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { bg } from 'date-fns/locale';

interface Event {
  id: string;
  title: string;
  slug: string;
  type: string;
  date: string;
  time: string | null;
  city: string;
  venue: string | null;
  address: string | null;
  description: string | null;
  ticketPrice: number | null;
  ticketUrl: string | null;
  createdAt: string;
  association: {
    id: string;
    name: string;
    slug: string;
  } | null;
  creator: {
    id: string;
    name: string;
    email: string;
  };
}

const EVENT_TYPE_LABELS: Record<string, string> = {
  CONCERT: 'Концерт',
  FESTIVAL: 'Фестивал',
  WORKSHOP: 'Работилница',
  COMPETITION: 'Конкурс',
  OTHER: 'Друго',
};

export default function AdminEventsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/admin/events');
      return;
    }

    // Само zhaltushaipriyateli@gmail.com има достъп
    if (session?.user?.email !== 'zhaltushaipriyateli@gmail.com') {
      router.push('/dashboard');
      return;
    }

    fetchEvents();
  }, [status, session, router]);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/admin/events');
      
      if (!response.ok) {
        throw new Error('Грешка при зареждане');
      }

      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Грешка при зареждане на събитията');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (!confirm('Сигурни ли сте, че искате да одобрите това събитие?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/events/${id}`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Грешка при одобряване');
      }

      // Remove from list
      setEvents(events.filter(e => e.id !== id));
    } catch (error) {
      alert('Грешка при одобряване на събитието');
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm('Сигурни ли сте, че искате да ИЗТРИЕТЕ това събитие? Това действие е необратимо.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/events/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Грешка при изтриване');
      }

      // Remove from list
      setEvents(events.filter(e => e.id !== id));
    } catch (error) {
      alert('Грешка при изтриване на събитието');
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
              <Link href="/admin" className="text-red-100 hover:text-white mb-2 inline-block">
                ← Обратно към Admin Panel
              </Link>
              <h1 className="text-3xl font-bold">Управление на събития</h1>
              <p className="text-red-100 mt-1">Одобряване на публикувани събития</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {events.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Всички събития са одобрени
            </h3>
            <p className="text-gray-600">
              Няма чакащи събития за одобрение в момента.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      {event.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 items-center text-gray-600">
                      <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                        {EVENT_TYPE_LABELS[event.type]}
                      </span>
                      <span>📅 {format(new Date(event.date), 'dd MMM yyyy', { locale: bg })}</span>
                      {event.time && <span>🕐 {event.time}</span>}
                    </div>
                    <p className="text-gray-600 mt-2">
                      📍 {event.city}
                      {event.venue && `, ${event.venue}`}
                    </p>
                    {event.address && (
                      <p className="text-gray-600 text-sm">
                        {event.address}
                      </p>
                    )}
                  </div>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                    Чака одобрение
                  </span>
                </div>

                {event.description && (
                  <p className="text-gray-700 mb-4 whitespace-pre-wrap">{event.description}</p>
                )}

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Информация:</h4>
                    {event.association && (
                      <p className="text-sm text-gray-600">
                        🎭 Организатор: {event.association.name}
                      </p>
                    )}
                    {event.ticketPrice !== null && (
                      <p className="text-sm text-gray-600">
                        🎫 Цена: {event.ticketPrice === 0 ? 'Безплатно' : `${event.ticketPrice} лв.`}
                      </p>
                    )}
                    {event.ticketUrl && (
                      <p className="text-sm text-gray-600">
                        🔗 <a href={event.ticketUrl} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">
                          Билети
                        </a>
                      </p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Създател:</h4>
                    <p className="text-sm text-gray-600">👤 {event.creator.name}</p>
                    <p className="text-sm text-gray-600">✉️ {event.creator.email}</p>
                    <p className="text-sm text-gray-600 mt-2">
                      📅 Публикувано: {format(new Date(event.createdAt), 'dd MMM yyyy', { locale: bg })}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => handleApprove(event.id)}
                    className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                  >
                    ✓ Одобри
                  </button>
                  <button
                    onClick={() => handleReject(event.id)}
                    className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
                  >
                    ✕ Изтрий
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
