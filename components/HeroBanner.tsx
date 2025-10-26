import React from 'react';

const HeroBanner: React.FC = () => {
  return (
    <div className="relative aspect-video lg:aspect-auto lg:h-[500px] w-full text-white overflow-hidden bg-black">
      {/* Image Background */}
      <img
        src="https://i.imgur.com/MErYQV2.jpeg"
        alt="Banner principal com uma cidade futurista e veículos voadores, representando inovação e tecnologia."
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
      
      {/* Content container is kept for potential future elements, but buttons are removed */}
      <div className="absolute bottom-0 left-0 p-4 sm:p-8 md:p-12 lg:p-16 max-w-2xl">
        {/* Buttons have been removed as per the user's request. */}
      </div>
    </div>
  );
};

export default HeroBanner;
