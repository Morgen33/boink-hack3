
import React from 'react';

export const LoadingFallback = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-web3-magenta border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold mb-2">Loading BOINK</h2>
        <p className="text-muted-foreground">Please wait...</p>
      </div>
    </div>
  );
};
