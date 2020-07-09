"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
class WorkflowExceptionV1 extends pip_services3_commons_node_1.InvalidStateException {
    /**
     * Creates an error instance and assigns its values.
     *
     * @param correlationId    (optional) a unique transaction id to trace execution through call chain.
     * @param code              (optional) a unique error code. Default: "UNKNOWN"
     * @param message           (optional) a human-readable description of the error.
     */
    constructor(correlationId = null, code = null, message = null) {
        super(correlationId, code, message);
    }
}
exports.WorkflowExceptionV1 = WorkflowExceptionV1;
//# sourceMappingURL=WorkflowExceptionV1.js.map