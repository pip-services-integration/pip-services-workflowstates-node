import { MessageV1 } from './MessageV1';

export class ActivityStateV1 {
    /// <summary>The type of workflow activity: Download, Upload, Close, Compensate, Transfer.</summary>
    public type: string;
    /// <summary>The activity execution state.</summary>
    public status?: string;
    /// <summary>The time when activity was started (UTC).</summary>
    public state_time?: Date;
    /// <summary>The time when activity was completed or failed (UTC).</summary>
    public end_time?: Date;
    /// <summary>The local name of message queue that activated the activity.</summary>
    public queue_name?: string;
    /// <summary>The message that activated the activity.</summary>
    public message?: MessageV1;
    /// <summary>The description of error that caused activity to fail.</summary>
    public error_message?: string;
}