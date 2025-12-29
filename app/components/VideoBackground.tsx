'use client';

import { useEffect, useRef, useState } from 'react';

const videos = [
  '/videos/rozhen-sabor.mp4',
  '/videos/jeravna.mp4',
];

export default function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVideoEnd = () => {
      // Превключи на следващото видео
      setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
    };

    video.addEventListener('ended', handleVideoEnd);

    return () => {
      video.removeEventListener('ended', handleVideoEnd);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Зареди и пусни новото видео
    video.load();
    const playPromise = video.play();
    
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.error('Video playback failed:', error);
      });
    }
  }, [currentVideoIndex]);

  return (
    <div className="absolute inset-0 w-full h-full">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover"
      >
        <source src={videos[currentVideoIndex]} type="video/mp4" />
      </video>
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
    </div>
  );
}
