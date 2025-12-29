import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { bg } from 'date-fns/locale';

async function getEvent(slug: string) {
  const event = await prisma.event.findUnique({
    where: { slug, approved: true },
    include: {
      association: {
        select: {
          name: true,
          slug: true,
          city: true,
          email: true,
          phone: true,
        },
      },
    },
  });

  if (!event) {
    notFound();
  }

  return event;
}

const eventIcons = {
  CONCERT: '🎤',
  FESTIVAL: '🎉',
  WORKSHOP: '🎨',
  OTHER: '🎭',
};

const eventTypes = {
  CONCERT: 'Концерт',
  FESTIVAL: 'Фестивал',
  WORKSHOP: 'Работилница',
  OTHER: 'Друго',
};

export default async function EventDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const event = await getEvent(params.slug);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Link href="/events" className="text-red-600 hover:underline mb-4 inline-block">
          ← Всички събития
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-red-100 h-64 flex items-center justify-center">
            <span className="text-9xl">{eventIcons[event.type]}</span>
          </div>

          <div className="p-8">
            <div className="mb-6">
              <div className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold mb-3">
                {eventTypes[event.type]}
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {event.title}
              </h1>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">📅 Дата и час</h3>
                <p className="text-2xl font-bold text-red-600 mb-2">
                  {format(new Date(event.date), 'dd MMMM yyyy', { locale: bg })}
                </p>
                <p className="text-gray-600">
                  {format(new Date(event.date), 'HH:mm', { locale: bg })} часа
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">📍 Локация</h3>
                <p className="text-xl font-bold text-gray-900 mb-1">
                  {event.city}
                </p>
                {event.venue && (
                  <p className="text-gray-600">{event.venue}</p>
                )}
              </div>
            </div>

            {event.description && (
              <div className="mb-8 pb-8 border-b">
                <h2 className="text-2xl font-bold mb-4">За събитието</h2>
                <p className="text-gray-700 whitespace-pre-line text-lg leading-relaxed">
                  {event.description}
                </p>
              </div>
            )}

            <div className="mb-8 pb-8 border-b">
              <h2 className="text-2xl font-bold mb-4">Организатор</h2>
              <Link 
                href={`/associations/${event.association.slug}`}
                className="block bg-red-50 rounded-lg p-6 hover:bg-red-100 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="text-5xl">🎪</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {event.association.name}
                    </h3>
                    <p className="text-gray-600">
                      📍 {event.association.city}
                    </p>
                  </div>
                </div>
              </Link>
            </div>

            {event.association.email && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-3">Контакт за повече информация</h2>
                <p className="text-gray-700">
                  📧 <a href={`mailto:${event.association.email}`} className="text-red-600 hover:underline">
                    {event.association.email}
                  </a>
                </p>
                {event.association.phone && (
                  <p className="text-gray-700 mt-2">
                    📱 <a href={`tel:${event.association.phone}`} className="text-red-600 hover:underline">
                      {event.association.phone}
                    </a>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
