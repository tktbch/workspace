import {CommonError} from "./common-error";
import {CommonErrorResponse} from "./common-error-response";

export class BadRequestError extends CommonError {
    statusCode = 400;

    constructor(public message: string) {
        super(message);
        // only because we are extending a built in class
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }

    serializeErrors(): CommonErrorResponse {
        return { errors: [{ message: this.message }] };
    }
}
