import { ProcessStateV1 } from "../data/version1/ProcessStateV1";
import { ProcessStoppedExceptionV1 } from '../data/version1/ProcessStoppedExceptionV1';
import { ProcessStatusV1 } from "../data/version1/ProcessStatusV1";
import { TaskStateV1 } from "../data/version1";
import { IdGenerator, ApplicationException } from "pip-services3-commons-node";

export class ProcessStateManager {
    private static _processTimeToLive: number = 7 * 24 * 60 * 60 * 1000;

    public static checkNotExpired(process: ProcessStateV1):ProcessStoppedExceptionV1 {
        if (process.expiration_time < new Date())
            return new ProcessStoppedExceptionV1("Process " + process.id + " has expired");
        return null;
    }

    public static checkActive(process: ProcessStateV1):ProcessStoppedExceptionV1 {
        if (process.status != ProcessStatusV1.Running
            && process.status != ProcessStatusV1.Starting)
            return new ProcessStoppedExceptionV1("Process " + process.id + " cannot be activated");
        return null;
    }

    public static checkPending(process: ProcessStateV1):ProcessStoppedExceptionV1 {
        if (process.status != ProcessStatusV1.Failed
            && process.status != ProcessStatusV1.Suspended)
            return new ProcessStoppedExceptionV1("Cannot reactivate ended process " + process.id);
    }

    public static startProcess(processType: string, processKey: string, timeToLive: number, callback: (err: any, result: ProcessStateV1) => void): void {
        if (processType == null)
            callback(new ApplicationException("Process type cannot be null"), null);

        var utcNow = new Date();
        timeToLive = timeToLive > 0 ? timeToLive : this._processTimeToLive;
        var process = new ProcessStateV1();

        process.type = processType;
        process.id = IdGenerator.nextLong();
        process.key = processKey;
        process.status = ProcessStatusV1.Starting;
        process.start_time = utcNow;
        process.last_action_time = utcNow;
        process.expiration_time = new Date(utcNow.getMilliseconds() + timeToLive);
        process.tasks = new Array<TaskStateV1>();
        process.data = new Map<string, string>();

        callback(null, process);
    }

    public static extendProcessExpiration(process: ProcessStateV1): ProcessStateV1 {
        process.expiration_time = new Date(Date.now() + ProcessStateManager._processTimeToLive);
        return process;
    }

    public static restartProcess(process: ProcessStateV1) {
        process.status = ProcessStatusV1.Starting;
        process.end_time = null;
        process.request = null;
        process.recovery_attempts = 0;
    }

    public static continueProcess(process: ProcessStateV1) {
        process.status = ProcessStatusV1.Running;
        process.end_time = null;
        process.request = null;
        process.recovery_attempts = 0;
    }

    public static repeatProcessActivation(process: ProcessStateV1) {
        //process.ProcessState = ProcessState.Running;
        process.end_time = null;
        process.request = null;
        process.recovery_attempts++;
    }

    public static activateProcessWithFailure(process: ProcessStateV1) {
        process.status = ProcessStatusV1.Running;
        process.end_time = null;
        process.request = null;
        process.recovery_attempts++;
    }

    public static failProcess(process: ProcessStateV1) {
        process.status = ProcessStatusV1.Failed;
        process.end_time = null;
        process.request = null;
    }

    public static requestProcessResponse(process: ProcessStateV1, request: string) {
        process.status = ProcessStatusV1.Suspended;
        process.end_time = null;
        process.request = request;
        process.recovery_attempts++;
    }

    public static completeProcess(process: ProcessStateV1) {
        process.status = ProcessStatusV1.Completed;
        process.end_time = new Date();
        process.request = null;
        process.recovery_attempts = 0;
    }

    public static abortProcess(process: ProcessStateV1) {
        process.status = ProcessStatusV1.Aborted;
        process.end_time = new Date();
        process.request = null;
    }
}


