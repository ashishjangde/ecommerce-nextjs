import { ApiError } from "./ApiError.js";

export class ApiResponse<T> {
    public localDateTime: string;
    public data?: T | null;
    public apiError?: ApiError | null;

    constructor(data?: T, apiError?: ApiError) {
        this.localDateTime = new Date().toISOString(); 

        if (data) {
            this.data = data;
            this.apiError = null;
        } else if (apiError) {
            this.apiError = apiError;
            this.data = null; 
        } else {
            this.apiError = null;
        }
    }
}
