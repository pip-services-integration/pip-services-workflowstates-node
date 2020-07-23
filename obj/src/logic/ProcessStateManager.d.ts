import { ProcessStateV1 } from "../data/version1/ProcessStateV1";
import { ProcessStoppedExceptionV1 } from '../data/version1/ProcessStoppedExceptionV1';
export declare class ProcessStateManager {
    private static _processTimeToLive;
    static checkNotExpired(process: ProcessStateV1): ProcessStoppedExceptionV1;
    static checkActive(process: ProcessStateV1): ProcessStoppedExceptionV1;
    static checkPending(process: ProcessStateV1): ProcessStoppedExceptionV1;
    static startProcess(processType: string, processKey: string, timeToLive: number, callback: (err: any, result: ProcessStateV1) => void): void;
    static extendProcessExpiration(process: ProcessStateV1): ProcessStateV1;
    static restartProcess(process: ProcessStateV1): void;
    static continueProcess(process: ProcessStateV1): void;
    static repeatProcessActivation(process: ProcessStateV1): void;
    static activateProcessWithFailure(process: ProcessStateV1): void;
    static failProcess(process: ProcessStateV1): void;
    static requestProcessResponse(process: ProcessStateV1, request: string): void;
    static completeProcess(process: ProcessStateV1): void;
    static abortProcess(process: ProcessStateV1): void;
}
