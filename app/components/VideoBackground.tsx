'use client';

import { useEffect, useRef, useState } from 'react';

const videos = [
  '/videos/rozhen-sabor.mp4',
  '/videos/jeravna.mp4',
];

export default function VideoBackground() {
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [activeVideo, setActiveVideo] = useState<1 | 2>(1);

  useEffect(() => {
    const video1 = video1Ref.current;
    const video2 = video2Ref.current;
    if (!video1 || !video2) return;

    const handleVideo1End = () => {
      // Зареди следващото видео във video2
      const nextIndex = (currentVideoIndex + 1) % videos.length;
      video2.src = videos[nextIndex];
      video2.load();
      video2.play();
      setActiveVideo(2);
      setCurrentVideoIndex(nextIndex);
    };

    const handleVideo2End = () => {
      // Зареди следващото видео във video1
      const nextIndex = (currentVideoIndex + 1) % videos.length;
      video1.src = videos[nextIndex];
      video1.load();
      video1.play();
      setActiveVideo(1);
      setCurrentVideoIndex(nextIndex);
    };

    video1.addEventListener('ended', handleVideo1End);
    video2.addEventListener('ended', handleVideo2End);

    // Стартирай първото видео
    video1.src = videos[0];
    video1.load();
    video1.play().catch(error => console.error('Video playback failed:', error));

    return () => {
      video1.removeEventListener('ended', handleVideo1End);
      video2.removeEventListener('ended', handleVideo2End);
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full">
      <video
        ref={video1Ref}
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
        style={{ opacity: activeVideo === 1 ? 1 : 0 }}
      />
      <video
        ref={video2Ref}
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
        style={{ opacity: activeVideo === 2 ? 1 : 0 }}
      />
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
    </div>
  );
}
