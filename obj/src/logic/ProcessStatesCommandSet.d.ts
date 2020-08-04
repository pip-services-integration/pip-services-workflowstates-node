import { CommandSet } from "pip-services3-commons-node";
import { IProcessStatesController } from './IProcessStatesController';
export declare class ProcessStatesCommandSet extends CommandSet {
    private _controller;
    constructor(controller: IProcessStatesController);
    private makeGetProcessesCommand;
    private makeGetProcessesByIdCommand;
    private makeStartProcessCommand;
    private makeActivateOrStartProcessCommand;
    private makeActivateProcessCommand;
    private makeActivateProcessByKeyCommand;
    private makeRollbackProcessCommand;
    private makeContinueProcessCommand;
    private makeContinueAndRecoveryProcessCommand;
    private makeRepeatProcessRecoveryCommand;
    private makeClearProcessRecoveryCommand;
    private makeFailAndContinueProcessCommand;
    private makeFailAndRecoverProcessCommand;
    private makeSuspendProcessCommand;
    private makeFailProcessCommand;
    private makeResumeProcessCommand;
    private makeCompleteProcessCommand;
    private makeAbortProcessCommand;
    private makeUpdateProcessCommand;
    private makeDeleteProcessByIdCommand;
    private makeRequestProcessForResponceCommand;
}
