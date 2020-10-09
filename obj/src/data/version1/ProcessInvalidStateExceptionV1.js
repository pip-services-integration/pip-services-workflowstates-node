"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessInvalidStateExceptionV1 = void 0;
const ProcessExceptionV1_1 = require("./ProcessExceptionV1");
class ProcessInvalidStateExceptionV1 extends ProcessExceptionV1_1.ProcessExceptionV1 {
    /**
     * Creates an error instance and assigns its values.
     *
     * @param correlationId    (optional) a unique transaction id to trace execution through call chain.
     * @param message           (optional) a human-readable description of the error.
     */
    constructor(correlationId = null, message = 'Process is in invalid state') {
        super(correlationId, 'INVALID_PROCESS', message);
    }
}
exports.ProcessInvalidStateExceptionV1 = ProcessInvalidStateExceptionV1;
//# sourceMappingURL=ProcessInvalidStateExceptionV1.js.map