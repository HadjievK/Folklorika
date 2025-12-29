export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { AssociationCard } from '@/app/components/cards/AssociationCard';
import { PageHeader } from '@/app/components/layout/PageHeader';

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
        <PageHeader title="Сдружения">
          <Link href="/" className="text-red-600 hover:underline">
            ← Начало
          </Link>
        </PageHeader>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {associations.map((assoc) => (
            <AssociationCard key={assoc.id} association={assoc} />
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
