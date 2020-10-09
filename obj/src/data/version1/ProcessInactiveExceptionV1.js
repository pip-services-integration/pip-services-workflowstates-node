"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessStoppedExceptionV1 = void 0;
const ProcessExceptionV1_1 = require("./ProcessExceptionV1");
class ProcessStoppedExceptionV1 extends ProcessExceptionV1_1.ProcessExceptionV1 {
    /**
     * Creates an error instance and assigns its values.
     *
     * @param correlationId    (optional) a unique transaction id to trace execution through call chain.
     * @param message           (optional) a human-readable description of the error.
     */
    constructor(correlationId = null, message = 'Process is in stopped state') {
        super(correlationId, 'INACTIVE_PROCESS', message);
    }
}
exports.ProcessStoppedExceptionV1 = ProcessStoppedExceptionV1;
//# sourceMappingURL=ProcessInactiveExceptionV1.js.map