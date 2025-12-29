'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const EVENT_TYPES = [
  { value: 'FESTIVAL', label: 'Фестивал' },
  { value: 'CONCERT', label: 'Концерт' },
  { value: 'WORKSHOP', label: 'Работилница' },
  { value: 'SEMINAR', label: 'Семинар' },
  { value: 'EXHIBITION', label: 'Изложба' },
  { value: 'COMPETITION', label: 'Конкурс' },
  { value: 'CELEBRATION', label: 'Празник' },
  { value: 'OTHER', label: 'Друго' },
];

const BULGARIAN_CITIES = [
  'София', 'Пловдив', 'Варна', 'Бургас', 'Русе', 'Стара Загора',
  'Плевен', 'Сливен', 'Добрич', 'Шумен', 'Перник', 'Хасково',
  'Ямбол', 'Пазарджик', 'Благоевград', 'Велико Търново',
  'Враца', 'Габрово', 'Асеновград', 'Видин', 'Казанлък',
  'Кюстендил', 'Кърджали', 'Монтана', 'Димитровград',
];

export default function CreateEventPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [associations, setAssociations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'CONCERT' as string,
    associationId: '',
    date: '',
    endDate: '',
    city: '',
    venue: '',
    address: '',
    isFree: true,
    ticketPrice: '',
    ticketUrl: '',
    contactEmail: '',
    contactPhone: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    // Load user's associations
    const fetchAssociations = async () => {
      try {
        const res = await fetch('/api/associations/my');
        if (res.ok) {
          const data = await res.json();
          setAssociations(data);
        }
      } catch (err) {
        console.error('Failed to load associations', err);
      }
    };
    if (session) {
      fetchAssociations();
    }
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validation
      if (!formData.title || !formData.description || !formData.date || !formData.city || !formData.associationId) {
        setError('Моля попълнете всички задължителни полета');
        setLoading(false);
        return;
      }

      const slug = formData.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          slug,
          ticketPrice: formData.ticketPrice ? parseFloat(formData.ticketPrice) : null,
          creatorId: session?.user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Грешка при създаване на събитие');
      }

      // Success - redirect to dashboard
      router.push('/dashboard/events?created=true');
    } catch (err: any) {
      setError(err.message || 'Грешка при създаване на събитие');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
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
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-6">
          <Link href="/dashboard" className="text-red-600 hover:text-red-700">
            ← Обратно към dashboard
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Създай ново събитие
          </h1>

          {associations.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 text-sm">
                ⚠️ Трябва да сте част от сдружение, за да създадете събитие.{' '}
                <Link href="/dashboard/associations/create" className="font-semibold underline">
                  Регистрирайте сдружение сега
                </Link>
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Association Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Сдружение <span className="text-red-500">*</span>
              </label>
              <select
                name="associationId"
                value={formData.associationId}
                onChange={handleChange}
                required
                disabled={associations.length === 0}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Избери сдружение</option>
                {associations.map((assoc) => (
                  <option key={assoc.id} value={assoc.id}>
                    {assoc.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Заглавие <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                placeholder="Коледен концерт 2025"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Описание <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                placeholder="Опишете събитието..."
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тип събитие <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
              >
                {EVENT_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date and Time */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Начална дата <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Крайна дата (опционално)
                </label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>

            {/* Location */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Град <span className="text-red-500">*</span>
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Избери град</option>
                  {BULGARIAN_CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Място/Зала
                </label>
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  placeholder="НДК - Зала 1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Адрес
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                placeholder="ул. България 1"
              />
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isFree"
                  checked={formData.isFree}
                  onChange={handleChange}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Безплатен вход
                </label>
              </div>

              {!formData.isFree && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Цена на билет (лв)
                    </label>
                    <input
                      type="number"
                      name="ticketPrice"
                      value={formData.ticketPrice}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                      placeholder="20.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Линк за билети
                    </label>
                    <input
                      type="url"
                      name="ticketUrl"
                      value={formData.ticketUrl}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Contact Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email за контакт
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  placeholder="info@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Телефон за контакт
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  placeholder="+359 888 123 456"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading || associations.length === 0}
                className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? 'Създаване...' : 'Създай събитие'}
              </button>
              <p className="mt-3 text-sm text-gray-500 text-center">
                Събитието ще бъде публикувано след одобрение от администратор
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
