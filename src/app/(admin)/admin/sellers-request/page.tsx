'use client'

import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { RequestStatus } from '@prisma/client';
import axios, { AxiosError } from 'axios';
import { Card,  CardContent} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  XCircle, 
  Search,
  SortDesc,
  Filter,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import  {SellerDialog}  from '@/components/sellet/seller-dialog/SellerDialog';
import { Pagination , ApiResponse , ISeller } from '@/types/seller/seller';
import AccessDenied from '@/components/ui-error/AccessDenied/AccessDenied';
import LoadingSpinner from '@/components/ui-error/loading-spinner/LoadingSprinner';
import ErrorDisplay from '@/components/ui-error/error-display/ErrorDisplay';
import SellerTabs from '@/components/sellet/seller-tabs/SellerTabs';
import { useUIState } from '@/context/UIStateContext';


export default function AdvancedSellerRequestsPage() {
  const { data: session } = useSession();
  const [sellers, setSellers] = useState<ISeller[]>([]);
  const [filteredSellers, setFilteredSellers] = useState<ISeller[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<'newest' | 'oldest' | 'name'>('newest');
  const [selectedSeller, setSelectedSeller] = useState<ISeller | null>(null);
  const {loading , error , setLoading , setError } = useUIState();
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0,
    postsPerPage: 10,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const toast = useToast();
  const fetchSellers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<ApiResponse>('/api/admin/seller-request');
      const { sellers, pagination } = response.data.data;

      if (Array.isArray(sellers)) {
        setSellers(sellers);
        setFilteredSellers(sellers);
        setPagination(pagination);
      } else {
        setError('Invalid data format received from server');
        setSellers([]);
        setFilteredSellers([]);
      }
    } catch (error) {
      setError('Failed to fetch seller data');
      setSellers([]);
      setFilteredSellers([]);
    } finally {
      setLoading(false);
    }
  }, []);
  const tabs = [
    {
      value: 'all',
      label: 'All Requests',
      count: filteredSellers.length,
      icon: Filter,
    },
    {
      value: 'Pending',
      label: 'Pending',
      count: filteredSellers.filter(s => s.requestStatus === 'Pending').length,
      icon: Clock,
    },
    {
      value: 'Accepted',
      label: 'Accepted',
      count: filteredSellers.filter(s => s.requestStatus === 'Accepted').length,
      icon: CheckCircle2,
    },
    {
      value: 'Rejected',
      label: 'Rejected',
      count: filteredSellers.filter(s => s.requestStatus === 'Rejected').length,
      icon: XCircle,
    }
  ];

  useEffect(() => {
    fetchSellers();
  }, [fetchSellers]);

  const form = useForm<{ status: RequestStatus }>({
    defaultValues: {
      status: selectedSeller?.requestStatus || 'Pending'
    }
  });
  
  const onSubmit = async (data: { status: RequestStatus }) => {
    try {
      await handleStatusUpdate(selectedSeller!.id, data.status);
      setSelectedSeller(null); 
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };


  useEffect(() => {
    let result = [...sellers];


    if (searchTerm) {
      result = result.filter(seller => 
        seller.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seller.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seller.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    result.sort((a, b) => {
      switch (sortOption) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'name':
          return a.businessName.localeCompare(b.businessName);
        default:
          return 0;
      }
    });

    setFilteredSellers(result);
  }, [sellers, searchTerm, sortOption]);

  const handleStatusUpdate = async (sellerId: string, status: RequestStatus) => {
    try {
     const request =  await axios.patch(`/api/admin/seller-request`, {
        sellerId,
        status
      });
      if (request.status === 200) {
        toast.toast({
          title: 'Status changed',
          description: 'The status has been updated successfully',
          variant: 'default',
        });
        sellers.map((seller) => {
          if (seller.id === sellerId) {
            seller.requestStatus = status;
          }
        })
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const apiError = error.response.data ;
        toast.toast({
          title: 'Error',
          description: apiError.apiError?.message || 'Something went wrong',
          variant: 'destructive',
        });
      } else {
        toast.toast({
          title: 'Error',
          description: 'An unexpected error occurred',
          variant: 'destructive',
        });
      }
    }
  };


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
     <ErrorDisplay onRetry={fetchSellers} />
    );
  }

  return (
    <div className="container mx-auto py-8 bg-gray-50 min-h-screen">
      <Card className="bg-white border-none rounded-2xl  overflow-hidden">
  <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
    <div className="flex items-center justify-between">
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
      
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center space-x-4"
      >
        <div className="relative flex-grow">
          <input 
            type="text" 
            placeholder="Search sellers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="
                bg-white/10 border-white/20 
                text-white hover:bg-white/20 
                flex items-center gap-2
              "
            >
              <SortDesc className="h-4 w-4" />
              Sort: {sortOption}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white shadow-2xl rounded-xl border-none">
            <DropdownMenuLabel className="text-gray-500">Sort By</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {[
              { value: 'newest', label: 'Newest First' },
              { value: 'oldest', label: 'Oldest First' },
              { value: 'name', label: 'Business Name' }
            ].map((option) => (
              <DropdownMenuItem 
                key={option.value}
                onClick={() => setSortOption(option.value as 'newest' | 'oldest' | 'name')}
                className="hover:bg-gray-100 cursor-pointer"
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>
    </div>
  </div>
</Card>

     <SellerTabs tabs={tabs} handleStatusUpdate={handleStatusUpdate} sellers={sellers} setSelectedSeller={setSelectedSeller}/>
   
      {selectedSeller && (
        <SellerDialog
          selectedSeller={selectedSeller}
          onClose={() => setSelectedSeller(null)}
          form={form}
          onSubmit={onSubmit}
        />
)}
    </div>
  );
}



