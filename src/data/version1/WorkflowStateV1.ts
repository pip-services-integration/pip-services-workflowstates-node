import { IStringIdentifiable } from 'pip-services3-commons-node';

import { MessageV1 } from './MessageV1';
import { ActivityStateV1 } from './ActivityStateV1';

export class WorkflowStateV1 implements IStringIdentifiable {
    /// <summary>The unique auto-generated workflow id.</summary>
    public id: string;
    /// <summary>The type of integration workflow: Replenishment, Backorder, Dropship.</summary>
    public type: string;
    /// <summary>The external identificator for workflows without key, e.g. message id.</summary>
    public initiator_id?: string;
    /// <summary>The workflow identification key. It has to be unique within WorkflowType. 
    /// The key can be natural like PO# or artificial like "Product.FullSync".</summary>
    public key?: string;
    /// <summary>The workflow execution state.</summary>
    public status?: string;
    /// <summary>The time when workflow was started (UTC).</summary>
    public start_time?: Date;
    /// <summary>The time when workflow completed or failed (UTC).</summary>
    public end_time?: Date;
    /// <summary>The time when last workflow activity was executed (UTC).</summary>
    public last_action_time?: Date;
    /// <summary>The time when workflow shall expire (UTC).</summary>
    public expiration_time?: Date;
    /// <summary>The information about request (e.g. error message).</summary>
    public request?: string;
    /// <summary>The workflow's comment.</summary>
    public comment?: string;
    /// <summary>The  time when workflow compensation shall be performed (UTC).</summary>
    public compensation_time?: Date;
    /// <summary>The local name of a queue where compensation message shall be sent.</summary>
    public compensation_queue_name?: string;
    /// <summary>The message to be sent for compensation.</summary>
    public compensation_message?: MessageV1;
    /// <summary>The workflow's compensation timeout.</summary>
    public compensation_timeout?: number;
    /// <summary>GThe counter incremented after each compensation attempt. 
    /// The counter is cleared on successful activity completion.</summary>
    public attempt_count?: number;
    /// <summary>The unique lock token generated during workflow activation to prevent 
    /// multiple activities performing parallel processing and causing concurrency issues.</summary>
    public lock_token?: string;
    /// <summary>The locking expiration time (UTC).</summary>
    public locked_until_time?: Date;
    /// <summary>The list of executed, completed and failed workflow activities.</summary>
    public activities?: ActivityStateV1[];
    /// <summary>The workflow execution state. Using that state one activity can pass information to another activity.</summary>
    public data?: any;
}