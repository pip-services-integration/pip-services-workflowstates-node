import { ErrorCategory } from 'pip-services3-commons-node';

import { WorkflowExceptionV1 } from './WorkflowExceptionV1';

export class WorkflowLockedExceptionV1 extends WorkflowExceptionV1 {
	
	/**
	 * Creates an error instance and assigns its values.
	 * 
     * @param correlationId    (optional) a unique transaction id to trace execution through call chain.
     * @param message           (optional) a human-readable description of the error.
	 */
    public constructor(correlationId: string = null,
        message: string = 'Workflow is locked') {
        super(correlationId, 'WORKFLOW_LOCKED', message);
        super.category = ErrorCategory.Conflict;
        super.status = 409;
	}
}