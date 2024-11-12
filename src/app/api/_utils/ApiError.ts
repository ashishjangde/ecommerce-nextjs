export class ApiError {
    public statusCode: number;
    public message: string;
    public subMessage: string[];

    constructor(statusCode: number, message: string, subMessage: string[] = []) {
        this.statusCode = statusCode;
        this.message = message;
        this.subMessage = subMessage;
    }
}