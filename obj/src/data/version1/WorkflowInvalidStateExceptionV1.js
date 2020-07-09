"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WorkflowExceptionV1_1 = require("./WorkflowExceptionV1");
class WorkflowInvalidStateExceptionV1 extends WorkflowExceptionV1_1.WorkflowExceptionV1 {
    /**
     * Creates an error instance and assigns its values.
     *
     * @param correlationId    (optional) a unique transaction id to trace execution through call chain.
     * @param message           (optional) a human-readable description of the error.
     */
    constructor(correlationId = null, message = 'Workflow is in invalid state') {
        super(correlationId, 'INVALID_WORKFLOW', message);
    }
}
exports.WorkflowInvalidStateExceptionV1 = WorkflowInvalidStateExceptionV1;
//# sourceMappingURL=WorkflowInvalidStateExceptionV1.js.map