'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { BackLink } from '@/app/components/layout/BackLink';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setError('Невалиден линк за нулиране на парола');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setError('Невалиден линк за нулиране на парола');
      return;
    }

    if (password !== confirmPassword) {
      setError('Паролите не съвпадат');
      return;
    }

    if (password.length < 6) {
      setError('Паролата трябва да е поне 6 символа');
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setPassword('');
        setConfirmPassword('');
        
        // Пренасочи към signin след 2 секунди
        setTimeout(() => {
          router.push('/auth/signin?reset=success');
        }, 2000);
      } else {
        setError(data.error || 'Грешка при промяна на паролата');
      }
    } catch (error) {
      setError('Грешка при връзка със сървъра');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="bg-white/95 backdrop-blur-sm p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Невалиден линк
        </h1>
        <p className="text-center text-red-600 mb-6">
          Този линк за нулиране на парола е невалиден или е изтекъл
        </p>
        <div className="text-center">
          <Link 
            href="/auth/forgot-password" 
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Заявете нов линк за нулиране
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm p-8 rounded-lg shadow-2xl w-full max-w-md">
      <div className="mb-6">
        <BackLink href="/auth/signin" />
      </div>

      <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
        Нова парола
      </h1>
      <p className="text-center text-gray-600 mb-6">
        Въведете вашата нова парола
      </p>

      {message && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Нова парола
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Поне 6 символа"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Потвърдете паролата
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Повторете паролата"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Промяна...' : 'Променете паролата'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link href="/auth/signin" className="text-blue-600 hover:text-blue-700">
          Обратно към вход
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        backgroundImage: 'url(/pictures/shevica.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <Suspense fallback={
        <div className="bg-white/95 backdrop-blur-sm p-8 rounded-lg shadow-2xl w-full max-w-md">
          <p className="text-center">Зареждане...</p>
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
