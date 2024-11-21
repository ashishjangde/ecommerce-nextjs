import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUIState } from "@/context/UIStateContext";

interface ErrorDisplayProps {
  onRetry: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ onRetry }) => {
  const { error } = useUIState();

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <Card className="w-96 shadow-xl">
        <CardContent className="pt-6">
          <div className="text-center">
            <XCircle className="mx-auto h-12 w-12 text-red-500" />
            <h3 className="mt-2 text-lg font-semibold">Error</h3>
            <p className="mt-1 text-sm text-gray-500">{error}</p>
            <Button 
              onClick={onRetry} 
              className="mt-4 bg-blue-600 hover:bg-blue-700"
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorDisplay;
