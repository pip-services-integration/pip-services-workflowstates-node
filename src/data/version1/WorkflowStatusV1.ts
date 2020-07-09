export class WorkflowStatusV1 {
    /// <summary>A new workflow was started, but the first activity hasn't completed yet. 
    /// Destinction of the initial execution state of workflow is required to prevent creation of 
    /// multiple workflows due to failures and message bouncing from queues</summary>
    public static readonly Starting: string = 'starting';

    /// <summary>The workflow is being executed, one or more activities performed</summary>
    public static readonly Active: string = 'active';

    /// <summary>The workflow is waiting for response.</summary>
    public static readonly WaitingForResponse: string = 'waiting';

    /// <summary>The workflow was successfully completed.</summary>
    public static readonly Completed: string = 'completed';

    /// <summary>The workflow failed, but can be manually restored and reactivated.</summary>
    public static readonly Failed: string = 'failed';

    /// <summary>The workflow failed and was aborted due to unrecoverable problems</summary>
    public static readonly Aborted: string = 'aborted';    
}