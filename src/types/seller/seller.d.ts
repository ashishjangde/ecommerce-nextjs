import { Seller, User } from "@prisma/client";
import { RequestStatus } from "@prisma/client";
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