import { IStringIdentifiable } from 'pip-services3-commons-node';

import { MessageV1 } from './MessageV1';
import { TaskStateV1 } from './TaskStateV1';

export class ProcessStateV1 implements IStringIdentifiable {
    /// <summary>The unique auto-generated process id.</summary>
    public id: string;
    /// <summary>The type of integration process: Replenishment, Backorder, Dropship.</summary>
    public type: string;
    /// <summary>The external identificator for processes without key, e.g. message id.</summary>
    public initiator_id?: string;
    /// <summary>The process identification key. It has to be unique within ProcessType. 
    /// The key can be natural like PO# or artificial like "Product.FullSync".</summary>
    public key?: string;
    /// <summary>The process execution state.</summary>
    public status?: string;
    /// <summary>The time when process was started (UTC).</summary>
    public start_time?: Date;
    /// <summary>The time when process completed or failed (UTC).</summary>
    public end_time?: Date;
    /// <summary>The time when last process task was executed (UTC).</summary>
    public last_action_time?: Date;
    /// <summary>The time when process shall expire (UTC).</summary>
    public expiration_time?: Date;
    /// <summary>The information about request (e.g. error message).</summary>
    public request?: string;
    /// <summary>The process's comment.</summary>
    public comment?: string;
    /// <summary>The  time when process recovery shall be performed (UTC).</summary>
    public recovery_time?: Date;
    /// <summary>The local name of a queue where recovery message shall be sent.</summary>
    public recovery_queue_name?: string;
    /// <summary>The message to be sent for recovery.</summary>
    public recovery_message?: MessageV1;
    /// <summary>The process's recovery timeout.</summary>
    public recovery_timeout?: number;
    /// <summary>GThe counter incremented after each recovery attempt. 
    /// The counter is cleared on successful task completion.</summary>
    public recovery_attempts?: number;
    /// <summary>The unique lock token generated during process activation to prevent 
    /// multiple tasks performing parallel processing and causing concurrency issues.</summary>
    public lock_token?: string;
    /// <summary>The locking expiration time (UTC).</summary>
    public locked_until_time?: Date;
    /// <summary>The list of executed, completed and failed process tasks.</summary>
    public tasks?: TaskStateV1[];
    /// <summary>The process execution state. Using that state one task can pass information to another task.</summary>
    public data?: any;
}