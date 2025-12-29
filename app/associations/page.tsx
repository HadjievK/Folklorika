import { prisma } from '@/lib/prisma';
import Link from 'next/link';

async function getAssociations() {
  return await prisma.association.findMany({
    where: {
      approved: true,
    },
    include: {
      _count: {
        select: {
          events: true,
          members: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });
}

export default async function AssociationsPage() {
  const associations = await getAssociations();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Сдружения</h1>
          <Link
            href="/"
            className="text-red-600 hover:underline"
          >
            ← Начало
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {associations.map((assoc) => (
            <div
              key={assoc.id}
              className="bg-white border rounded-lg p-6 hover:shadow-lg transition"
            >
              <div className="text-6xl mb-4 text-center">🎪</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
                {assoc.name}
              </h3>
              <p className="text-gray-600 text-sm mb-3 text-center">
                📍 {assoc.city}
                {assoc.region && ` • ${assoc.region}`}
              </p>
              {assoc.description && (
                <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                  {assoc.description}
                </p>
              )}
              <div className="flex justify-center gap-4 text-sm text-gray-600 border-t pt-3">
                <span>👥 {assoc._count.members} члена</span>
                <span>📅 {assoc._count.events} събития</span>
              </div>
            </div>
          ))}
        </div>

        {associations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Все още няма сдружения</p>
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/associations/register"
            className="inline-block bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Регистрирай сдружение
          </Link>
        </div>
      </div>
    </div>
  );
}
