import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "./ApiResponse";
import { ApiError } from "./ApiError";

type AsyncHandler= (req: NextRequest) => Promise<NextResponse>;


const asyncHandler = (fn: AsyncHandler): AsyncHandler => async (req) => {
  try {
    return await fn(req);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(new ApiResponse<null>(null, error), { status: error.statusCode });
    }

    console.error("Unexpected error:", error);
    return NextResponse.json(
      new ApiResponse<null>(null, new ApiError(500, "Internal server error")),
      { status: 500 }
    );
  }
};

export default asyncHandler;
