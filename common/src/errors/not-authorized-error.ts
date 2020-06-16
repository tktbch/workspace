import {CommonError} from "./common-error";
import {CommonErrorResponse} from "./common-error-response";

export class NotAuthorizedError extends CommonError {
    statusCode = 401;

    constructor(public message: string) {
        super(message);
        // only because we are extending a built in class
        Object.setPrototypeOf(this, NotAuthorizedError.prototype);
    }

    serializeErrors(): CommonErrorResponse {
        return { errors: [{ message: this.message }] };
    }
}
