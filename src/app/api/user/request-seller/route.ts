import asyncHandler from "@/app/api/_utils/asyncHandler";
import { ApiError } from "@/app/api/_utils/ApiError";
import { ApiResponse } from "@/app/api/_utils/ApiResponse";
import { NextResponse } from "next/server";
import { validateUserSession } from "../../_utils/ValidateSession";
import SellerRegistrationSchema from "@/schema/SellerRegistrationSchema";
import { formatValidationErrors } from "../../_utils/FormatValidationError";
import { SellerRepository } from "../../_repositoriy/SellerRepository";
import { RequestStatus } from "@prisma/client";

export const POST = asyncHandler(async (req) => {
  const {  user } = await validateUserSession();

  const body = await req.json();
  const result = SellerRegistrationSchema.safeParse(body);

  if (!result.success) {
    const errors = formatValidationErrors(result.error);
    throw new ApiError(400, "Validation error", errors);
  }

  const existingRequest = await SellerRepository.getSellerByUserId(user.id);
  if (existingRequest) {
    if (existingRequest.requestStatus === RequestStatus.PENDING) {
      throw new ApiError(400, "request already pending State");
    }
    if (existingRequest.requestStatus === RequestStatus.ACCEPTED) {
      throw new ApiError(400, "request already accepted State");
    }
  }else{

    const { businessName, email, phone, address, gstin, panNumber, website } = result.data;


    const websiteValue = website === "" || website === undefined ? "" : website;
  
    const addressValue = address
      ? {
          create: {
            street: address.street,
            city: address.city,
            state: address.state,
            pinCode: address.pinCode,
            country: address.country,
          },
        }
      : undefined; 
  
    const seller = await SellerRepository.createSeller({
      userId: user.id, 
      businessName,
      email,
      phone,
      address: addressValue,
      gstin,
      requestStatus: RequestStatus.PENDING,
      panNumber,
      website: websiteValue,
    });
  
    return NextResponse.json(new ApiResponse(seller), { status: 201 });
  }
});


export const GET = asyncHandler(async (req) => {
  const { user } = await validateUserSession();
  const seller = await SellerRepository.getSellerByUserId(user.id);
  if (!seller) {
    throw new ApiError(404, "Seller not found");
  }
  return NextResponse.json(new ApiResponse(seller), { status: 200 });
});