import { ProcessStateV1 } from '../data/version1/ProcessStateV1';
import { MessageV1 } from '../data/version1/MessageV1';
export declare class RecoveryManager {
    private static _recoveryTimeout;
    private static _maxAttempts;
    static isRecoveryDue(state: ProcessStateV1): boolean;
    static isAttemptsExceeded(state: ProcessStateV1): boolean;
    static setRecovery(state: ProcessStateV1, recoveryQueueName?: string, recoveryMessage?: MessageV1, recoveryTimeout?: number): void;
    static clearRecovery(state: ProcessStateV1): void;
    static retryRecovery(state: ProcessStateV1, recoveryQueueName?: string, recoveryMessage?: MessageV1, recoveryTimeout?: number): void;
}
