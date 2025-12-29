export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';
import { bg } from 'date-fns/locale';
import VideoBackground from './components/VideoBackground';

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
      {/* Transparent Header with absolute positioning */}
      <header className="absolute top-0 left-0 right-0 z-20">
        <div className="container mx-auto px-4 py-4 md:py-6">
          {/* Mobile Layout - Stack everything */}
          <div className="md:hidden">
            <div className="text-center mb-4">
              <Link href="/">
                <h1 className="text-3xl font-bold cursor-pointer hover:opacity-90 transition text-white drop-shadow-lg" style={{ fontFamily: "'Ink Free', cursive" }}>
                  Фолклорика
                </h1>
              </Link>
            </div>
            <div className="flex justify-center gap-4 mb-3 text-white text-sm">
              <Link href="/" className="hover:opacity-80 transition font-medium drop-shadow-lg">
                Начало
              </Link>
              <Link href="/events" className="hover:opacity-80 transition font-medium drop-shadow-lg">
                Събития
              </Link>
              <Link href="/associations" className="hover:opacity-80 transition font-medium drop-shadow-lg">
                Сдружения
              </Link>
            </div>
            <div className="flex justify-center gap-2">
              <Link
                href="/auth/signin"
                className="bg-white bg-opacity-90 text-red-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-opacity-100 transition shadow-lg"
              >
                Вход
              </Link>
              <Link
                href="/auth/register"
                className="bg-red-700 bg-opacity-90 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-opacity-100 transition shadow-lg"
              >
                Регистрация
              </Link>
            </div>
          </div>

          {/* Desktop Layout - Original design */}
          <div className="hidden md:block relative">
            {/* Left Navigation */}
            <div className="absolute top-0 left-0 flex gap-8 text-white">
              <Link href="/" className="hover:opacity-80 transition text-lg font-medium drop-shadow-lg">
                Начало
              </Link>
              <Link href="/events" className="hover:opacity-80 transition text-lg font-medium drop-shadow-lg">
                Събития
              </Link>
              <Link href="/associations" className="hover:opacity-80 transition text-lg font-medium drop-shadow-lg">
                Сдружения
              </Link>
            </div>

            {/* Centered Logo */}
            <div className="text-center">
              <Link href="/">
                <h1 className="text-5xl font-bold cursor-pointer hover:opacity-90 transition text-white drop-shadow-lg" style={{ fontFamily: "'Ink Free', cursive" }}>
                  Фолклорика
                </h1>
              </Link>
            </div>

            {/* Right Auth Buttons */}
            <div className="absolute top-0 right-0 flex items-center gap-4">
              <Link
                href="/auth/signin"
                className="bg-white bg-opacity-90 text-red-700 px-6 py-2 rounded-lg font-semibold hover:bg-opacity-100 transition shadow-lg"
              >
                Вход
              </Link>
              <Link
                href="/auth/register"
                className="bg-red-700 bg-opacity-90 text-white px-6 py-2 rounded-lg font-semibold hover:bg-opacity-100 transition shadow-lg"
              >
                Регистрация
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Video Background */}
      <section className="relative h-screen overflow-hidden">
        {/* Video Background */}
        <VideoBackground />

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white">
          <p className="text-lg md:text-2xl lg:text-3xl mb-6 md:mb-8 max-w-3xl drop-shadow-md font-light px-4">
            Открийте фолклорни събития, присъединете се към сдружения и
            популяризирайте българската култура
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center w-full max-w-md sm:max-w-none px-4">
            <Link
              href="/dashboard/associations/create"
              className="bg-red-600 bg-opacity-90 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold hover:bg-opacity-100 transition text-base md:text-lg shadow-lg"
            >
              Регистрирай сдружение
            </Link>
            <Link
              href="/events"
              className="bg-white bg-opacity-90 text-red-600 px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold hover:bg-opacity-100 transition text-base md:text-lg shadow-lg"
            >
              Разгледай събития
            </Link>
          </div>
        </div>

        {/* Scroll down indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="animate-bounce">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">
            Предстоящи събития
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">
            Фолклорни сдружения
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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
