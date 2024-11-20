import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "./ApiResponse";
import { ApiError } from "./ApiError";

type AsyncHandler= (req: NextRequest) => Promise<NextResponse | void>;


const asyncHandler = (fn: AsyncHandler): AsyncHandler => async (req) => {
  try {
    return await fn(req);
  } catch (error) {
    console.error(error);
    if (error instanceof ApiError) {
      return NextResponse.json(new ApiResponse<null>(null, error), { status: error.statusCode });
    }
    return NextResponse.json(
      new ApiResponse<null>(null, new ApiError(500, "Internal server error")),
      { status: 500 }
    );
  }
};

export default asyncHandler;
