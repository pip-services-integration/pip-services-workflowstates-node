import { ProcessExceptionV1 } from './ProcessExceptionV1';
export declare class ProcessNotFoundExceptionV1 extends ProcessExceptionV1 {
    /**
     * Creates an error instance and assigns its values.
     *
     * @param correlationId    (optional) a unique transaction id to trace execution through call chain.
     * @param message           (optional) a human-readable description of the error.
     */
    constructor(correlationId?: string, message?: string);
}
