'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { bg } from 'date-fns/locale';

interface Association {
  id: string;
  name: string;
  slug: string;
  city: string;
  region: string | null;
  address: string | null;
  description: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  facebook: string | null;
  instagram: string | null;
  createdAt: string;
  members: Array<{
    role: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  }>;
  _count: {
    events: number;
  };
}

export default function AdminAssociationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [associations, setAssociations] = useState<Association[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (session?.user?.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }

    fetchAssociations();
  }, [status, session, router]);

  const fetchAssociations = async () => {
    try {
      const response = await fetch('/api/admin/associations');
      
      if (!response.ok) {
        throw new Error('Грешка при зареждане');
      }

      const data = await response.json();
      setAssociations(data);
    } catch (error) {
      console.error('Error fetching associations:', error);
      setError('Грешка при зареждане на сдруженията');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (!confirm('Сигурни ли сте, че искате да одобрите това сдружение?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/associations/${id}`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Грешка при одобряване');
      }

      // Remove from list
      setAssociations(associations.filter(a => a.id !== id));
    } catch (error) {
      alert('Грешка при одобряване на сдружението');
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm('Сигурни ли сте, че искате да ИЗТРИЕТЕ това сдружение? Това действие е необратимо.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/associations/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Грешка при изтриване');
      }

      // Remove from list
      setAssociations(associations.filter(a => a.id !== id));
    } catch (error) {
      alert('Грешка при изтриване на сдружението');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!session || session.user.role !== 'ADMIN') {
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
              <h1 className="text-3xl font-bold">Управление на сдружения</h1>
              <p className="text-red-100 mt-1">Одобряване на регистрирани сдружения</p>
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

        {associations.length === 0 ? (
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
              Всички сдружения са одобрени
            </h3>
            <p className="text-gray-600">
              Няма чакащи сдружения за одобрение в момента.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {associations.map((association) => {
              const owner = association.members.find(m => m.role === 'OWNER');
              
              return (
                <div key={association.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">
                        {association.name}
                      </h3>
                      <p className="text-gray-600">
                        {association.city}
                        {association.region && `, ${association.region}`}
                      </p>
                      {association.address && (
                        <p className="text-gray-600 text-sm">
                          📍 {association.address}
                        </p>
                      )}
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                      Чака одобрение
                    </span>
                  </div>

                  {association.description && (
                    <p className="text-gray-700 mb-4">{association.description}</p>
                  )}

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Контакти:</h4>
                      {association.email && (
                        <p className="text-sm text-gray-600">✉️ {association.email}</p>
                      )}
                      {association.phone && (
                        <p className="text-sm text-gray-600">📞 {association.phone}</p>
                      )}
                      {association.website && (
                        <p className="text-sm text-gray-600">
                          🌐 <a href={association.website} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">
                            {association.website}
                          </a>
                        </p>
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Създател:</h4>
                      {owner && (
                        <>
                          <p className="text-sm text-gray-600">👤 {owner.user.name}</p>
                          <p className="text-sm text-gray-600">✉️ {owner.user.email}</p>
                        </>
                      )}
                      <p className="text-sm text-gray-600 mt-2">
                        📅 Регистрирано: {format(new Date(association.createdAt), 'dd MMM yyyy', { locale: bg })}
                      </p>
                    </div>
                  </div>

                  {(association.facebook || association.instagram) && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Социални мрежи:</h4>
                      <div className="flex gap-4">
                        {association.facebook && (
                          <a
                            href={association.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm"
                          >
                            Facebook
                          </a>
                        )}
                        {association.instagram && (
                          <a
                            href={association.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-pink-600 hover:underline text-sm"
                          >
                            Instagram
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4 border-t">
                    <button
                      onClick={() => handleApprove(association.id)}
                      className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                    >
                      ✓ Одобри
                    </button>
                    <button
                      onClick={() => handleReject(association.id)}
                      className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
                    >
                      ✕ Изтрий
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
