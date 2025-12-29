import Link from 'next/link';

interface BackLinkProps {
  href?: string;
  text?: string;
}

export function BackLink({ href = '/', text = 'Назад' }: BackLinkProps) {
  return (
    <Link
      href={href}
      className="absolute top-6 left-6 text-gray-700 hover:text-red-600 transition"
    >
      ← {text}
    </Link>
  );
}
