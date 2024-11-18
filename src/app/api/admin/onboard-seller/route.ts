import asyncHandler from "@/app/api/_utils/asyncHandler";
import { ApiError } from "@/app/api/_utils/ApiError";
import { ApiResponse } from "@/app/api/_utils/ApiResponse";
import {  NextResponse } from "next/server";
import { validateAdminSession } from "../../_utils/ValidateSession";
import OnboardSellerSchema from "@/schema/OnboardSellerSchema";
import { formatValidationErrors } from "../../_utils/FormatValidationError";
import { SellerRepository } from "../../_repositoriy/SellerRepository";
import { RequestStatus as Status } from "@prisma/client";

export const POST = asyncHandler(async (req) => {
   await validateAdminSession();
   const body = await req.json();
   const result = OnboardSellerSchema.safeParse(body);
   if (!result.success) {
       const error =  formatValidationErrors(result.error);
       throw new ApiError(400, "validation error", error );
   }
   const { sellerId , RequestStatus } = result.data;

   const seller = await SellerRepository.getSellerByUserId(sellerId);
   if(!seller){
       throw new ApiError(400, "seller not found");
   }
    const savedSeller = await SellerRepository.updateSeller(seller.id, { requestStatus: RequestStatus });
    if (savedSeller.requestStatus === Status.REJECTED) {
        return NextResponse.json(new ApiResponse("request updated to Rejected") , { status: 200 });
    }else{
        return NextResponse.json(new ApiResponse("request updated to Accepted") , { status: 200 });
    }


});