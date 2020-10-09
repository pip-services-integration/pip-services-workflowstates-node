"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessAlreadyExistExceptionV1 = void 0;
const ProcessExceptionV1_1 = require("./ProcessExceptionV1");
class ProcessAlreadyExistExceptionV1 extends ProcessExceptionV1_1.ProcessExceptionV1 {
    /**
     * Creates an error instance and assigns its values.
     *
     * @param correlationId    (optional) a unique transaction id to trace execution through call chain.
     * @param message           (optional) a human-readable description of the error.
     */
    constructor(correlationId = null, message = 'Process already exist') {
        super(correlationId, 'PROCESS_ALREADY_EXIST', message);
    }
}
exports.ProcessAlreadyExistExceptionV1 = ProcessAlreadyExistExceptionV1;
//# sourceMappingURL=ProcessAlreadyExistExceptionV1.js.map