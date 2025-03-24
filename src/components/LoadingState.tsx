
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ message = "Loading data..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative h-16 w-16 mb-4">
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <div className="absolute inset-0 h-full w-full animate-pulse-slow rounded-full border-4 border-primary/30"></div>
      </div>
      <p className="text-lg font-medium text-muted-foreground">{message}</p>
    </div>
  );
};

export default LoadingState;
