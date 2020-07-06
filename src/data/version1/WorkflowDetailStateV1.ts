import { MessageEnvelope } from "pip-services3-messaging-node";
import { ActivityDetailStateV1 } from "./ActivityDetailStateV1";

/// Workflow status    
export class WorkflowDetailStateV1 {
    /// The unique auto-generated workflow id.
    public id: string;

    /// The type of integration workflow: Replenishment, Backorder, Dropship.
    public type: string;

    /// The external identificator for workflows without key, e.g. message id.
    public initiator_id: string;

    /// The workflow identification key. It has to be unique within WorkflowType. 
    /// The key can be natural like PO# or artificial like "Product.FullSync".
    public key: string;

    /// The workflow execution state.
    public status: string;

    /// The time when workflow was started.
    public start_time: Date;

    /// The time when workflow completed or failed.
    public end_time?: Date;

    /// The time when last workflow activity was executed.
    public last_action_time: Date;

    /// The time when workflow shall expire.
    public expiration_time: Date;

    /// The information about request (e.g. error message).
    public request: string;

    /// The workflow's comment.
    public comment: string;

    /// The  time when workflow compensation shall be performed.
    public compensation_time?: Date;

    /// The local name of a queue where compensation message shall be sent.
    public compensation_queue_name: string;

    /// The message to be sent for compensation.
    public compensation_message: MessageEnvelope;

    /// GThe counter incremented after each compensation attempt. 
    /// The counter is cleared on successful activity completion.
    public attempt_count: number;

    /// The unique lock token generated during workflow activation to prevent 
    /// multiple activities performing parallel processing and causing concurrency issues.
    public lock_token: string;

    /// The locking expiration time.
    public locked_until_time?: Date;

    /// The list of executed, completed and failed workflow activities.
    public activities: Array<ActivityDetailStateV1> = new Array<ActivityDetailStateV1>();

    /// The workflow execution state. Using that state one activity can pass information to another activity.
    public data: Map<string, string> = new Map<string, string>();

    /// The workflow's compensation timeout.
    public compensation_timeout?: TimeSpan;

    /// Gets an object retrieved by its key and deserialized from JSON.
    ///  T
    ///  key - The key.
    public getDataAs<T>(key: string): T {
        if (this.data[key]) {
            return JSON.parse(this.data[key]) as T;
        }

        return  {} as T;
    }

    /// Sets an object into workflow state by its key. Before storage the object is serialized into JSON.
    /// key The key.
    /// value The value.
    public setData(key: string, value: any) {
        if (value != null) {
            this.data[key] = JSON.parse(value);
        } else {
            delete this.data[key];
        }
    }

    public toString(): string {
        return "[{" + this.id + "},{" + this.type + "},{" + this.status + "}]";
    }
}

