import Link from 'next/link';
import { format } from 'date-fns';
import { bg } from 'date-fns/locale';

interface EventCardProps {
  event: {
    id: string;
    title: string;
    date: Date;
    city: string;
    slug: string;
    type: 'CONCERT' | 'FESTIVAL' | 'WORKSHOP' | 'OTHER';
    association?: {
      name: string;
      slug: string;
    };
  };
}

const eventIcons = {
  CONCERT: '🎤',
  FESTIVAL: '🎉',
  WORKSHOP: '🎨',
  OTHER: '🎭',
};

export function EventCard({ event }: EventCardProps) {
  return (
    <Link
      href={`/events/${event.slug}`}
      className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition"
    >
      <div className="bg-red-100 h-48 flex items-center justify-center">
        <span className="text-6xl">{eventIcons[event.type]}</span>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
        <p className="text-red-600 font-semibold mb-2">
          📅 {format(new Date(event.date), 'dd MMMM yyyy', { locale: bg })}
        </p>
        <p className="text-gray-600 text-sm mb-3">📍 {event.city}</p>
        {event.association && (
          <p className="text-sm text-gray-500">
            Организатор: <span className="font-medium">{event.association.name}</span>
          </p>
        )}
      </div>
    </Link>
  );
}
