"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WorkflowExceptionV1_1 = require("./WorkflowExceptionV1");
class WorkflowInactiveExceptionV1 extends WorkflowExceptionV1_1.WorkflowExceptionV1 {
    /**
     * Creates an error instance and assigns its values.
     *
     * @param correlationId    (optional) a unique transaction id to trace execution through call chain.
     * @param message           (optional) a human-readable description of the error.
     */
    constructor(correlationId = null, message = 'Workflow is in inactive state') {
        super(correlationId, 'INACTIVE_WORKFLOW', message);
    }
}
exports.WorkflowInactiveExceptionV1 = WorkflowInactiveExceptionV1;
//# sourceMappingURL=WorkflowInactiveExceptionV1.js.map