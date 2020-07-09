import { WorkflowExceptionV1 } from './WorkflowExceptionV1';
export declare class WorkflowAlreadyExistExceptionV1 extends WorkflowExceptionV1 {
    /**
     * Creates an error instance and assigns its values.
     *
     * @param correlationId    (optional) a unique transaction id to trace execution through call chain.
     * @param message           (optional) a human-readable description of the error.
     */
    constructor(correlationId?: string, message?: string);
}
