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
  const [isAnimating, setIsAnimating] = useState(false);

  const nextSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prev) => (prev + 1) % partners.length);
      setTimeout(() => setIsAnimating(false), 700);
    }
  };

  const prevSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prev) => (prev - 1 + partners.length) % partners.length);
      setTimeout(() => setIsAnimating(false), 700);
    }
  };

  // Get previous, current, and next indices
  const getPrevIndex = () => (currentIndex - 1 + partners.length) % partners.length;
  const getNextIndex = () => (currentIndex + 1) % partners.length;

  return (
    <div className="relative max-w-6xl mx-auto px-4">
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

      {/* Partners Display - 3 in a row with slide effect */}
      <div className="overflow-hidden py-8 px-16">
        <div 
          key={currentIndex}
          className="flex items-center justify-center gap-8 transition-all duration-700 ease-in-out animate-fade-in"
        >
          {/* Left Partner - Smaller */}
          <div className="flex-shrink-0 opacity-60 hover:opacity-80 transition-opacity duration-300">
            <a
              href={partners[getPrevIndex()].link}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="flex flex-col items-center">
                <img
                  src={partners[getPrevIndex()].image}
                  alt={partners[getPrevIndex()].name}
                  className="w-32 h-32 object-contain mb-3"
                />
                <h3 className="text-sm font-semibold text-gray-700 text-center max-w-[150px]">
                  {partners[getPrevIndex()].name}
                </h3>
              </div>
            </a>
          </div>

          {/* Center Partner - Larger (Featured) */}
          <div className="flex-shrink-0 scale-110">
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
                  className="w-48 h-48 object-contain mb-4 shadow-lg"
                />
                <h3 className="text-xl font-bold text-gray-900 text-center max-w-[250px]">
                  {partners[currentIndex].name}
                </h3>
              </div>
            </a>
          </div>

          {/* Right Partner - Smaller */}
          <div className="flex-shrink-0 opacity-60 hover:opacity-80 transition-opacity duration-300">
            <a
              href={partners[getNextIndex()].link}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="flex flex-col items-center">
                <img
                  src={partners[getNextIndex()].image}
                  alt={partners[getNextIndex()].name}
                  className="w-32 h-32 object-contain mb-3"
                />
                <h3 className="text-sm font-semibold text-gray-700 text-center max-w-[150px]">
                  {partners[getNextIndex()].name}
                </h3>
              </div>
            </a>
          </div>
        </div>
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
