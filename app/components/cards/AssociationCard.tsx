import Link from 'next/link';

interface AssociationCardProps {
  association: {
    id: string;
    name: string;
    city: string;
    slug: string;
    _count?: {
      events: number;
      members: number;
    };
  };
}

export function AssociationCard({ association }: AssociationCardProps) {
  return (
    <Link
      href={`/associations/${association.slug}`}
      className="bg-white border rounded-lg p-6 hover:shadow-lg transition text-center"
    >
      <div className="text-5xl mb-4">🎪</div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">
        {association.name}
      </h3>
      <p className="text-gray-600 text-sm">📍 {association.city}</p>
      {association._count && (
        <div className="mt-4 flex justify-center gap-4 text-sm text-gray-500">
          <span>🎭 {association._count.events} събития</span>
          <span>👥 {association._count.members} членове</span>
        </div>
      )}
    </Link>
  );
}
