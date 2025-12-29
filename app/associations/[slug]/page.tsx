import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { EventCard } from '@/app/components/cards/EventCard';

async function getAssociation(slug: string) {
  const association = await prisma.association.findUnique({
    where: { slug, approved: true },
    include: {
      events: {
        where: { approved: true },
        orderBy: { date: 'asc' },
      },
      members: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
      _count: {
        select: {
          events: true,
          members: true,
        },
      },
    },
  });

  if (!association) {
    notFound();
  }

  return association;
}

export default async function AssociationDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const association = await getAssociation(params.slug);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Link href="/associations" className="text-red-600 hover:underline mb-4 inline-block">
          ← Всички сдружения
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center mb-6">
            <div className="text-8xl mb-4">🎪</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {association.name}
            </h1>
            <p className="text-xl text-gray-600">
              📍 {association.city}
              {association.region && ` • ${association.region}`}
            </p>
          </div>

          {association.description && (
            <div className="mb-6 pb-6 border-b">
              <h2 className="text-xl font-bold mb-3">За нас</h2>
              <p className="text-gray-700 whitespace-pre-line">
                {association.description}
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">📅</div>
              <div className="text-2xl font-bold text-red-600">
                {association._count.events}
              </div>
              <div className="text-sm text-gray-600">Събития</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">👥</div>
              <div className="text-2xl font-bold text-red-600">
                {association._count.members}
              </div>
              <div className="text-sm text-gray-600">Членове</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">🎭</div>
              <div className="text-2xl font-bold text-red-600">
                {new Date().getFullYear() - new Date(association.createdAt).getFullYear() || '<1'}
              </div>
              <div className="text-sm text-gray-600">Години</div>
            </div>
          </div>

          {association.contactEmail && (
            <div className="mb-6 pb-6 border-b">
              <h2 className="text-xl font-bold mb-3">Контакт</h2>
              <p className="text-gray-700">
                📧 <a href={`mailto:${association.contactEmail}`} className="text-red-600 hover:underline">
                  {association.contactEmail}
                </a>
              </p>
              {association.phone && (
                <p className="text-gray-700 mt-2">
                  📱 <a href={`tel:${association.phone}`} className="text-red-600 hover:underline">
                    {association.phone}
                  </a>
                </p>
              )}
              {association.website && (
                <p className="text-gray-700 mt-2">
                  🌐 <a href={association.website} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">
                    {association.website}
                  </a>
                </p>
              )}
            </div>
          )}
        </div>

        {association.events.length > 0 && (
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-6">Предстоящи събития</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {association.events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
