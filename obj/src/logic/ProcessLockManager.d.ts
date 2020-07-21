import { ProcessStateV1 } from '../data/version1/ProcessStateV1';
import { ProcessLockedExceptionV1 } from '../data/version1/ProcessLockedExceptionV1';
import { ProcessInvalidStateExceptionV1 } from '../data/version1/ProcessInvalidStateExceptionV1';
export declare class ProcessLockManager {
    private static _lockTimeout;
    static isLocked(state: ProcessStateV1): boolean;
    static isUnlocked(state: ProcessStateV1): boolean;
    static checkNotLocked(state: ProcessStateV1): ProcessLockedExceptionV1;
    static checkLocked(state: ProcessStateV1): ProcessInvalidStateExceptionV1;
    static checkLockMatches(originalState: ProcessStateV1, currentState: ProcessStateV1): ProcessLockedExceptionV1;
    static checkLockValid(state: ProcessStateV1): ProcessInvalidStateExceptionV1;
    static lockProcess(state: ProcessStateV1, taskType: string): void;
    static unlockProcess(state: ProcessStateV1): void;
}
