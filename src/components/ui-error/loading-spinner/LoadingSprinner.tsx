import React from "react";

const LoadingSpinner = () => (
  <div className="flex h-screen items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500" />
  </div>
);

export default LoadingSpinner;
