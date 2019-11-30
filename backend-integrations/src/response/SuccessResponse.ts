export class SuccessResponse {

    public static Ok(message: any = "Ok"): SuccessResponse {
        return new this(200, message);
    }

    public static Created(message: any = "Created"): SuccessResponse {
        return new this(200, message);
    }

    public status: number;
    public message: any;

    constructor(status: number, message: any) {
        this.status = status;
        this.message = message;
    }
}
