import React from 'react';
import { Loader } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <Loader className="w-8 h-8 animate-spin text-blue-500" />
    </div>
  );
};

export default LoadingSpinner;