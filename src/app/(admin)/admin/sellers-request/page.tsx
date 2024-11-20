'use client'

import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { RequestStatus, Seller, User } from '@prisma/client';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Building2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Mail, 
  Phone, 
  Globe, 
  FileText,
  Calendar,
  Filter,
  Search,
  SortDesc
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  postsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface ISeller extends Seller {
  user: User;
}

export interface ApiResponse {
  localDateTime: string;
  data: {
    sellers: ISeller[];
    pagination: Pagination;
  };
  apiError: string | null;
}

export default function AdvancedSellerRequestsPage() {
  const { data: session } = useSession();
  const [sellers, setSellers] = useState<ISeller[]>([]);
  const [filteredSellers, setFilteredSellers] = useState<ISeller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<'newest' | 'oldest' | 'name'>('newest');
  const [selectedSeller, setSelectedSeller] = useState<ISeller | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0,
    postsPerPage: 10,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const fetchSellers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<ApiResponse>('/api/admin/get-seller-request');
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
      console.error('Failed to fetch sellers:', error);
      setError('Failed to fetch seller data');
      setSellers([]);
      setFilteredSellers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSellers();
  }, [fetchSellers]);


  useEffect(() => {
    let result = [...sellers];


    if (searchTerm) {
      result = result.filter(seller => 
        seller.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seller.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seller.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sorting
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
      await axios.patch(`/api/admin/update-seller-status`, {
        sellerId,
        status
      });
      fetchSellers();
    } catch (error) {
      console.error('Failed to update status:', error);
      setError('Failed to update seller status');
    }
  };

  // Access denied or loading states remain the same...
  if (!session?.user.roles.includes("ADMIN")) {
    return (
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
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Card className="w-96 shadow-xl">
          <CardContent className="pt-6">
            <div className="text-center">
              <XCircle className="mx-auto h-12 w-12 text-red-500" />
              <h3 className="mt-2 text-lg font-semibold">Error</h3>
              <p className="mt-1 text-sm text-gray-500">{error}</p>
              <Button 
                onClick={() => fetchSellers()} 
                className="mt-4 bg-blue-600 hover:bg-blue-700"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 bg-gray-50 min-h-screen">
      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center gap-4 text-blue-800">
            <Building2 className="h-8 w-8" />
            Seller Requests Management
          </CardTitle>
          <CardDescription className="text-gray-600">
            Comprehensive dashboard for reviewing and managing seller registrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-4">
            {/* Search Input */}
            <div className="relative flex-grow">
              <Input 
                placeholder="Search sellers..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            {/* Sorting Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <SortDesc className="h-4 w-4" />
                  Sort: {sortOption}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortOption('newest')}>
                  Newest First
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption('oldest')}>
                  Oldest First
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption('name')}>
                  Business Name
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4 bg-white shadow-md">
          <TabsTrigger value="all">
            All Requests ({filteredSellers.length})
          </TabsTrigger>
          <TabsTrigger value="Pending">
            Pending ({filteredSellers.filter(s => s.requestStatus === 'Pending').length})
          </TabsTrigger>
          <TabsTrigger value="Accepted">
            Accepted ({filteredSellers.filter(s => s.requestStatus === 'Accepted').length})
          </TabsTrigger>
          <TabsTrigger value="Rejected">
            Rejected ({filteredSellers.filter(s => s.requestStatus === 'Rejected').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <SellerList 
            sellers={filteredSellers} 
            onStatusUpdate={handleStatusUpdate} 
            onViewDetails={setSelectedSeller}
          />
        </TabsContent>
        <TabsContent value="Pending">
          <SellerList 
            sellers={filteredSellers.filter(s => s.requestStatus === 'Pending')} 
            onStatusUpdate={handleStatusUpdate} 
            onViewDetails={setSelectedSeller}
          />
        </TabsContent>
        <TabsContent value="Accepted">
          <SellerList 
            sellers={filteredSellers.filter(s => s.requestStatus === 'Accepted')} 
            onStatusUpdate={handleStatusUpdate} 
            onViewDetails={setSelectedSeller}
          />
        </TabsContent>
        <TabsContent value="Rejected">
          <SellerList 
            sellers={filteredSellers.filter(s => s.requestStatus === 'Rejected')} 
            onStatusUpdate={handleStatusUpdate} 
            onViewDetails={setSelectedSeller}
          />
        </TabsContent>
      </Tabs>

      {/* Seller Details Dialog */}
      {selectedSeller && (
        <Dialog open={!!selectedSeller} onOpenChange={() => setSelectedSeller(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedSeller.businessName}</DialogTitle>
              <DialogDescription>
                Detailed information about the seller request
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Business Details</h4>
                <p><Mail className="inline mr-2 h-4 w-4 text-gray-500" />{selectedSeller.email}</p>
                <p><Phone className="inline mr-2 h-4 w-4 text-gray-500" />{selectedSeller.phone}</p>
                <p><Globe className="inline mr-2 h-4 w-4 text-gray-500" />{selectedSeller.website || 'N/A'}</p>
                <p><FileText className="inline mr-2 h-4 w-4 text-gray-500" />GSTIN: {selectedSeller.gstin}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Personal Information</h4>
                <p>Name: {selectedSeller.user.name}</p>
                <p>Registered: {new Date(selectedSeller.createdAt).toLocaleDateString()}</p>
                <div className="mt-2">
                  <Badge 
                    className={`
                      ${selectedSeller.requestStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                        selectedSeller.requestStatus === 'Accepted' ? 'bg-green-100 text-green-800' : 
                        'bg-red-100 text-red-800'
                      }
                    `}
                  >
                    Status: {selectedSeller.requestStatus}
                  </Badge>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function SellerList({ 
  sellers, 
  onStatusUpdate,
  onViewDetails
}: { 
  sellers: ApiResponse['data']['sellers'],
  onStatusUpdate: (id: string, status: RequestStatus) => Promise<void>,
  onViewDetails: (seller: ISeller) => void
}) {
  return (
    <ScrollArea className="h-[calc(100vh-300px)] pr-4">
      <div className="grid gap-4">
        {sellers.length === 0 ? (
          <Card className="text-center shadow-md">
            <CardContent className="pt-6">
              <div className="text-gray-500">
                No sellers found in this category
              </div>
            </CardContent>
          </Card>
        ) : (
          sellers.map((seller) => (
            <Card 
              key={seller.id} 
              className="p-6 hover:shadow-lg transition-shadow duration-300 
                         border-l-4 
                         ${seller.requestStatus === 'Pending' ? 'border-yellow-500' : 
                           seller.requestStatus === 'Accepted' ? 'border-green-500' : 
                           'border-red-500'
                         }"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-4 items-center">
                  <Avatar className="h-14 w-14 border-2">
                    <AvatarImage src={seller.user.profilePicture || ''} alt={seller.user.name} />
                    <AvatarFallback className="bg-blue-100 text-blue-800">
                      {seller.user.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-xl text-blue-800">{seller.businessName}</h3>
                    <p className="text-sm text-gray-600">{seller.user.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap->4">
                  <Badge 
                    className={`
                      ${seller.requestStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                        seller.requestStatus === 'Accepted' ? 'bg-green-100 text-green-800' : 
                        'bg-red-100 text-red-800'
                      }
                    `}
                  >
                    Status: {seller.requestStatus}
                  </Badge>
                  <Button onClick={() => onViewDetails(seller)}>View Details</Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </ScrollArea>
  );
} 