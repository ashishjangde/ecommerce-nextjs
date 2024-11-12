import { NextRequest , NextResponse  } from "next/server";
import { ApiError } from "./ApiError";
import { ApiResponse } from "./ApiResponse";

type AsyncRequestHandler = (req: NextRequest , res: NextResponse) => Promise<Response | void>;

const asyncHandler = (requestHandler: AsyncRequestHandler) => {
    return (req: NextRequest , res: NextResponse) => {
      Promise.resolve(requestHandler(req , res))
            .catch(error =>{
                if (error instanceof ApiError) {
                    return NextResponse.json(new ApiResponse(
                        null,
                         new ApiError(error.statusCode, error.message, error.subMessage)),
                          {
                             status: error.statusCode 
                        });
                }else{
                    console.log(error);
                    return NextResponse.json(new ApiResponse(
                        null,
                         new ApiError(500, "something went wrong")),
                          {
                             status: 500 
                        });
                }
            });
    };
};

export default asyncHandler;