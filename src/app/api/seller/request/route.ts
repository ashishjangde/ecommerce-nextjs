import asyncHandler from "@/app/api/_utils/asyncHandler";
import { ApiResponse } from "@/app/api/_utils/ApiResponse";
import { NextResponse } from "next/server";
import { validateAdminSession } from "../../_utils/ValidateSession";
import { SellerRepository } from "../../_repositoriy/SellerRepository";
import { RequestStatus, UserRole } from "@prisma/client";
import { ApiError } from "../../_utils/ApiError";
import { userRepository } from "../../_repositoriy/UserRepository";

export const GET = asyncHandler(async (req) => {
   await validateAdminSession();

   const { searchParams } = req.nextUrl;
   const page = searchParams.get('page') || '1';  

   const pageNumber = parseInt(page, 10);


   const { sellers, totalPosts, totalPages } = await SellerRepository.getAllSellers(pageNumber , 10);
   const pagination = {
     currentPage: pageNumber,
     totalPages,
     totalPosts,
     postsPerPage : 10,
     hasNextPage: pageNumber < totalPages,
     hasPreviousPage: pageNumber > 1,
   };
   

   return NextResponse.json(new ApiResponse({
    sellers,
    pagination
   } ), { status: 200 });
});


export const PATCH = asyncHandler(async (req) => { 
  await validateAdminSession();

  const body = await req.json();
  const { sellerId, status }: { sellerId: string; status: RequestStatus } = body;

  const seller = await SellerRepository.getSellerById(sellerId);

  if (!seller) {
     throw new ApiError(404, "Seller not found");
  }

  if (seller.requestStatus === status) {
     throw new ApiError(400, `Request already in ${status} status`);
  }

  const user = await userRepository.getUserById(seller.userId);

  if (!user) {
     throw new ApiError(404, "Role updation failed, user not found");
  }

  const updatedSeller = await SellerRepository.updateSeller(seller.id, { requestStatus: status });

  if (updatedSeller.requestStatus === RequestStatus.Accepted) {
     if (!user.roles.includes(UserRole.SELLER)) {
        user.roles.push(UserRole.SELLER);
     }
  } else {
     user.roles = user.roles.filter((role) => role !== UserRole.SELLER);
  }

  await userRepository.updateUser(user.id, { roles: user.roles });

  return NextResponse.json(new ApiResponse(updatedSeller), { status: 200 });
});
