"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ProcessStateV1_1 = require("../data/version1/ProcessStateV1");
const ProcessStoppedExceptionV1_1 = require("../data/version1/ProcessStoppedExceptionV1");
const ProcessStatusV1_1 = require("../data/version1/ProcessStatusV1");
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
class ProcessStatesManager {
    static checkNotExpired(process) {
        if (process.expiration_time < new Date())
            return new ProcessStoppedExceptionV1_1.ProcessStoppedExceptionV1("Process " + process.id + " has expired");
        return null;
    }
    static checkActive(process) {
        if (process.status != ProcessStatusV1_1.ProcessStatusV1.Running
            && process.status != ProcessStatusV1_1.ProcessStatusV1.Starting)
            return new ProcessStoppedExceptionV1_1.ProcessStoppedExceptionV1("Process " + process.id + " cannot be activated");
        return null;
    }
    static checkPending(process) {
        if (process.status != ProcessStatusV1_1.ProcessStatusV1.Failed
            && process.status != ProcessStatusV1_1.ProcessStatusV1.Suspended)
            return new ProcessStoppedExceptionV1_1.ProcessStoppedExceptionV1("Cannot reactivate ended process " + process.id);
    }
    static startProcess(processType, processKey, timeToLive, callback) {
        if (processType == null) {
            callback(new pip_services3_commons_node_1.ApplicationException("Process type cannot be null"), null);
            return;
        }
        var utcNow = new Date();
        timeToLive = timeToLive > 0 ? timeToLive : this._processTimeToLive;
        var process = new ProcessStateV1_1.ProcessStateV1();
        process.type = processType;
        process.id = pip_services3_commons_node_1.IdGenerator.nextLong();
        process.key = processKey;
        process.status = ProcessStatusV1_1.ProcessStatusV1.Starting;
        process.start_time = utcNow;
        process.last_action_time = utcNow;
        process.expiration_time = new Date(utcNow.getMilliseconds() + timeToLive);
        process.tasks = new Array();
        process.data = new Map();
        callback(null, process);
    }
    static extendProcessExpiration(process) {
        process.expiration_time = new Date(Date.now() + ProcessStatesManager._processTimeToLive);
        return process;
    }
    static restartProcess(process) {
        process.status = ProcessStatusV1_1.ProcessStatusV1.Starting;
        process.end_time = null;
        process.request = null;
        process.recovery_attempts = 0;
    }
    static continueProcess(process) {
        process.status = ProcessStatusV1_1.ProcessStatusV1.Running;
        process.end_time = null;
        process.request = null;
        process.recovery_attempts = 0;
    }
    static repeatProcessActivation(process) {
        //process.ProcessState = ProcessState.Running;
        process.end_time = null;
        process.request = null;
        process.recovery_attempts = process.recovery_attempts ? process.recovery_attempts + 1 : 1;
    }
    static activateProcessWithFailure(process) {
        process.status = ProcessStatusV1_1.ProcessStatusV1.Running;
        process.end_time = null;
        process.request = null;
        process.recovery_attempts++;
    }
    static failProcess(process) {
        process.status = ProcessStatusV1_1.ProcessStatusV1.Failed;
        process.end_time = null;
        process.request = null;
    }
    static requestProcessResponse(process, request) {
        process.status = ProcessStatusV1_1.ProcessStatusV1.Suspended;
        process.end_time = null;
        process.request = request;
        process.recovery_attempts++;
    }
    static completeProcess(process) {
        process.status = ProcessStatusV1_1.ProcessStatusV1.Completed;
        process.end_time = new Date();
        process.request = null;
        process.recovery_attempts = 0;
    }
    static abortProcess(process) {
        process.status = ProcessStatusV1_1.ProcessStatusV1.Aborted;
        process.end_time = new Date();
        process.request = null;
    }
}
exports.ProcessStatesManager = ProcessStatesManager;
ProcessStatesManager._processTimeToLive = 7 * 24 * 60 * 60 * 1000;
//# sourceMappingURL=ProcessStatesManager.js.map