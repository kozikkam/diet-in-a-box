export class ErrorResponse {

    public static NotFound(message: string = "Not found"): ErrorResponse {
        return new this(404, message);
    }

    public static BadRequest(message: string = "Bad request"): ErrorResponse {
        return new this(400, message);
    }

    public static Internal(message: string = "Internal server error"): ErrorResponse {
        return new this(500, message);
    }

    public static Unauthorized(message: string = "Unauthorized"): ErrorResponse {
        return new this(403, message);
    }
    public status: number;
    public message: string;

    constructor(status: number, message: string) {
        this.message = message;
        this.status = status;
    }
}
