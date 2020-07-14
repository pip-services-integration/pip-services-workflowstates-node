export class TaskStatusV1 {
    /// The task is being executed
    public static readonly Executing: string = 'executing';

    /// The task was successfully completed
    public static readonly Completed: string = 'completed';

    /// The task failed
    public static readonly Failed: string = 'failed';    
}