import { MessageV1 } from './MessageV1';

export class TaskStateV1 {
    /// The type of process task: Download, Upload, Close, Recover, Transfer.
    public type: string;
    /// The task execution state.
    public status?: string;
    /// The time when task was started (UTC).
    public start_time?: Date;
    /// The time when task was completed or failed (UTC).
    public end_time?: Date;
    /// The local name of message queue that activated the task.
    public queue_name?: string;
    /// The message that activated the task.
    public message?: MessageV1;
    /// The description of error that caused task to fail.
    public error_message?: string;
}