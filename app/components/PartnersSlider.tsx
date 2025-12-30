'use client';

import { useState } from 'react';

const partners = [
  {
    name: 'Сдружение "Жълтуша и Приятели"',
    image: '/pictures/zhaltusha.jpg',
    link: 'https://www.facebook.com/profile.php?id=61575309253286',
  },
  {
    name: 'Танцов клуб "Искърска плетеница"',
    image: '/pictures/Pletenica.jpg',
    link: 'https://www.facebook.com/pletenitza',
  },
];

export default function PartnersSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % partners.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + partners.length) % partners.length);
  };

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-3 shadow-lg transition"
        aria-label="Previous partner"
      >
        <svg
          className="w-6 h-6 text-gray-800"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-3 shadow-lg transition"
        aria-label="Next partner"
      >
        <svg
          className="w-6 h-6 text-gray-800"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Partner Display */}
      <div className="px-16 py-8">
        <a
          href={partners[currentIndex].link}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <div className="flex flex-col items-center">
            <img
              src={partners[currentIndex].image}
              alt={partners[currentIndex].name}
              className="w-64 h-64 object-contain mb-6 transition-opacity hover:opacity-90"
            />
            <h3 className="text-xl font-bold text-gray-900 text-center">
              {partners[currentIndex].name}
            </h3>
          </div>
        </a>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-4">
        {partners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition ${
              index === currentIndex
                ? 'bg-red-600 scale-125'
                : 'bg-gray-400 hover:bg-gray-600'
            }`}
            aria-label={`Go to partner ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
