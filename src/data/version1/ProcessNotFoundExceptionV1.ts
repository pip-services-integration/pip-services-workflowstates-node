import { ErrorCategory } from 'pip-services3-commons-node';

import { ProcessExceptionV1 } from './ProcessExceptionV1';

export class ProcessNotFoundExceptionV1 extends ProcessExceptionV1 {
	
	/**
	 * Creates an error instance and assigns its values.
	 * 
     * @param correlationId    (optional) a unique transaction id to trace execution through call chain.
     * @param message           (optional) a human-readable description of the error.
	 */
    public constructor(correlationId: string = null,
        message: string = 'Process was not found') {
        super(correlationId, 'PROCESS_NOT_FOUND', message);
        super.category = ErrorCategory.BadRequest;
        super.status = 400;
	}
}