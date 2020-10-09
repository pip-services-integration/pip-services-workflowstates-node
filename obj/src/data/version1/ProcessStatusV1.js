"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessStatusV1 = void 0;
class ProcessStatusV1 {
}
exports.ProcessStatusV1 = ProcessStatusV1;
/// A new process was started, but the first task hasn't completed yet. 
/// Destinction of the initial execution state of process is required to prevent creation of 
/// multiple processes due to failures and message bouncing from queues
ProcessStatusV1.Starting = 'starting';
/// The process is being executed, one or more tasks performed
ProcessStatusV1.Running = 'running';
/// The process is waiting for response.
ProcessStatusV1.Suspended = 'suspended';
/// The process was successfully completed.
ProcessStatusV1.Completed = 'completed';
/// The process failed, but can be manually restored and reactivated.
ProcessStatusV1.Failed = 'failed';
/// The process failed and was aborted due to unrecoverable problems
ProcessStatusV1.Aborted = 'aborted';
//# sourceMappingURL=ProcessStatusV1.js.map