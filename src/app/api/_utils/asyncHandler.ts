import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "./ApiResponse";
import { ApiError } from "./ApiError";


type AsyncHandler<C = { params?: Record<string, string> }> = (
  req: NextRequest,
  context: C
) => Promise<NextResponse | void>;

const asyncHandler = <C = { params?: Record<string, string> }>(
  fn: AsyncHandler<C>
): AsyncHandler<C> => async (req, context) => {
  try {
    return await fn(req, context);
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

