import { IdGenerator } from 'pip-services3-commons-node';

import { WorkflowStateV1 } from '../data/version1/WorkflowStateV1';
import { WorkflowLockedExceptionV1 } from '../data/version1/WorkflowLockedExceptionV1';
import { WorkflowInvalidStateExceptionV1 } from '../data/version1/WorkflowInvalidStateExceptionV1';

export class WorkflowLockManager {
    private static _lockTimeout = 3 * 60000;

    public static isLocked(state: WorkflowStateV1): boolean {
        return state.locked_until_time != null
            && state.locked_until_time.getTime() > new Date().getTime();
    }

    public static isUnlocked(state: WorkflowStateV1): boolean {
        return state.lock_token == null || state.locked_until_time == null;
    }

    public static checkNotLocked(state: WorkflowStateV1): WorkflowLockedExceptionV1 {
        if (this.isLocked(state))
            return new WorkflowLockedExceptionV1("Workflow " + state.id + " is locked by running activity.");
        return null;
    }

    public static checkLocked(state: WorkflowStateV1): WorkflowInvalidStateExceptionV1 {
        if (this.isUnlocked(state))
            return new WorkflowInvalidStateExceptionV1("Workflow " + state.id + " was not locked");
        return null;
    }

    public static checkLockMatches(originalState: WorkflowStateV1, currentState: WorkflowStateV1): WorkflowLockedExceptionV1 {
        if (currentState.lock_token != originalState.lock_token)
            return new WorkflowLockedExceptionV1("Workflow " + currentState.id + " is locked by running activity");
        return null;
    }

    public static checkLockValid(state: WorkflowStateV1): WorkflowInvalidStateExceptionV1 {
        if (state.locked_until_time != null && state.locked_until_time.getTime() < new Date().getTime())
            return new WorkflowInvalidStateExceptionV1("Workflow " + state.id + " lock has expired");
        return null;
    }

    public static lockWorkflow(state: WorkflowStateV1, activityType: string): void {
        // Increment attempt counter if workflow wasn't properly deactivated
        if (state.lock_token != null)
            state.attempt_count++;

        let now = new Date();
        state.last_action_time = now;
        state.locked_until_time = new Date(now.getTime() + this._lockTimeout);
        state.lock_token = IdGenerator.nextLong();
    }

    public static unlockWorkflow(state: WorkflowStateV1): void {
        state.locked_until_time = null;
        state.lock_token = null;
    }
}