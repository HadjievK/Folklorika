import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';
import { bg } from 'date-fns/locale';

async function getUpcomingEvents() {
  return await prisma.event.findMany({
    where: {
      approved: true,
      date: {
        gte: new Date(),
      },
    },
    include: {
      association: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
    orderBy: {
      date: 'asc',
    },
    take: 6,
  });
}

async function getFeaturedAssociations() {
  return await prisma.association.findMany({
    where: {
      approved: true,
    },
    take: 4,
    orderBy: {
      name: 'asc',
    },
  });
}

export default async function Home() {
  const events = await getUpcomingEvents();
  const associations = await getFeaturedAssociations();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-red-700 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <Link href="/">
              <h1 className="text-3xl font-bold cursor-pointer hover:opacity-90 transition">
                🇧🇬 Фолклорика
              </h1>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/events" className="hover:underline">
                Събития
              </Link>
              <Link href="/associations" className="hover:underline">
                Сдружения
              </Link>
              <Link
                href="/auth/signin"
                className="bg-white text-red-700 px-4 py-2 rounded-lg font-semibold hover:bg-red-50 transition"
              >
                Вход
              </Link>
              <Link
                href="/auth/register"
                className="bg-red-800 px-4 py-2 rounded-lg font-semibold hover:bg-red-900 transition"
              >
                Регистрация
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-50 to-orange-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Национална платформа за<br />български фолклор
          </h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Открийте фолклорни събития, присъединете се към сдружения и
            популяризирайте българската култура
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/associations/register"
              className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Регистрирай сдружение
            </Link>
            <Link
              href="/events"
              className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold border-2 border-red-600 hover:bg-red-50 transition"
            >
              Разгледай събития
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Предстоящи събития
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.slug}`}
                className="border rounded-lg overflow-hidden hover:shadow-lg transition"
              >
                <div className="bg-red-100 h-48 flex items-center justify-center">
                  <span className="text-6xl">🎭</span>
                </div>
                <div className="p-4">
                  <div className="text-sm text-red-600 font-semibold mb-2">
                    {format(new Date(event.date), 'd MMMM yyyy', { locale: bg })}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    📍 {event.city} • {event.venue}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {event.association.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          {events.length === 0 && (
            <p className="text-center text-gray-500 py-12">
              Все още няма предстоящи събития
            </p>
          )}
        </div>
      </section>

      {/* Associations */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Фолклорни сдружения
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {associations.map((assoc) => (
              <Link
                key={assoc.id}
                href={`/associations/${assoc.slug}`}
                className="bg-white border rounded-lg p-6 hover:shadow-lg transition text-center"
              >
                <div className="text-5xl mb-4">🎪</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {assoc.name}
                </h3>
                <p className="text-gray-600 text-sm">📍 {assoc.city}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Фолклорика. Всички права запазени.</p>
        </div>
      </footer>
    </div>
  );
}
