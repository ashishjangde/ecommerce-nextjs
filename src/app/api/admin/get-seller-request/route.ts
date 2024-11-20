import asyncHandler from "@/app/api/_utils/asyncHandler";
import { ApiResponse } from "@/app/api/_utils/ApiResponse";
import { NextResponse } from "next/server";
import { validateAdminSession } from "../../_utils/ValidateSession";
import { SellerRepository } from "../../_repositoriy/SellerRepository";

export const GET = asyncHandler(async (req) => {
    validateAdminSession();

   const { searchParams } = req.nextUrl;
   const page = searchParams.get('page') || '1';  

   const pageNumber = parseInt(page, 10);


   const { sellers, totalPosts, totalPages } = await SellerRepository.getAllSellersWhereStatusPending(pageNumber , 10);
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
