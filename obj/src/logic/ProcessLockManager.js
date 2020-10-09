"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessLockManager = void 0;
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const ProcessLockedExceptionV1_1 = require("../data/version1/ProcessLockedExceptionV1");
const ProcessInvalidStateExceptionV1_1 = require("../data/version1/ProcessInvalidStateExceptionV1");
class ProcessLockManager {
    static isLocked(state) {
        return state.locked_until_time != null
            && state.locked_until_time.getTime() > new Date().getTime();
    }
    static isUnlocked(state) {
        return state.lock_token == null || state.locked_until_time == null;
    }
    static checkNotLocked(state) {
        if (this.isLocked(state))
            return new ProcessLockedExceptionV1_1.ProcessLockedExceptionV1("Process " + state.id + " is locked by running task.");
        return null;
    }
    static checkLocked(state) {
        if (this.isUnlocked(state))
            return new ProcessInvalidStateExceptionV1_1.ProcessInvalidStateExceptionV1("Process " + state.id + " was not locked");
        return null;
    }
    static checkLockMatches(originalState, currentState) {
        if (currentState.lock_token != originalState.lock_token)
            return new ProcessLockedExceptionV1_1.ProcessLockedExceptionV1("Process " + currentState.id + " is locked by running task");
        return null;
    }
    static checkLockValid(state) {
        if (state.locked_until_time != null && state.locked_until_time.getTime() < new Date().getTime())
            return new ProcessInvalidStateExceptionV1_1.ProcessInvalidStateExceptionV1("Process " + state.id + " lock has expired");
        return null;
    }
    static lockProcess(state, taskType) {
        // Increment attempt counter if process wasn't properly deactivated
        if (state.lock_token != null)
            state.recovery_attempts++;
        let now = new Date();
        state.last_action_time = now;
        state.locked_until_time = new Date(now.getTime() + this._lockTimeout);
        state.lock_token = pip_services3_commons_node_1.IdGenerator.nextLong();
    }
    static unlockProcess(state) {
        state.locked_until_time = null;
        state.lock_token = null;
    }
}
exports.ProcessLockManager = ProcessLockManager;
ProcessLockManager._lockTimeout = 3 * 60000;
//# sourceMappingURL=ProcessLockManager.js.map