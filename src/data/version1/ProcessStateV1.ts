import { IStringIdentifiable } from 'pip-services3-commons-node';

import { MessageV1 } from './MessageV1';
import { TaskStateV1 } from './TaskStateV1';

export class ProcessStateV1 implements IStringIdentifiable {
    /// The unique auto-generated process id.
    public id: string;
    /// The type of integration process: Replenishment, Backorder, Dropship.
    public type: string;
    /// The external identificator for processes without key, e.g. message id.
    public request_id?: string;
    /// The process identification key. It has to be unique within ProcessType. 
    /// The key can be natural like PO# or artificial like "Product.FullSync".
    public key?: string;
    /// The process execution state.
    public status?: string;
    /// The time when process was started (UTC).
    public start_time?: Date;
    /// The time when process completed or failed (UTC).
    public end_time?: Date;
    /// The time when last process task was executed (UTC).
    public last_action_time?: Date;
    /// The time when process shall expire (UTC).
    public expiration_time?: Date;
    /// The information about request (e.g. error message).
    public request?: string;
    /// The process's comment.
    public comment?: string;
    /// The  time when process recovery shall be performed (UTC).
    public recovery_time?: Date;
    /// The local name of a queue where recovery message shall be sent.
    public recovery_queue_name?: string;
    /// The message to be sent for recovery.
    public recovery_message?: MessageV1;
    /// The process's recovery timeout.
    public recovery_timeout?: number;
    /// GThe counter incremented after each recovery attempt. 
    /// The counter is cleared on successful task completion.
    public recovery_attempts?: number;
    /// The unique lock token generated during process activation to prevent 
    /// multiple tasks performing parallel processing and causing concurrency issues.
    public lock_token?: string;
    /// The locking expiration time (UTC).
    public locked_until_time?: Date;
    /// The list of executed, completed and failed process tasks.
    public tasks?: TaskStateV1[];
    /// The process execution state. Using that state one task can pass information to another task.
    public data?: any;
}