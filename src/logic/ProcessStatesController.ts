let async = require('async');

import { IProcessStatesPersistence } from '../persistence/IProcessStatesPersistence';
import { ProcessStateV1, ProcessNotFoundExceptionV1, ProcessStatusV1, ProcessAlreadyExistExceptionV1, MessageV1 } from '../data/version1';
import { ApplicationException, BadRequestException, DataPage, FilterParams, PagingParams } from 'pip-services3-commons-node';
import { ProcessLockManager } from './ProcessLockManager';
import { ProcessStateManager } from './ProcessStatusManager';
import { TasksManager } from './TasksManager';
import { RecoveryManager } from './RecoveryManager';
import { IProcessStatesController } from './IProcessStatesController';

export class ProcessStatesController implements IProcessStatesController {
   
    private _persistence: IProcessStatesPersistence;

    public ProcessStatusController(persistence: IProcessStatesPersistence) {
        this._persistence = persistence;
    }

    private _getProcess(
        processType: string, processKey: string, initiatorId: string, callback: (err: any, result: ProcessStateV1) => void): void {
        if (processType == null) {
            callback(new ApplicationException("Process type cannot be null"), null);
            return;
        }
        if (processKey == null && initiatorId == null) {
            callback(new ApplicationException("Process key or initiator id must be present"), null);
            return;
        }

        // Use either one to locate the right process
        if (processKey != null) {
            this._persistence.getActiveByKey(" ", processType, processKey, (err, item) => {
                if (err) {
                    callback(err, null);
                    return;
                }
                if (item == null) {
                    callback(new ApplicationException("Process with key " + processKey + " was does not exist"), null); //ProcessNotFoundException
                    return;
                }
                callback(null, item);
            });
        } else {
            this._persistence.getActiveById(processType, initiatorId, (err, item) => {
                if (err) {
                    callback(err, null);
                    return;
                }
                if (item == null) {
                    callback(new ApplicationException("Process with key " + processKey + " was does not exist"), null); //ProcessNotFoundException
                    return;
                }
                callback(null, item);
            });
        }
    }

    private _getProcessById(processId: string, callback: (err: any, item: ProcessStateV1) => void): void {
        if (processId == null) {
            callback(new BadRequestException("Process id cannot be null"), null);
            return;
        }

        this._persistence.getActiveById("", processId, (err, process) => {
            if (err) {
                callback(err, null);
                return;
            }
            if (process == null) {
                callback(new ProcessNotFoundExceptionV1("Process with id " + processId + " was does not exist"), null);
                return;
            }
            callback(null, process);
        });
    }

    private _getProcessByState(state: ProcessStateV1, callback: (err: any, item: ProcessStateV1) => void): void {
        if (state == null) {
            callback(new BadRequestException("Process state cannot be null"), null);
            return;
        }
        this._getProcessById(state.id, callback);
    }

    private _getActiveProcess(state: ProcessStateV1, callback: (err: any, item: ProcessStateV1) => void): void {
        this._getProcessByState(state, (err, process) => {
            if (err) {
                callback(err, null);
                return;
            }
            var checkRes = ProcessLockManager.checkLocked(state);
            if (checkRes) {
                callback(checkRes, null);
                return;
            }
            // Relax rules for now - uncomment later
            //ProcessLockHandler.CheckLockValid(state);
            checkRes = ProcessStateManager.checkActive(process);
            if (checkRes) {
                callback(checkRes, null);
                return;
            }
            checkRes = ProcessLockManager.checkLocked(process);
            if (checkRes) {
                callback(checkRes, null);
                return;
            }
            checkRes = ProcessLockManager.checkLockMatches(state, process);
            if (checkRes) {
                callback(checkRes, null);
                return;
            }
            callback(null, process);
        });
    }

