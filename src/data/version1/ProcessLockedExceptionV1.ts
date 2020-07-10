import { ErrorCategory } from 'pip-services3-commons-node';

import { ProcessExceptionV1 } from './ProcessExceptionV1';

export class ProcessLockedExceptionV1 extends ProcessExceptionV1 {
	
	/**
	 * Creates an error instance and assigns its values.
	 * 
     * @param correlationId    (optional) a unique transaction id to trace execution through call chain.
     * @param message           (optional) a human-readable description of the error.
	 */
    public constructor(correlationId: string = null,
        message: string = 'Process is locked') {
        super(correlationId, 'PROCESS_LOCKED', message);
        super.category = ErrorCategory.Conflict;
        super.status = 409;
	}
}