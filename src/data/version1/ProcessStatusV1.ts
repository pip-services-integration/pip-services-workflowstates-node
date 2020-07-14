export class ProcessStatusV1 {
    /// A new process was started, but the first task hasn't completed yet. 
    /// Destinction of the initial execution state of process is required to prevent creation of 
    /// multiple processes due to failures and message bouncing from queues
    public static readonly Starting: string = 'starting';

    /// The process is being executed, one or more tasks performed
    public static readonly Running: string = 'running';

    /// The process is waiting for response.
    public static readonly Suspended: string = 'suspended';

    /// The process was successfully completed.
    public static readonly Completed: string = 'completed';

    /// The process failed, but can be manually restored and reactivated.
    public static readonly Failed: string = 'failed';

    /// The process failed and was aborted due to unrecoverable problems
    public static readonly Aborted: string = 'aborted';    
}