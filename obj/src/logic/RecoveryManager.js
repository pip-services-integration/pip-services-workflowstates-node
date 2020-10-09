"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecoveryManager = void 0;
const ProcessStatusV1_1 = require("../data/version1/ProcessStatusV1");
class RecoveryManager {
    static isRecoveryDue(state) {
        return (state.status == ProcessStatusV1_1.ProcessStatusV1.Running
            || state.status == ProcessStatusV1_1.ProcessStatusV1.Starting)
            && (state.recovery_time != null
                && state.recovery_time.getTime() < new Date().getTime());
    }
    static isAttemptsExceeded(state) {
        return state.recovery_attempts >= this._maxAttempts;
    }
    static setRecovery(state, recoveryQueueName = null, recoveryMessage = null, recoveryTimeout = null) {
        state.recovery_message = recoveryMessage || state.recovery_message;
        state.recovery_queue_name = recoveryQueueName || state.recovery_queue_name;
        state.recovery_timeout = recoveryTimeout || this._recoveryTimeout;
        state.recovery_time = new Date(new Date().getTime() + state.recovery_timeout);
    }
    static clearRecovery(state) {
        state.recovery_message = null;
        state.recovery_queue_name = null;
        state.recovery_time = null;
        state.recovery_timeout = null;
    }
    static retryRecovery(state, recoveryQueueName = null, recoveryMessage = null, recoveryTimeout = null) {
        state.recovery_message = recoveryMessage || state.recovery_message;
        state.recovery_queue_name = recoveryQueueName || state.recovery_queue_name;
        state.recovery_timeout = recoveryTimeout || this._recoveryTimeout;
        state.recovery_time = new Date(new Date().getTime() + state.recovery_timeout);
    }
}
exports.RecoveryManager = RecoveryManager;
RecoveryManager._recoveryTimeout = 15 * 60000;
RecoveryManager._maxAttempts = 5;
//# sourceMappingURL=RecoveryManager.js.map