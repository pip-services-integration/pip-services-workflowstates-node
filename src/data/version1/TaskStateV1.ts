import { MessageV1 } from './MessageV1';

export class TaskStateV1 {
    /// <summary>The type of process task: Download, Upload, Close, Recover, Transfer.</summary>
    public type: string;
    /// <summary>The task execution state.</summary>
    public status?: string;
    /// <summary>The time when task was started (UTC).</summary>
    public state_time?: Date;
    /// <summary>The time when task was completed or failed (UTC).</summary>
    public end_time?: Date;
    /// <summary>The local name of message queue that activated the task.</summary>
    public queue_name?: string;
    /// <summary>The message that activated the task.</summary>
    public message?: MessageV1;
    /// <summary>The description of error that caused task to fail.</summary>
    public error_message?: string;
}