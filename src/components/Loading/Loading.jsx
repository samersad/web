import React from 'react';

export const Loading = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-light">
      <div className="text-center">
        <div className="inline-block">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-primary rounded-full animate-spin mb-4"></div>
        </div>
        <p className="text-lg text-primary font-semibold">Loading...</p>
      </div>
    </div>
  );
};
