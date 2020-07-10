export class TaskStatusV1 {
    /// <summary>The task is being executed</summary>
    public static readonly Executing: string = 'executing';

    /// <summary>The task was successfully completed</summary>
    public static readonly Completed: string = 'completed';

    /// <summary>The task failed</summary>
    public static readonly Failed: string = 'failed';    
}