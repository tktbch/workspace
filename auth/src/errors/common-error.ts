import {CommonErrorResponse} from "./common-error-response";

export abstract class CommonError extends Error {

    abstract statusCode: number;
    abstract serializeErrors(): CommonErrorResponse;

    constructor(message: string) {
        super(message);
        // only because we are extending a built in class
        Object.setPrototypeOf(this, CommonError.prototype);
    }
}
