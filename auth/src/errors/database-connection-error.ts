import {CommonError} from "./common-error";
import {CommonErrorResponse} from "./common-error-response";

export class DatabaseConnectionError extends CommonError {
    reason = 'Error connecting to database';
    statusCode = 500;

    constructor() {
        super('Database Connection Error');
        // only because we are extending a built in class
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }

    serializeErrors(): CommonErrorResponse {
        return { errors: [{ message: this.reason }] };
    }
}
