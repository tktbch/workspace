import {CommonError} from "./common-error";
import {CommonErrorResponse} from "./common-error-response";

export class NotFoundError extends CommonError {
    reason = 'Route Not Found'
    statusCode = 404;

    constructor() {
        super('Route Not Found');
        // only because we are extending a built in class
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }

    serializeErrors(): CommonErrorResponse {
        return { errors: [{ message: this.reason }] };
    }
}
