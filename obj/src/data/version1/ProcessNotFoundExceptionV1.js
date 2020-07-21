"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const ProcessExceptionV1_1 = require("./ProcessExceptionV1");
class ProcessNotFoundExceptionV1 extends ProcessExceptionV1_1.ProcessExceptionV1 {
    /**
     * Creates an error instance and assigns its values.
     *
     * @param correlationId    (optional) a unique transaction id to trace execution through call chain.
     * @param message           (optional) a human-readable description of the error.
     */
    constructor(correlationId = null, message = 'Process was not found') {
        super(correlationId, 'PROCESS_NOT_FOUND', message);
        super.category = pip_services3_commons_node_1.ErrorCategory.BadRequest;
        super.status = 400;
    }
}
exports.ProcessNotFoundExceptionV1 = ProcessNotFoundExceptionV1;
//# sourceMappingURL=ProcessNotFoundExceptionV1.js.map