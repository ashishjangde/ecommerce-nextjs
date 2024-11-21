'use client'

import { Card } from '@/components/ui/card';
import { useUIState } from '@/context/UIStateContext';
import { motion } from 'framer-motion';
import { Folder } from 'lucide-react';
import React from 'react';
import AccessDenied from '@/components/ui-error/AccessDenied/AccessDenied';
import LoadingSpinner from '@/components/ui-error/loading-spinner/LoadingSprinner';
import ErrorDisplay from '@/components/ui-error/error-display/ErrorDisplay'
import { useSession } from 'next-auth/react';


export default function Page() {
  
  const {loading ,setLoading , setError, error} = useUIState();
  const { data: session } = useSession();

  if (!session?.user.roles.includes("ADMIN")) {
    return (
     <AccessDenied />
    );
  }
  if (loading) {
    return (
     <LoadingSpinner />
    );
  }
  if (error) {
    return (
     <ErrorDisplay onRetry={() => setError(null)} />
    );
  }


  return (
    <div className="container mx-auto py-8 bg-gray-50 ">
      <Card className="bg-white border-none rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            <motion.div 
              initial={{ opacity: 0, x: -50 }} 
              animate={{ opacity: 1, x: 0 }} 
              className="flex items-center space-x-4"
            >
              <div className="bg-white/20 rounded-full p-3">
                <Folder className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  List Categories
                </h2>
                <p className="text-white/80 text-sm mt-1">
                  Comprehensive dashboard for managing categories
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </Card>

    </div>
  );
}
