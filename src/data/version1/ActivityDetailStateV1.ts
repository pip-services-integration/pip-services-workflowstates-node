
import { MessageEnvelope } from "pip-services3-messaging-node";

/// The activity state
export class ActivityDetailStateV1 {
    /// The type of workflow activity: Download, Upload, Close, Compensate, Transfer.
    public type: string;

    /// The activity execution status.
    public status: string;

    /// The time when activity was started.
    public start_time: Date;

    /// The time when activity was completed or failed.
    public end_time?: Date;

    /// The local name of message queue that activated the activity.
    public queue_name: string;

    /// The message that activated the activity.
    public message: MessageEnvelope;

    /// The description of error that caused activity to fail.
    public error_message: string;

    public toString(): string {
        return "[" + this.type + "," + this.status + "]";
    }
}

