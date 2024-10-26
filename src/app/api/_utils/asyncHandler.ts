import { NextResponse, NextRequest } from 'next/server'; // Importing Next.js request/response types
import { APIResponse } from './ApiResponse';
import { ApiError } from './ApiError';

type ResponseType = (req: NextRequest, res: NextResponse) => Promise<NextResponse | void> | NextResponse | void;

export const asyncHandler = (fn: ResponseType) => {
  return async (req: NextRequest, res: NextResponse): Promise<NextResponse | void> => {
    try {
      return await fn(req, res); // Await the function call
    } catch (error) {
      if (error instanceof ApiError) {
        return NextResponse.json(
          {
            data: new APIResponse(null, error),
          },
          { status: error.statusCode }
        );
      } else {
        console.error('Unexpected Error:', error);
        return NextResponse.json(
          {
            data: new APIResponse(null, new ApiError(500, 'Internal Server Error', [])),
          },
          { status: 500 }
        );
      }
    }
  };
};
