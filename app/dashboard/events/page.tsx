'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { bg } from 'date-fns/locale';

function MyEventsContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const showSuccess = searchParams.get('created') === 'true';

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events/my');
        if (res.ok) {
          const data = await res.json();
          setEvents(data);
        }
      } catch (err) {
        console.error('Failed to load events', err);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchEvents();
    }
  }, [session]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex justify-between items-center">
          <Link href="/dashboard" className="text-red-600 hover:text-red-700">
            ← Обратно към dashboard
          </Link>
          <Link
            href="/dashboard/events/create"
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            + Ново събитие
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Моите събития
          </h1>

          {showSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6">
              ✅ Събитието е създадено успешно! Ще бъде публикувано след одобрение от администратор.
            </div>
          )}

          {events.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎭</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Все още нямате създадени събития
              </h3>
              <p className="text-gray-600 mb-6">
                Създайте първото си събитие и споделете го с любителите на фолклора
              </p>
              <Link
                href="/dashboard/events/create"
                className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
              >
                Създай събитие
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="border rounded-lg p-6 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          {event.title}
                        </h3>
                        {event.approved ? (
                          <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded">
                            ✓ Одобрено
                          </span>
                        ) : (
                          <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-1 rounded">
                            ⏳ Чака одобрение
                          </span>
                        )}
                        {event.featured && (
                          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded">
                            ⭐ Препоръчано
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        <span className="font-semibold">
                          {format(new Date(event.date), 'd MMMM yyyy, HH:mm', { locale: bg })}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">
                        📍 {event.city} • {event.venue || 'Уточнява се'}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {event.association.name}
                      </p>
                    </div>
                    <Link
                      href={`/events/${event.slug}`}
                      className="ml-4 text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Виж събитие →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MyEventsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Зареждане...</div>
      </div>
    }>
      <MyEventsContent />
    </Suspense>
  );
}