    public getProcesses(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<ProcessStateV1>) => void): void {
        this._persistence.getPageByFilter(correlationId, filter, paging, callback);
    }

    public getProcessById(correlationId: string, processId: string, callback: (err: any, item: ProcessStateV1) => void): void {
        if (processId == null) {
            callback(new BadRequestException("Process id cannot be null"), null);
            return;
        }
        this._persistence.getOneById(correlationId, processId, callback);
    }

    public startProcess(correlationId: string, processType: string, processKey: string,
        taskType: string, queueName: string, message: MessageV1, timeToLive: number = 0, callback: (err: any, item: ProcessStateV1) => void): void {
        //var process = processKey != null ? await GetProcessAsync(processType, processKey, false) : null;
        this._getProcess(processType, processKey, message != null ? message.correlation_id : null, (err, process) => {

            if (err) {
                callback(err, null);
                return;
            }
            if (process == null) {
                // Starting a new process
                ProcessStateManager.startProcess(processType, processKey, timeToLive, (err, process) => {
                    ProcessLockManager.lockProcess(process, taskType);
                    TasksManager.startTasks(process, taskType, queueName, message);
                    // Assign initiator id for processs created without key
                    process.request_id = processKey == null ? message.correlation_id : null;
                    this._persistence.create(correlationId, process, callback);
                    return;
                });
            }
            else {
                var checkRes = ProcessLockManager.checkNotLocked(process);
                if (checkRes) {
                    callback(checkRes, null);
                    return;
                }
                // If it's active throw exception
                if (process.status != ProcessStatusV1.Starting)
                    throw new ProcessAlreadyExistExceptionV1("Process with key " + processKey + " already exist");
                ProcessLockManager.lockProcess(process, taskType);
                TasksManager.failTasks(process, "Lock timeout expired");
                TasksManager.startTasks(process, taskType, queueName, message, (err) => {
                    if (err) {
                        callback(err, null);
                        return;
                    }
                    this._persistence.update(correlationId, process, callback);
                    return;
                });
            }
        });
    }

    public activateOrStartProcess(correlationId: string, processType: string, processKey: string,
        taskType: string, queueName: string, message: MessageV1, timeToLive: number = 0, callback: (err: any, item: ProcessStateV1) => void): void {
        this._getProcess(processType, processKey, message != null ? message.correlation_id : null, (err, process) => {

            if (process == null) {
                // Starting a new process
                ProcessStateManager.startProcess(processType, processKey, timeToLive, (err, item) => {
                    process = item;
                    TasksManager.startTasks(process, taskType, queueName, message, (err) => {
                        if (err) {
                            callback(err, null);
                            return;
                        }
                        ProcessLockManager.lockProcess(process, taskType);
                        // Assign initiator id for processs created without key
                        process.request_id = processKey == null ? message.correlation_id : null;
                        this._persistence.create(correlationId, process, callback);
                    });
                });
            } else {
                var checkRes = ProcessLockManager.checkNotLocked(process);
                if (checkRes) {
                    callback(checkRes, null);
                    return;
                }
                checkRes = ProcessStateManager.checkActive(process);
                if (checkRes) {
                    callback(checkRes, null);
                    return;
                }
                //ProcessStateHandler.CheckNotExpired(process);
                ProcessLockManager.lockProcess(process, taskType);
                TasksManager.failTasks(process, "Lock timeout expired");
                TasksManager.startTasks(process, taskType, queueName, message, (err) => {
                    this._persistence.update(correlationId, process, callback);
                });
            }
            return process;
        });
    }

    public activateProcess(correlationId: string, processId: string, taskType: string,
        queueName: string, message: MessageV1, callback: (err: any, state: ProcessStateV1) => void): void {
        this._getProcessById(processId, (err, process) => {
            if (err) {
                callback(err, null);
                return;
            }
            var checkRes = ProcessLockManager.checkNotLocked(process);
            if (checkRes) {
                callback(checkRes, null);
                return;
            }
            var checkRes = ProcessStateManager.checkActive(process);
            if (checkRes) {
                callback(checkRes, null);
                return;
            }
            //ProcessStateHandler.CheckNotExpired(process);
            ProcessLockManager.lockProcess(process, taskType);
            TasksManager.failTasks(process, "Lock timeout expired");
            TasksManager.startTasks(process, taskType, queueName, message, (err) => {
                this._persistence.update(correlationId, process, callback);
            });
        });
    }

    public activateProcessByKey(correlationId: string, processType: string, processKey: string,
        taskType: string, queueName: string, message: MessageV1, callback: (err: any, state: ProcessStateV1) => void): void {
        this._getProcess(processType, processKey, null, (err, process) => {
            if (err) {
                callback(err, null);
                return;
            }
            var checkRes = ProcessLockManager.checkNotLocked(process);
            if (checkRes) {
                callback(checkRes, null);
                return;
            }
            checkRes = ProcessStateManager.checkActive(process);
            if (checkRes) {
                callback(checkRes, null);
                return;
            }
            //ProcessStateHandler.CheckNotExpired(process);
            ProcessLockManager.lockProcess(process, taskType);
            TasksManager.failTasks(process, "Lock timeout expired");
            TasksManager.startTasks(process, taskType, queueName, message);

            this._persistence.update(correlationId, process, callback);
            return process;
        });
    }


    public continueProcess(correlationId: string, state: ProcessStateV1, callback: (err: any) => void): void {
        this._getActiveProcess(state, (err, process) => {
            if (err) {
                callback(err);
                return;
            }
            ProcessLockManager.unlockProcess(process);
            TasksManager.completeTasks(process);
            ProcessStateManager.continueProcess(process);
            RecoveryManager.clearRecovery(process);
            // Copy process data
            process.data = state.data || process.data;
            this._persistence.update(correlationId, process, callback);
        });
    }

    public continueAndRecoverProcess(correlationId: string, state: ProcessStateV1,
        recoveryQueueName: string, recoveryMessage: MessageV1, recoveryTimeout: number, callback: (err: any) => void): void {
        this._getActiveProcess(state, (err, process) => {
            if (err) {
                callback(err);
                return;
            }
            ProcessLockManager.unlockProcess(process);
            TasksManager.completeTasks(process);
            ProcessStateManager.continueProcess(process);
            RecoveryManager.setRecovery(process, recoveryQueueName, recoveryMessage, recoveryTimeout);
            // Copy process data
            process.data = state.data || process.data;
            this._persistence.update(correlationId, process, callback);
        });
    }

    public repeatProcessRecovery(correlationId: string, state: ProcessStateV1, recoveryTimeout: number = 0, callback: (err: any) => void): void {
        this._getActiveProcess(state, (err, process) => {
            if (err) {
                callback(err);
                return;
            }
            ProcessLockManager.unlockProcess(process);
            TasksManager.completeTasks(process);
            ProcessStateManager.repeatProcessActivation(process);
            RecoveryManager.setRecovery(process, null, null, recoveryTimeout);
            // Copy process data
            process.data = state.data || process.data;
            this._persistence.update(correlationId, process, callback);
        });
    }

    public rollbackProcess(correlationId: string, state: ProcessStateV1, callback: (err: any) => void): void {
        this._getActiveProcess(state, (err, process) => {
            if (err) {
                callback(err);
                return;
            }
            // For started process just remove them
            if (process.status == ProcessStatusV1.Starting) {
                this._persistence.deleteById(correlationId, process.id, callback);
            } else {
                ProcessLockManager.unlockProcess(process);
                TasksManager.rollbackTasks(process);
                ProcessStateManager.repeatProcessActivation(process);
                RecoveryManager.retryRecovery(process);
                // Copy process data
                process.data = state.data || process.data;
                this._persistence.update(correlationId, process, (err, item) => {
                    callback(err);
                });
            }
        });
    }

    public requestForResponse(correlationId: string, state: ProcessStateV1, request: string,
        recoveryQueueName: string, recoveryMessage: MessageV1, callback: (err: any, state: ProcessStateV1) => void): void {
        this._getActiveProcess(state, (err, process) => {
            if (err) {
                callback(err, null);
                return;
            }
            ProcessLockManager.unlockProcess(process);
            TasksManager.completeTasks(process);
            ProcessStateManager.requestProcessResponse(process, request);
            RecoveryManager.setRecovery(process, recoveryQueueName, recoveryMessage);
            // Copy process data
            process.data = state.data || process.data;
            this._persistence.update(correlationId, process, callback);
            return process;
        });
    }

    public failAndContinueProcess(correlationId: string, state: ProcessStateV1, errorMessage: string, callback: (err: any) => void): void {
        this._getActiveProcess(state, (err, process) => {
            if (err) {
                callback(err);
                return;
            }
            ProcessLockManager.unlockProcess(process);
            TasksManager.failTasks(process, errorMessage);
            ProcessStateManager.repeatProcessActivation(process);
            RecoveryManager.clearRecovery(process);
            // Copy process data
            process.data = state.data ?? process.data;
            this._persistence.update(correlationId, process, (err, item) => {
                callback(err);
            });
        });
    }

    public failAndRecoverProcess(correlationId: string, state: ProcessStateV1, errorMessage: string,
        recoveryQueueName: string, recoveryMessage: MessageV1, recoveryTimeout: number = 0, callback: (err: any) => void): void {
        this._getActiveProcess(state, (err, process) => {
            if (err) {
                callback(err);
                return;
            }
            ProcessLockManager.unlockProcess(process);
            TasksManager.failTasks(process, errorMessage);
            ProcessStateManager.repeatProcessActivation(process);
            //ProcessStateManager.ActivateProcessWithFailure(process);
            RecoveryManager.setRecovery(process, recoveryQueueName, recoveryMessage, recoveryTimeout);

            // Copy process data
            process.data = state.data ?? process.data;

            this._persistence.update(correlationId, process, (err, item) => {
                callback(err);
            });
        });
    }

    public failProcess(correlationId: string, state: ProcessStateV1, errorMessage: string, callback: (err: any) => void): void {
        this._getProcessByState(state, (err, process) => {
            ProcessLockManager.unlockProcess(process);
            TasksManager.failTasks(process, errorMessage);
            ProcessStateManager.failProcess(process);
            RecoveryManager.clearRecovery(process);
            // Copy process data
            process.data = state.data ?? process.data;
            this._persistence.update(correlationId, process, (err, item) => {
                callback(err);
            });
            return process;
        });
    }

    public resumeProcess(correlationId: string, state: ProcessStateV1, comment: string, callback: (err: any, state: ProcessStateV1) => void): void {
        this._getProcessByState(state, (err, process) => {
            if (err) {
                callback(err, null);
                return;
            }
            var checkRes = ProcessStateManager.checkPending(process);
            if (checkRes) {
                callback(checkRes, null);
            }
            ProcessLockManager.unlockProcess(process);
            if (TasksManager.hasCompletedTasks(process))
                ProcessStateManager.continueProcess(process);
            else
                ProcessStateManager.restartProcess(process);
            RecoveryManager.setRecovery(process, state.recovery_queue_name, state.recovery_message, 0);
            ProcessStateManager.extendProcessExpiration(process);
            // Copy process data
            process.data = state.data ?? process.data;
            process.comment = comment;
            this._persistence.update(correlationId, process, callback);
            return process;
        });
    }

    public abortProcess(correlationId: string, state: ProcessStateV1, comment: string, callback: (err: any) => void): void {
        this._getProcessByState(state, (err, process) => {
            ProcessLockManager.unlockProcess(process);
            TasksManager.failTasks(process, "Lock timeout expired");
            ProcessStateManager.abortProcess(process);
            RecoveryManager.clearRecovery(process);
            // Copy over process data
            process.data = state.data ?? process.data;
            process.comment = comment;
            this._persistence.update(correlationId, process, (err, item) => {
                callback(err);
            });
        });
    }

    public completeProcess(correlationId: string, state: ProcessStateV1,
        callback: (err: any) => void): void {
        this._getActiveProcess(state, (err, process) => {
            ProcessLockManager.unlockProcess(process);
            TasksManager.completeTasks(process);
            ProcessStateManager.completeProcess(process);
            RecoveryManager.clearRecovery(process);
            // Copy process data
            process.data = state.data ?? process.data;
            this._persistence.update(correlationId, process, (err, item) => {
                callback(err);
            });
            return process;
        });
    }

    public clearProcessRecovery(correlationId: string, state: ProcessStateV1, callback: (err: any) => void): void {
        this._getProcessByState(state, (err, process) => {
            RecoveryManager.clearRecovery(process);
            this._persistence.update(correlationId, process, (err, item) => {
                callback(err);
            });
        });
    }

    public updateProcess(correlationId: string, state: ProcessStateV1,
        callback: (err: any, state: ProcessStateV1) => void): void {
         this._persistence.update(correlationId, state, callback);
    }

    public deleteProcessById(correlationId: string, processId: string,
        callback: (err: any, state: ProcessStateV1) => void): void
    {
        this._persistence.deleteById(correlationId, processId, callback);
    }

    public suspendProcess(correlationId: string, state: ProcessStateV1, request: string, 
        recoveryQueue: string, recoveryMessage: MessageV1, callback: (err: any) => void): void {
            this._getActiveProcess(state, (err, process) => {
                if (err) {
                    callback(err);
                    return;
                }
                ProcessLockManager.unlockProcess(process);
                ProcessStateManager.requestProcessResponse(process, request);
                // TODO: need added recovery time or not?
                RecoveryManager.setRecovery(process, recoveryQueue, recoveryMessage); 
    
                // Copy process data
                process.data = state.data ?? process.data;
                this._persistence.update(correlationId, process, (err, item) => {
                    callback(err);
                });
            });
    }

    public truncate(correlationId: string, timeout: number, callback: (err: any) => void): void {
        this._persistence.truncate(correlationId, timeout, callback);
    }
}