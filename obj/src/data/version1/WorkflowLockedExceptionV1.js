"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const WorkflowExceptionV1_1 = require("./WorkflowExceptionV1");
class WorkflowLockedExceptionV1 extends WorkflowExceptionV1_1.WorkflowExceptionV1 {
    /**
     * Creates an error instance and assigns its values.
     *
     * @param correlationId    (optional) a unique transaction id to trace execution through call chain.
     * @param message           (optional) a human-readable description of the error.
     */
    constructor(correlationId = null, message = 'Workflow is locked') {
        super(correlationId, 'WORKFLOW_LOCKED', message);
        super.category = pip_services3_commons_node_1.ErrorCategory.Conflict;
        super.status = 409;
    }
}
exports.WorkflowLockedExceptionV1 = WorkflowLockedExceptionV1;
//# sourceMappingURL=WorkflowLockedExceptionV1.js.map