import { WorkflowStateV1 } from '../data/version1/WorkflowStateV1';
import { WorkflowStatusV1 } from '../data/version1/WorkflowStatusV1';
import { MessageV1 } from '../data/version1/MessageV1';

export class CompensationManager {
    private static _compensationTimeout = 15 * 60000;
    private static _maxAttempts = 5;

    public static isCompensationDue(state: WorkflowStateV1): boolean {
        return (state.status == WorkflowStatusV1.Active
            || state.status == WorkflowStatusV1.Starting)
            && (state.compensation_time != null
            && state.compensation_time.getTime() < new Date().getTime());
    }

    public static isAttemptsExceeded(state: WorkflowStateV1): boolean {
        return state.attempt_count >= this._maxAttempts;
    }

    public static setCompensation(state: WorkflowStateV1,
        compensationQueueName: string = null, compensationMessage: MessageV1 = null,
        compensationTimeout: number = null): void {
        state.compensation_message = compensationMessage || state.compensation_message;
        state.compensation_queue_name = compensationQueueName || state.compensation_queue_name;
        state.compensation_timeout = compensationTimeout || this._compensationTimeout;
        state.compensation_time = new Date(new Date().getTime() + state.compensation_timeout);
    }

    public static clearCompensation(state: WorkflowStateV1): void {
        state.compensation_message = null;
        state.compensation_queue_name = null;
        state.compensation_time = null;
        state.compensation_timeout = null;
    }

    public static retryCompensation(state: WorkflowStateV1,
        compensationQueueName: string = null, compensationMessage: MessageV1 = null,
        compensationTimeout: number = null): void {
        state.compensation_message = compensationMessage || state.compensation_message;
        state.compensation_queue_name = compensationQueueName || state.compensation_queue_name;
        state.compensation_timeout = compensationTimeout || this._compensationTimeout;
        state.compensation_time = new Date(new Date().getTime() + state.compensation_timeout);
    }

}