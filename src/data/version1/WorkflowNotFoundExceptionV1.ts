import { ErrorCategory } from 'pip-services3-commons-node';

import { WorkflowExceptionV1 } from './WorkflowExceptionV1';

export class WorkflowNotFoundExceptionV1 extends WorkflowExceptionV1 {
	
	/**
	 * Creates an error instance and assigns its values.
	 * 
     * @param correlationId    (optional) a unique transaction id to trace execution through call chain.
     * @param message           (optional) a human-readable description of the error.
	 */
    public constructor(correlationId: string = null,
        message: string = 'Workflow was not found') {
        super(correlationId, 'WORKFLOW_NOT_FOUND', message);
        super.category = ErrorCategory.BadRequest;
        super.status = 400;
	}
}