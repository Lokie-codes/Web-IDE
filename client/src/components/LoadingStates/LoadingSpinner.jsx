import React from 'react';

export const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 p-4">
      <div className={`${sizeClasses[size]} border-t-[#007acc] border-gray-600 rounded-full animate-spin`} />
      {text && <p className="text-sm text-[#cccccc]">{text}</p>}
    </div>
  );
};

export const FullPageLoader = ({ text = 'Loading CodeForge IDE...' }) => (
  <div className="h-screen flex items-center justify-center bg-[#1e1e1e]">
    <LoadingSpinner size="lg" text={text} />
  </div>
);
