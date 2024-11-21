import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { XCircle } from "lucide-react";

const AccessDenied: React.FC = () => (
  <div className="flex h-screen items-center justify-center bg-gray-50">
    <Card className="w-96 shadow-xl">
      <CardContent className="pt-6">
        <div className="text-center">
          <XCircle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-lg font-semibold">Access Denied</h3>
          <p className="mt-1 text-sm text-gray-500">
            You do not have permission to view this page.
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default AccessDenied;
