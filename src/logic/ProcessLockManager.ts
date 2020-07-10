import { IdGenerator } from 'pip-services3-commons-node';

import { ProcessStateV1 } from '../data/version1/ProcessStateV1';
import { ProcessLockedExceptionV1 } from '../data/version1/ProcessLockedExceptionV1';
import { ProcessInvalidStateExceptionV1 } from '../data/version1/ProcessInvalidStateExceptionV1';

export class ProcessLockManager {
    private static _lockTimeout = 3 * 60000;

    public static isLocked(state: ProcessStateV1): boolean {
        return state.locked_until_time != null
            && state.locked_until_time.getTime() > new Date().getTime();
    }

    public static isUnlocked(state: ProcessStateV1): boolean {
        return state.lock_token == null || state.locked_until_time == null;
    }

    public static checkNotLocked(state: ProcessStateV1): ProcessLockedExceptionV1 {
        if (this.isLocked(state))
            return new ProcessLockedExceptionV1("Process " + state.id + " is locked by running task.");
        return null;
    }

    public static checkLocked(state: ProcessStateV1): ProcessInvalidStateExceptionV1 {
        if (this.isUnlocked(state))
            return new ProcessInvalidStateExceptionV1("Process " + state.id + " was not locked");
        return null;
    }

    public static checkLockMatches(originalState: ProcessStateV1, currentState: ProcessStateV1): ProcessLockedExceptionV1 {
        if (currentState.lock_token != originalState.lock_token)
            return new ProcessLockedExceptionV1("Process " + currentState.id + " is locked by running task");
        return null;
    }

    public static checkLockValid(state: ProcessStateV1): ProcessInvalidStateExceptionV1 {
        if (state.locked_until_time != null && state.locked_until_time.getTime() < new Date().getTime())
            return new ProcessInvalidStateExceptionV1("Process " + state.id + " lock has expired");
        return null;
    }

    public static lockProcess(state: ProcessStateV1, taskType: string): void {
        // Increment attempt counter if process wasn't properly deactivated
        if (state.lock_token != null)
            state.recovery_attempts++;

        let now = new Date();
        state.last_action_time = now;
        state.locked_until_time = new Date(now.getTime() + this._lockTimeout);
        state.lock_token = IdGenerator.nextLong();
    }

    public static unlockProcess(state: ProcessStateV1): void {
        state.locked_until_time = null;
        state.lock_token = null;
    }
}