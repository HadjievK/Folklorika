'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  emailVerified: boolean;
  role: string;
  createdAt: string;
  _count: {
    events: number;
    associations: number;
  };
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.email) {
      fetchProfile();
    }
  }, [session]);

  async function fetchProfile() {
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    // Валидация
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError('Всички полета са задължителни');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('Новата парола трябва да е поне 6 символа');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Новата парола и потвърждението не съвпадат');
      return;
    }

    setChangingPassword(true);

    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPasswordSuccess('Паролата е сменена успешно! Изпратен е email за потвърждение.');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        setPasswordError(data.error || 'Грешка при смяна на паролата');
      }
    } catch (error) {
      setPasswordError('Грешка при смяна на паролата');
    } finally {
      setChangingPassword(false);
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Зареждане на профил...</p>
        </div>
      </div>
    );
  }

  if (!session || !profile) {
    return null;
  }

  const createdDate = new Date(profile.createdAt).toLocaleDateString('bg-BG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Моят профил</h1>
            <Link href="/dashboard" className="text-red-600 hover:text-red-700">
              ← Назад към Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 p-8 text-white">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl">
                  👤
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{profile.name || 'Потребител'}</h2>
                  <p className="text-red-100">{profile.email}</p>
                </div>
              </div>
            </div>

            {/* Profile Information */}
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">ℹ️</span>
                    Основна информация
                  </h3>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Статус на имейл
                    </label>
                    <div className="flex items-center space-x-2">
                      {profile.emailVerified ? (
                        <>
                          <span className="text-green-600 text-xl">✓</span>
                          <span className="text-green-700 font-medium">Потвърден</span>
                        </>
                      ) : (
                        <>
                          <span className="text-yellow-600 text-xl">⚠</span>
                          <span className="text-yellow-700 font-medium">Непотвърден</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Роля
                    </label>
                    <p className="text-gray-900 font-medium">
                      {profile.role === 'ADMIN' ? '👑 Администратор' : '👤 Потребител'}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Член от
                    </label>
                    <p className="text-gray-900 font-medium">{createdDate}</p>
                  </div>
                </div>

                {/* Change Password */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">🔒</span>
                    Смяна на парола
                  </h3>

                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Текуща парола
                      </label>
                      <input
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Въведи текущата парола"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Нова парола
                      </label>
                      <input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Поне 6 символа"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Потвърди нова парола
                      </label>
                      <input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Въведи отново новата парола"
                      />
                    </div>

                    {passwordError && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {passwordError}
                      </div>
                    )}

                    {passwordSuccess && (
                      <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                        {passwordSuccess}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={changingPassword}
                      className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {changingPassword ? 'Смяна...' : 'Смени паролата'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-8 text-center">
              <div className="text-5xl mb-4">🎭</div>
              <div className="text-4xl font-bold text-blue-900 mb-2">
                {profile._count.events}
              </div>
              <p className="text-blue-700 font-medium text-lg">Създадени събития</p>
              <Link
                href="/dashboard/events"
                className="inline-block mt-4 text-blue-600 hover:text-blue-800 underline text-sm"
              >
                Виж всички →
              </Link>
            </div>

            <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-8 text-center">
              <div className="text-5xl mb-4">🎪</div>
              <div className="text-4xl font-bold text-purple-900 mb-2">
                {profile._count.associations}
              </div>
              <p className="text-purple-700 font-medium text-lg">Сдружения (като собственик)</p>
              <Link
                href="/dashboard/associations/create"
                className="inline-block mt-4 text-purple-600 hover:text-purple-800 underline text-sm"
              >
                Регистрирай ново →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Член от
                    </label>
                    <p className="text-gray-900 font-medium">{createdDate}</p>
                  </div>
                </div>

                {/* Change Password */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">🔒</span>
                    Смяна на парола
                  </h3>

                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Текуща парола
                      </label>
                      <input
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Въведи текущата парола"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Нова парола
                      </label>
                      <input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Поне 6 символа"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Потвърди нова парола
                      </label>
                      <input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Въведи отново новата парола"
                      />
                    </div>

                    {passwordError && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {passwordError}
                      </div>
                    )}

                    {passwordSuccess && (
                      <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                        {passwordSuccess}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={changingPassword}
                      className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {changingPassword ? 'Смяна...' : 'Смени паролата'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-8 text-center">
              <div className="text-5xl mb-4">🎭</div>
              <div className="text-4xl font-bold text-blue-900 mb-2">
                {profile._count.events}
              </div>
              <p className="text-blue-700 font-medium text-lg">Създадени събития</p>
              <Link
                href="/dashboard/events"
                className="inline-block mt-4 text-blue-600 hover:text-blue-800 underline text-sm"
              >
                Виж всички →
              </Link>
            </div>

            <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-8 text-center">
              <div className="text-5xl mb-4">🎪</div>
              <div className="text-4xl font-bold text-purple-900 mb-2">
                {profile._count.associations}
              </div>
              <p className="text-purple-700 font-medium text-lg">Сдружения (като собственик)</p>
              <Link
                href="/dashboard/associations/create"
                className="inline-block mt-4 text-purple-600 hover:text-purple-800 underline text-sm"
              >
                Регистрирай ново →
              </Link/h3>

                  <div className="bg-blue-50 border-2 border-blue-200 p-6 rounded-lg">
                    <div className="text-4xl mb-2">🎭</div>
                    <div className="text-3xl font-bold text-blue-900 mb-1">
                      {profile._count.events}
                    </div>
                    <p className="text-blue-700 font-medium">Създадени събития</p>
                  </div>

                  <div className="bg-purple-50 border-2 border-purple-200 p-6 rounded-lg">
                    <div className="text-4xl mb-2">🎪</div>
                    <div className="text-3xl font-bold text-purple-900 mb-1">
                      {profile._count.associations}
                    </div>
                    <p className="text-purple-700 font-medium">Сдружения (като собственик)</p>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-bold text-gray-900 mb-3">Бързи действия</h4>
                    <div className="space-y-2">
                      <Link
                        href="/dashboard/events"
                        className="block w-full text-center py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 transition"
                      >
                        Виж моите събития
                      </Link>
                      <Link
                        href="/dashboard/events/create"
                        className="block w-full text-center py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                      >
                        Създай ново събитие
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 text-2xl mr-3">💡</div>
                    <div>
                      <p className="text-sm text-yellow-700">
                        <strong>Съвет:</strong> За да промениш информацията в профила си, моля свържи се с 
                        администратора на <a href="mailto:zhaltushaipriyateli@gmail.com" className="underline font-medium">zhaltushaipriyateli@gmail.com</a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
