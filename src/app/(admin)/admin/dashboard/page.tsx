'use client'


import { Card,  CardContent} from '@/components/ui/card';


import { motion } from 'framer-motion';
import { Building2, Search } from 'lucide-react';
import React from 'react';




export default function Page() {
  return (
    <div className="container mx-auto py-8 bg-gray-50 min-h-screen">
      {/* Card component with a gradient background */}
      <Card className="bg-white border-none rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
          <div className="flex items-center justify-between">
            {/* Motion animation for left section */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }} 
              animate={{ opacity: 1, x: 0 }} 
              className="flex items-center space-x-4"
            >
              <div className="bg-white/20 rounded-full p-3">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white tracking-tight">
                  Seller Requests
                </h2>
                <p className="text-white/80 text-sm mt-1">
                  Comprehensive dashboard for managing seller registrations
                </p>
              </div>
            </motion.div>

            {/* Motion animation for right section (Search input) */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }} 
              animate={{ opacity: 1, x: 0 }} 
              className="flex items-center space-x-4"
            >
              <div className="relative flex-grow">
                <input 
                  type="text" 
                  placeholder="Search sellers..."
                  className="
                    w-64 pl-10 pr-4 py-2.5 
                    bg-white/10 border border-white/20 
                    rounded-xl text-white 
                    placeholder-white/50 
                    focus:outline-none 
                    focus:ring-2 focus:ring-white/30
                  "
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" />
              </div>
            </motion.div>
          </div>
        </div>
      </Card>
    </div>
  );
}
