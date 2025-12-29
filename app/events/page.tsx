import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { EventCard } from '@/app/components/cards/EventCard';
import { PageHeader } from '@/app/components/layout/PageHeader';

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
        <PageHeader title="Събития">
          <Link href="/" className="text-red-600 hover:underline">
            ← Начало
          </Link>
        </PageHeader>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
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
