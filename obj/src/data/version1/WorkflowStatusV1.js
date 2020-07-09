"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WorkflowStatusV1 {
}
exports.WorkflowStatusV1 = WorkflowStatusV1;
/// <summary>A new workflow was started, but the first activity hasn't completed yet. 
/// Destinction of the initial execution state of workflow is required to prevent creation of 
/// multiple workflows due to failures and message bouncing from queues</summary>
WorkflowStatusV1.Starting = "starting";
/// <summary>The workflow is being executed, one or more activities performed</summary>
WorkflowStatusV1.Active = "active";
/// <summary>The workflow is waiting for response.</summary>
WorkflowStatusV1.WaitingForResponse = "waiting";
/// <summary>The workflow was successfully completed.</summary>
WorkflowStatusV1.Completed = "completed";
/// <summary>The workflow failed, but can be manually restored and reactivated.</summary>
WorkflowStatusV1.Failed = "failed";
/// <summary>The workflow failed and was aborted due to unrecoverable problems</summary>
WorkflowStatusV1.Aborted = "aborted";
//# sourceMappingURL=WorkflowStatusV1.js.map