
/// The workflow execution state
export class WorkflowStatusV1 {
    /// A new workflow was started, but the first activity hasn't completed yet. 
    /// Destinction of the initial execution state of workflow is required to prevent creation of 
    /// multiple workflows due to failures and message bouncing from queues
    public static readonly Starting: string = "Starting";

    /// The workflow is being executed, one or more activities performed
    public static readonly Active: string = "Active";

    /// The workflow is waiting for response.
    public static readonly WaitingForResponse: string = "WaitingForResponse";

    /// The workflow was successfully completed.
    public static readonly Completed: string = "Completed";

    /// The workflow failed, but can be manually restored and reactivated.
    public static readonly Failed: string = "Failed";

    /// The workflow failed and was aborted due to unrecoverable problems
    public static readonly Aborted: string = "Aborted";
}

