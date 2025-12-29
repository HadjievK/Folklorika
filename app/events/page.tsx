import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { format } from 'date-fns';
import { bg } from 'date-fns/locale';

async function getEvents() {
  return await prisma.event.findMany({
    where: {
      approved: true,
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
  });
}

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Събития</h1>
          <Link
            href="/"
            className="text-red-600 hover:underline"
          >
            ← Начало
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              <div className="bg-red-100 h-48 flex items-center justify-center">
                <span className="text-6xl">
                  {event.type === 'CONCERT' && '🎤'}
                  {event.type === 'FESTIVAL' && '🎉'}
                  {event.type === 'WORKSHOP' && '🎨'}
                  {event.type === 'OTHER' && '🎭'}
                </span>
              </div>
              <div className="p-4">
                <div className="text-sm text-red-600 font-semibold mb-2">
                  {format(new Date(event.date), 'd MMMM yyyy, HH:mm', { locale: bg })}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {event.title}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  📍 {event.city} • {event.venue || 'Уточнява се'}
                </p>
                <p className="text-gray-500 text-sm mb-3">
                  {event.association.name}
                </p>
                <p className="text-gray-700 line-clamp-2 text-sm">
                  {event.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Все още няма събития</p>
          </div>
        )}
      </div>
    </div>
  );
}
