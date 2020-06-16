import {ValidationError} from 'express-validator';
import {CommonError} from "./common-error";
import {CommonErrorResponse} from "./common-error-response";

export class RequestValidationError extends CommonError {
    statusCode = 400;

    constructor(private errors: ValidationError[]) {
        super('Validation Error');
        // only because we are extending a built in class
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }

    serializeErrors(): CommonErrorResponse {
        return { errors: this.errors.map(e => ({ message: e.msg, field: e.param})) };
    }

}
