let async = require('async');

import { IProcessStatesPersistence } from '../persistence/IProcessStatesPersistence';
import { ProcessStateV1, ProcessNotFoundExceptionV1, ProcessStatusV1, ProcessAlreadyExistExceptionV1 } from '../data/version1';
import { ApplicationException, BadRequestException, DataPage, FilterParams, PagingParams } from 'pip-services3-commons-node';
import { ProcessLockManager } from './ProcessLockManager';
import { ProcessStateManager } from './ProcessStatusManager';
import { MessageEnvelope } from 'pip-services3-messaging-node';
import { ActivityManager } from './TasksManager';

export class ProcessStatesController {
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

    private _getProcessByState(status: ProcessStateV1, callback: (err: any, item: ProcessStateV1) => void): void {
        if (status == null) {
            callback(new BadRequestException("Process status cannot be null"), null);
            return;
        }
        this._getProcessById(status.id, callback);
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
            //ProcessLockHandler.CheckLockValid(status);
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
        activityType: string, queueName: string, message: MessageEnvelope, timeToLive: number = 0, callback: (err: any, item: ProcessStateV1) => void): void {
        //var process = processKey != null ? await GetProcessAsync(processType, processKey, false) : null;
        this._getProcess(processType, processKey, message != null ? message.correlation_id : null, (err, process) => {

            if (err) {
                callback(err, null);
                return;
            }
            if (process == null) {
                // Starting a new process
                ProcessStateManager.startProcess(processType, processKey, timeToLive, (err, process) => {
                    ProcessLockManager.lockProcess(process, activityType);
                    ActivityManager.startActivity(process, activityType, queueName, message);
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
                ProcessLockManager.lockProcess(process, activityType);
                ActivityManager.failActivities(process, "Lock timeout expired");
                ActivityManager.startActivity(process, activityType, queueName, message, (err) => {
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
        activityType: string, queueName: string, message: MessageEnvelope, timeToLive: number = 0, callback: (err: any, item: ProcessStateV1) => void): void {
        this._getProcess(processType, processKey, message != null ? message.correlation_id : null, (err, process) => {

            if (process == null) {
                // Starting a new process
                ProcessStateManager.startProcess(processType, processKey, timeToLive, (err, item) => {
                    process = item;
                    ActivityManager.startActivity(process, activityType, queueName, message, (err) => {
                        if (err) {
                            callback(err, null);
                            return;
                        }
                        ProcessLockManager.lockProcess(process, activityType);
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

                ProcessLockManager.lockProcess(process, activityType);
                ActivityManager.failActivities(process, "Lock timeout expired");
                ActivityManager.startActivity(process, activityType, queueName, message, (err) => {
                    this._persistence.update(correlationId, process, callback);
                });
            }
            return process;
        });
    }

    public activateProcess(correlationId: string, processId: string, activityType: string,
        queueName: string, message: MessageEnvelope, callback: (err: any, state: ProcessStateV1) => void): void {
        this._getProcessById(processId, (err, process) => {
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
            ProcessLockManager.lockProcess(process, activityType);
            ActivityManager.failActivities(process, "Lock timeout expired");
            ActivityManager.startActivity(process, activityType, queueName, message, (err) => {
                this._persistence.update(correlationId, process, callback);
            });
        });
    }

    public activateProcessByKey(correlationId: string, processType: string, processKey: string,
        activityType: string, queueName: string, message: MessageEnvelope, callback: (err: any, state: ProcessStateV1) => void): void {
        this._getProcess(processType, processKey, null, (err, process) => {
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

            ProcessLockManager.lockProcess(process, activityType);
            ActivityManager.failActivities(process, "Lock timeout expired");
            ActivityManager.startActivity(process, activityType, queueName, message);

            this._persistence.update(correlationId, process, callback);
            return process;
        });
    }

   







    public truncate(correlationId: string, timeout: number, callback: (err: any) => void): void {
        this._persistence.truncate(correlationId, timeout, callback);
    }
}