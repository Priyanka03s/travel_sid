// components/LoadingScreen.jsx
import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="loading fixed w-full h-full top-0 left-0 flex items-center justify-center text-2xl md:text-3xl bg-white text-black z-50">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-t-4 border-red-500 border-solid rounded-full animate-spin mb-4"></div>
        <span>Loading Travel Experience...</span>
      </div>
    </div>
  );
};

export default LoadingScreen;