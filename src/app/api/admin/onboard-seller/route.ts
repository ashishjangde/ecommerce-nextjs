import asyncHandler from "@/app/api/_utils/asyncHandler";
import { ApiError } from "@/app/api/_utils/ApiError";
import { ApiResponse } from "@/app/api/_utils/ApiResponse";
import { NextResponse } from "next/server";
import { validateAdminSession } from "../../_utils/ValidateSession";
import OnboardSellerSchema from "@/schema/OnboardSellerSchema";
import { formatValidationErrors } from "../../_utils/FormatValidationError";
import { SellerRepository } from "../../_repositoriy/SellerRepository";
import { RequestStatus as Status } from "@prisma/client";
import SellerRepositoryRedis from "../../_redisRepository/SellerRepositoryRedis";

export const POST = asyncHandler(async (req) => {
    await validateAdminSession();
    const body = await req.json();
    const result = OnboardSellerSchema.safeParse(body);
    if (!result.success) {
        const error = formatValidationErrors(result.error);
        throw new ApiError(400, "validation error", error);
    }
    const { sellerId, RequestStatus } = result.data;

    let seller = await SellerRepositoryRedis.getSellerById(sellerId);

    if (!seller) {
        seller = await SellerRepository.getSellerByUserId(sellerId);
        if (seller) {
            await SellerRepositoryRedis.saveSeller(seller.id, seller);
        }
    }

    if (!seller) {
        throw new ApiError(400, "Seller not found");
    }

    const updatedSeller = await SellerRepository.updateSeller(seller.id, { requestStatus: RequestStatus });

    await SellerRepositoryRedis.updateSeller(seller.id, { requestStatus: RequestStatus });

    if (updatedSeller.requestStatus === Status.REJECTED) {
        return NextResponse.json(new ApiResponse("Request updated to Rejected"), { status: 200 });
    } else {
        return NextResponse.json(new ApiResponse("Request updated to Accepted"), { status: 200 });
    }
});
