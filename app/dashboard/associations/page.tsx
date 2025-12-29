'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function MyAssociationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [associations, setAssociations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const showSuccess = searchParams.get('created') === 'true';

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchAssociations = async () => {
      try {
        const res = await fetch('/api/associations/my');
        if (res.ok) {
          const data = await res.json();
          setAssociations(data);
        }
      } catch (err) {
        console.error('Failed to load associations', err);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchAssociations();
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
            href="/dashboard/associations/create"
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            + Ново сдружение
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Моите сдружения
          </h1>

          {showSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6">
              ✅ Сдружението е създадено успешно! Ще бъде публикувано след одобрение от администратор.
            </div>
          )}

          {associations.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎪</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Все още нямате сдружения
              </h3>
              <p className="text-gray-600 mb-6">
                Регистрирайте вашето фолклорно сдружение, за да започнете да публикувате събития
              </p>
              <Link
                href="/dashboard/associations/create"
                className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
              >
                Регистрирай сдружение
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {associations.map((assoc) => (
                <div
                  key={assoc.id}
                  className="border rounded-lg p-6 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          {assoc.name}
                        </h3>
                        {assoc.approved ? (
                          <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded">
                            ✓ Одобрено
                          </span>
                        ) : (
                          <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-1 rounded">
                            ⏳ Чака одобрение
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-2">
                        📍 {assoc.city}
                      </p>
                      {assoc.description && (
                        <p className="text-gray-700 text-sm line-clamp-2">
                          {assoc.description}
                        </p>
                      )}
                    </div>
                    <Link
                      href={`/associations/${assoc.slug}`}
                      className="ml-4 text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Виж профил →
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
