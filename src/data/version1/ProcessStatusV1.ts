export class ProcessStatusV1 {
    /// <summary>A new process was started, but the first task hasn't completed yet. 
    /// Destinction of the initial execution state of process is required to prevent creation of 
    /// multiple processes due to failures and message bouncing from queues</summary>
    public static readonly Starting: string = 'starting';

    /// <summary>The process is being executed, one or more tasks performed</summary>
    public static readonly Running: string = 'running';

    /// <summary>The process is waiting for response.</summary>
    public static readonly Suspended: string = 'suspended';

    /// <summary>The process was successfully completed.</summary>
    public static readonly Completed: string = 'completed';

    /// <summary>The process failed, but can be manually restored and reactivated.</summary>
    public static readonly Failed: string = 'failed';

    /// <summary>The process failed and was aborted due to unrecoverable problems</summary>
    public static readonly Aborted: string = 'aborted';    
}