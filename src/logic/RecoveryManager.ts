import { ProcessStateV1 } from '../data/version1/ProcessStateV1';
import { ProcessStatusV1 } from '../data/version1/ProcessStatusV1';
import { MessageV1 } from '../data/version1/MessageV1';

export class RecoveryManager {
    private static _recoveryTimeout = 15 * 60000;
    private static _maxAttempts = 5;

    public static isRecoveryDue(state: ProcessStateV1): boolean {
        return (state.status == ProcessStatusV1.Running
            || state.status == ProcessStatusV1.Starting)
            && (state.recovery_time != null
            && state.recovery_time.getTime() < new Date().getTime());
    }

    public static isAttemptsExceeded(state: ProcessStateV1): boolean {
        return state.recovery_attempts >= this._maxAttempts;
    }

    public static setRecovery(state: ProcessStateV1,
        recoveryQueueName: string = null, recoveryMessage: MessageV1 = null,
        recoveryTimeout: number = null): void {
        state.recovery_message = recoveryMessage || state.recovery_message;
        state.recovery_queue_name = recoveryQueueName || state.recovery_queue_name;
        state.recovery_timeout = recoveryTimeout || this._recoveryTimeout;
        state.recovery_time = new Date(new Date().getTime() + state.recovery_timeout);
    }

    public static clearRecovery(state: ProcessStateV1): void {
        state.recovery_message = null;
        state.recovery_queue_name = null;
        state.recovery_time = null;
        state.recovery_timeout = null;
    }

    public static retryRecovery(state: ProcessStateV1,
        recoveryQueueName: string = null, recoveryMessage: MessageV1 = null,
        recoveryTimeout: number = null): void {
        state.recovery_message = recoveryMessage || state.recovery_message;
        state.recovery_queue_name = recoveryQueueName || state.recovery_queue_name;
        state.recovery_timeout = recoveryTimeout || this._recoveryTimeout;
        state.recovery_time = new Date(new Date().getTime() + state.recovery_timeout);
    }

}