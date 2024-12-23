import asyncHandler from "@/app/api/_utils/asyncHandler";
import { ApiError } from "@/app/api/_utils/ApiError";
import { ApiResponse } from "@/app/api/_utils/ApiResponse";
import { NextResponse } from "next/server";
import { validateUserSession } from "../../_utils/ValidateSession";
import SellerRegistrationSchema from "@/schema/SellerRegistrationSchema";
import { formatValidationErrors } from "../../_utils/FormatValidationError";
import { SellerRepository } from "../../_repositoriy/SellerRepository";
import { RequestStatus } from "@prisma/client";
import SellerRepositoryRedis from "../../_redisRepository/SellerRepositoryRedis"; 
import { userRepository } from "../../_repositoriy/UserRepository";

export const POST = asyncHandler(async (req) => {
  const { user } = await validateUserSession();

  const body = await req.json();
  const result = SellerRegistrationSchema.safeParse(body);

  if (!result.success) {
    const errors = formatValidationErrors(result.error);
    throw new ApiError(400, "Validation error", errors);
  }
  console.log(user.id);
   const existinguser = await userRepository.getUserById(user.id);
   if(!existinguser){
    throw new ApiError(400, "User not found");
   }
  let  existingRequest = await SellerRepositoryRedis.getSellerByUserId(user.id); 
  if(!existingRequest){
    existingRequest = await SellerRepository.getSellerByUserId(user.id)
    if(existingRequest) {
      await SellerRepositoryRedis.saveSeller(existingRequest?.id ,existingRequest);
    }
  }

  if (existingRequest) {
    if (existingRequest.requestStatus === RequestStatus.Pending) {
      throw new ApiError(400, "Request already pending state");
    }
    if (existingRequest.requestStatus === RequestStatus.Accepted) {
      throw new ApiError(400, "Request already accepted state");
    }
  } else {
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
      user: {
        connect: { id: user.id },
      },
      businessName,
      email,
      phone,
      address: addressValue,
      gstin,
      requestStatus: RequestStatus.Pending,
      panNumber,
      website: websiteValue,
    });


    await SellerRepositoryRedis.saveSeller(seller.id, seller);

    return NextResponse.json(new ApiResponse(seller), { status: 201 });
  }
});

export const GET = asyncHandler(async () => {
  const { user } = await validateUserSession();
  
  const seller = await SellerRepositoryRedis.getSellerByUserId(user.id);
  
  if (!seller) {

    const dbSeller = await SellerRepository.getSellerByUserId(user.id);
    
    if (!dbSeller) {
      throw new ApiError(404, "Seller not found");
    }

    await SellerRepositoryRedis.saveSeller(dbSeller.id, dbSeller);

    return NextResponse.json(new ApiResponse(dbSeller), { status: 200 });
  }

  return NextResponse.json(new ApiResponse(seller), { status: 200 });
});