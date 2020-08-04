"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let async = require('async');
let _ = require('lodash');
const version1_1 = require("../data/version1");
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const ProcessLockManager_1 = require("./ProcessLockManager");
const ProcessStatesManager_1 = require("./ProcessStatesManager");
const TasksManager_1 = require("./TasksManager");
const RecoveryManager_1 = require("./RecoveryManager");
const pip_services3_components_node_1 = require("pip-services3-components-node");
const ProcessStatesCommandSet_1 = require("./ProcessStatesCommandSet");
class ProcessStatesController {
    constructor() {
        this._logger = new pip_services3_components_node_1.CompositeLogger();
        this._counters = new pip_services3_components_node_1.CompositeCounters();
        this._opened = false;
    }
    getCommandSet() {
        this._commandset = this._commandset || new ProcessStatesCommandSet_1.ProcessStatesCommandSet(this);
        return this._commandset;
    }
    configure(config) {
        this._config = config;
    }
    isOpen() {
        return this._opened;
    }
    open(correlationId, callback) {
        this._opened = true;
        this._logger.info(correlationId, "Process state controller is opened");
        callback(null);
    }
    close(correlationId, callback) {
        this._opened = false;
        this._logger.info(correlationId, "Process state controller is closed");
        callback(null);
    }
    setReferences(references) {
        this._logger.setReferences(references);
        this._counters.setReferences(references);
        this._persistence = references.getOneRequired(new pip_services3_commons_node_1.Descriptor("pip-services-processstates", "persistence", "*", "*", "1.0"));
    }
    _getProcess(processType, processKey, initiatorId, errEnable = true, callback) {
        if (processType == null) {
            callback(new pip_services3_commons_node_1.ApplicationException("Process type cannot be null"), null);
            return;
        }
        if (processKey == null && initiatorId == null) {
            callback(new pip_services3_commons_node_1.ApplicationException("Process key or initiator id must be present"), null);
            return;
        }
        // Use either one to locate the right process
        if (processKey != null) {
            this._persistence.getActiveByKey(" ", processType, processKey, (err, item) => {
                if (err) {
                    callback(err, null);
                    return;
                }
                if (item == null && errEnable) {
                    callback(new pip_services3_commons_node_1.ApplicationException("Process with key " + processKey + " was does not exist"), null); //ProcessNotFoundException
                    return;
                }
                callback(null, item);
            });
        }
        else {
            this._persistence.getActiveById(processType, initiatorId, (err, item) => {
                if (err) {
                    callback(err, null);
                    return;
                }
                if (item == null && errEnable) {
                    callback(new pip_services3_commons_node_1.ApplicationException("Process with key " + processKey + " was does not exist"), null); //ProcessNotFoundException
                    return;
                }
                callback(null, item);
            });
        }
    }
    _getProcessById(processId, callback) {
        if (processId == null) {
            callback(new pip_services3_commons_node_1.BadRequestException("Process id cannot be null"), null);
            return;
        }
        this._persistence.getActiveById("", processId, (err, process) => {
            if (err) {
                callback(err, null);
                return;
            }
            if (process == null) {
                callback(new version1_1.ProcessNotFoundExceptionV1("Process with id " + processId + " was does not exist"), null);
                return;
            }
            callback(null, process);
        });
    }
    _getProcessByState(state, callback) {
        if (state == null) {
            callback(new pip_services3_commons_node_1.BadRequestException("Process state cannot be null"), null);
            return;
        }
        this._getProcessById(state.id, callback);
    }
    _getActiveProcess(state, callback) {
        this._getProcessByState(state, (err, process) => {
            if (err) {
                callback(err, null);
                return;
            }
            var checkRes = ProcessLockManager_1.ProcessLockManager.checkLocked(state);
            if (checkRes) {
                callback(checkRes, null);
                return;
            }
            // Relax rules for now - uncomment later
            //ProcessLockHandler.CheckLockValid(state);
            checkRes = ProcessStatesManager_1.ProcessStatesManager.checkActive(process);
            if (checkRes) {
                callback(checkRes, null);
                return;
            }
            checkRes = ProcessLockManager_1.ProcessLockManager.checkLocked(process);
            if (checkRes) {
                callback(checkRes, null);
                return;
            }
            checkRes = ProcessLockManager_1.ProcessLockManager.checkLockMatches(state, process);
            if (checkRes) {
                callback(checkRes, null);
                return;
            }
            callback(null, process);
        });
    }
    getProcesses(correlationId, filter, paging, callback) {
        this._persistence.getPageByFilter(correlationId, filter, paging, callback);
    }
    getProcessById(correlationId, processId, callback) {
        if (processId == null) {
            callback(new pip_services3_commons_node_1.BadRequestException("Process id cannot be null"), null);
            return;
        }
        this._persistence.getOneById(correlationId, processId, callback);
    }
    startProcess(correlationId, processType, processKey, taskType, queueName, message, timeToLive = 0, callback) {
        //var process = processKey != null ? await GetProcessAsync(processType, processKey, false) : null;
        this._getProcess(processType, processKey, message != null ? message.correlation_id : null, false, (err, process) => {
            if (err) {
                callback(err, null);
                return;
            }
            if (process == null) {
                // Starting a new process
                ProcessStatesManager_1.ProcessStatesManager.startProcess(processType, processKey, timeToLive, (err, process) => {
                    if (err) {
                        callback(err, null);
                        return;
                    }
                    ProcessLockManager_1.ProcessLockManager.lockProcess(process, taskType);
                    TasksManager_1.TasksManager.startTasks(process, taskType, queueName, message);
                    // Assign initiator id for processs created without key
                    process.request_id = processKey == null ? message.correlation_id : null;
                    this._persistence.create(correlationId, process, callback);
                    return;
                });
            }
            else {
                var checkRes = ProcessLockManager_1.ProcessLockManager.checkNotLocked(process);
                if (checkRes) {
                    callback(checkRes, null);
                    return;
                }
                // If it's active throw exception
                if (process.status != version1_1.ProcessStatusV1.Starting) {
                    callback(new version1_1.ProcessAlreadyExistExceptionV1("Process with key " + processKey + " already exist"), null);
                    return;
                }
                ProcessLockManager_1.ProcessLockManager.lockProcess(process, taskType);
                TasksManager_1.TasksManager.failTasks(process, "Lock timeout expired");
                TasksManager_1.TasksManager.startTasks(process, taskType, queueName, message, (err) => {
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
    activateOrStartProcess(correlationId, processType, processKey, taskType, queueName, message, timeToLive = 0, callback) {
        this._getProcess(processType, processKey, message != null ? message.correlation_id : null, false, (err, process) => {
            if (err) {
                callback(err, null);
                return;
            }
            if (process == null) {
                // Starting a new process
                ProcessStatesManager_1.ProcessStatesManager.startProcess(processType, processKey, timeToLive, (err, item) => {
                    if (err) {
                        callback(err, null);
                        return;
                    }
                    process = item;
                    TasksManager_1.TasksManager.startTasks(process, taskType, queueName, message, (err) => {
                        if (err) {
                            callback(err, null);
                            return;
                        }
                        ProcessLockManager_1.ProcessLockManager.lockProcess(process, taskType);
                        // Assign initiator id for processs created without key
                        process.request_id = processKey == null ? message.correlation_id : null;
                        this._persistence.create(correlationId, process, callback);
                    });
                });
            }
            else {
                var checkRes = ProcessLockManager_1.ProcessLockManager.checkNotLocked(process);
                if (checkRes) {
                    callback(checkRes, null);
                    return;
                }
                checkRes = ProcessStatesManager_1.ProcessStatesManager.checkActive(process);
                if (checkRes) {
                    callback(checkRes, null);
                    return;
                }
                //ProcessStateHandler.CheckNotExpired(process);
                ProcessLockManager_1.ProcessLockManager.lockProcess(process, taskType);
                TasksManager_1.TasksManager.failTasks(process, "Lock timeout expired");
                TasksManager_1.TasksManager.startTasks(process, taskType, queueName, message, (err) => {
                    this._persistence.update(correlationId, process, callback);
                });
            }
        });
    }
    activateProcess(correlationId, processId, taskType, queueName, message, callback) {
        this._getProcessById(processId, (err, process) => {
            if (err) {
                callback(err, null);
                return;
            }
            var checkRes = ProcessLockManager_1.ProcessLockManager.checkNotLocked(process);
            if (checkRes) {
                callback(checkRes, null);
                return;
            }
            var checkRes = ProcessStatesManager_1.ProcessStatesManager.checkActive(process);
            if (checkRes) {
                callback(checkRes, null);
                return;
            }
            //ProcessStateHandler.CheckNotExpired(process);
            ProcessLockManager_1.ProcessLockManager.lockProcess(process, taskType);
            TasksManager_1.TasksManager.failTasks(process, "Lock timeout expired");
            TasksManager_1.TasksManager.startTasks(process, taskType, queueName, message, (err) => {
                this._persistence.update(correlationId, process, callback);
            });
        });
    }
    activateProcessByKey(correlationId, processType, processKey, taskType, queueName, message, callback) {
        this._getProcess(processType, processKey, null, true, (err, process) => {
            if (err) {
                callback(err, null);
                return;
            }
            var checkRes = ProcessLockManager_1.ProcessLockManager.checkNotLocked(process);
            if (checkRes) {
                callback(checkRes, null);
                return;
            }
            checkRes = ProcessStatesManager_1.ProcessStatesManager.checkActive(process);
            if (checkRes) {
                callback(checkRes, null);
                return;
            }
            //ProcessStateHandler.CheckNotExpired(process);
            ProcessLockManager_1.ProcessLockManager.lockProcess(process, taskType);
            TasksManager_1.TasksManager.failTasks(process, "Lock timeout expired");
            TasksManager_1.TasksManager.startTasks(process, taskType, queueName, message);
            this._persistence.update(correlationId, process, callback);
            return process;
        });
    }
    continueProcess(correlationId, state, callback) {
        this._getActiveProcess(state, (err, process) => {
            if (err) {
                callback(err);
                return;
            }
            ProcessLockManager_1.ProcessLockManager.unlockProcess(process);
            TasksManager_1.TasksManager.completeTasks(process);
            ProcessStatesManager_1.ProcessStatesManager.continueProcess(process);
            RecoveryManager_1.RecoveryManager.clearRecovery(process);
            // Copy process data
            process.data = state.data || process.data;
            this._persistence.update(correlationId, process, callback);
        });
    }
    continueAndRecoverProcess(correlationId, state, recoveryQueueName, recoveryMessage, recoveryTimeout, callback) {
        this._getActiveProcess(state, (err, process) => {
            if (err) {
                callback(err);
                return;
            }
            ProcessLockManager_1.ProcessLockManager.unlockProcess(process);
            TasksManager_1.TasksManager.completeTasks(process);
            ProcessStatesManager_1.ProcessStatesManager.continueProcess(process);
            RecoveryManager_1.RecoveryManager.setRecovery(process, recoveryQueueName, recoveryMessage, recoveryTimeout);
            // Copy process data
            process.data = state.data || process.data;
            this._persistence.update(correlationId, process, callback);
        });
    }
    repeatProcessRecovery(correlationId, state, recoveryTimeout = 0, callback) {
        this._getActiveProcess(state, (err, process) => {
            if (err) {
                callback(err);
                return;
            }
            ProcessLockManager_1.ProcessLockManager.unlockProcess(process);
            TasksManager_1.TasksManager.completeTasks(process);
            ProcessStatesManager_1.ProcessStatesManager.repeatProcessActivation(process);
            RecoveryManager_1.RecoveryManager.setRecovery(process, null, null, recoveryTimeout);
            // Copy process data
            process.data = state.data || process.data;
            this._persistence.update(correlationId, process, callback);
        });
    }
    rollbackProcess(correlationId, state, callback) {
        this._getActiveProcess(state, (err, process) => {
            if (err) {
                callback(err);
                return;
            }
            // For started process just remove them
            if (process.status == version1_1.ProcessStatusV1.Starting) {
                this._persistence.deleteById(correlationId, process.id, callback);
            }
            else {
                ProcessLockManager_1.ProcessLockManager.unlockProcess(process);
                TasksManager_1.TasksManager.rollbackTasks(process);
                ProcessStatesManager_1.ProcessStatesManager.repeatProcessActivation(process);
                RecoveryManager_1.RecoveryManager.retryRecovery(process);
                // Copy process data
                process.data = state.data || process.data;
                this._persistence.update(correlationId, process, (err, item) => {
                    callback(err);
                });
            }
        });
    }
    requestProcessForResponse(correlationId, state, request, recoveryQueueName, recoveryMessage, callback) {
        this._getActiveProcess(state, (err, process) => {
            if (err) {
                callback(err, null);
                return;
            }
            ProcessLockManager_1.ProcessLockManager.unlockProcess(process);
            TasksManager_1.TasksManager.completeTasks(process);
            ProcessStatesManager_1.ProcessStatesManager.requestProcessResponse(process, request);
            RecoveryManager_1.RecoveryManager.setRecovery(process, recoveryQueueName, recoveryMessage);
            // Copy process data
            process.data = state.data || process.data;
            this._persistence.update(correlationId, process, callback);
            return process;
        });
    }
    failAndContinueProcess(correlationId, state, errorMessage, callback) {
        this._getActiveProcess(state, (err, process) => {
            if (err) {
                callback(err);
                return;
            }
            ProcessLockManager_1.ProcessLockManager.unlockProcess(process);
            TasksManager_1.TasksManager.failTasks(process, errorMessage);
            ProcessStatesManager_1.ProcessStatesManager.repeatProcessActivation(process);
            RecoveryManager_1.RecoveryManager.clearRecovery(process);
            // Copy process data
            process.data = state.data || process.data;
            this._persistence.update(correlationId, process, (err, item) => {
                callback(err);
            });
        });
    }
    failAndRecoverProcess(correlationId, state, errorMessage, recoveryQueueName, recoveryMessage, recoveryTimeout = 0, callback) {
        this._getActiveProcess(state, (err, process) => {
            if (err) {
                callback(err);
                return;
            }
            ProcessLockManager_1.ProcessLockManager.unlockProcess(process);
            TasksManager_1.TasksManager.failTasks(process, errorMessage);
            ProcessStatesManager_1.ProcessStatesManager.repeatProcessActivation(process);
            //ProcessStatesManager.ActivateProcessWithFailure(process);
            RecoveryManager_1.RecoveryManager.setRecovery(process, recoveryQueueName, recoveryMessage, recoveryTimeout);
            // Copy process data
            process.data = state.data || process.data;
            this._persistence.update(correlationId, process, (err, item) => {
                callback(err);
            });
        });
    }
    failProcess(correlationId, state, errorMessage, callback) {
        this._getProcessByState(state, (err, process) => {
            ProcessLockManager_1.ProcessLockManager.unlockProcess(process);
            TasksManager_1.TasksManager.failTasks(process, errorMessage);
            ProcessStatesManager_1.ProcessStatesManager.failProcess(process);
            RecoveryManager_1.RecoveryManager.clearRecovery(process);
            // Copy process data
            process.data = state.data || process.data;
            this._persistence.update(correlationId, process, (err, item) => {
                callback(err);
            });
            return process;
        });
    }
    resumeProcess(correlationId, state, comment, callback) {
        this._getProcessByState(state, (err, process) => {
            if (err) {
                callback(err, null);
                return;
            }
            var checkRes = ProcessStatesManager_1.ProcessStatesManager.checkPending(process);
            if (checkRes) {
                callback(checkRes, null);
                return;
            }
            ProcessLockManager_1.ProcessLockManager.unlockProcess(process);
            if (TasksManager_1.TasksManager.hasCompletedTasks(process))
                ProcessStatesManager_1.ProcessStatesManager.continueProcess(process);
            else
                ProcessStatesManager_1.ProcessStatesManager.restartProcess(process);
            RecoveryManager_1.RecoveryManager.setRecovery(process, state.recovery_queue_name, state.recovery_message, 0);
            ProcessStatesManager_1.ProcessStatesManager.extendProcessExpiration(process);
            // Copy process data
            process.data = state.data || process.data;
            process.comment = comment;
            this._persistence.update(correlationId, process, callback);
        });
    }
    abortProcess(correlationId, state, comment, callback) {
        this._getProcessByState(state, (err, process) => {
            ProcessLockManager_1.ProcessLockManager.unlockProcess(process);
            TasksManager_1.TasksManager.failTasks(process, "Lock timeout expired");
            ProcessStatesManager_1.ProcessStatesManager.abortProcess(process);
            RecoveryManager_1.RecoveryManager.clearRecovery(process);
            // Copy over process data
            process.data = state.data || process.data;
            process.comment = comment;
            this._persistence.update(correlationId, process, (err, item) => {
                callback(err);
            });
        });
    }
    completeProcess(correlationId, state, callback) {
        this._getActiveProcess(state, (err, process) => {
            ProcessLockManager_1.ProcessLockManager.unlockProcess(process);
            TasksManager_1.TasksManager.completeTasks(process);
            ProcessStatesManager_1.ProcessStatesManager.completeProcess(process);
            RecoveryManager_1.RecoveryManager.clearRecovery(process);
            // Copy process data
            process.data = state.data || process.data;
            this._persistence.update(correlationId, process, (err, item) => {
                callback(err);
            });
        });
    }
    clearProcessRecovery(correlationId, state, callback) {
        this._getProcessByState(state, (err, process) => {
            RecoveryManager_1.RecoveryManager.clearRecovery(process);
            this._persistence.update(correlationId, process, (err, item) => {
                callback(err);
            });
        });
    }
    updateProcess(correlationId, state, callback) {
        this._persistence.update(correlationId, state, callback);
    }
    deleteProcessById(correlationId, processId, callback) {
        this._persistence.deleteById(correlationId, processId, callback);
    }
    suspendProcess(correlationId, state, request, recoveryQueue, recoveryMessage, recoveryTimeout, callback) {
        this._getActiveProcess(state, (err, process) => {
            if (err) {
                callback(err);
                return;
            }
            ProcessLockManager_1.ProcessLockManager.unlockProcess(process);
            ProcessStatesManager_1.ProcessStatesManager.requestProcessResponse(process, request);
            RecoveryManager_1.RecoveryManager.setRecovery(process, recoveryQueue, recoveryMessage, recoveryTimeout);
            // Copy process data
            process.data = state.data || process.data;
            this._persistence.update(correlationId, process, (err, item) => {
                callback(err);
            });
        });
    }
    truncate(correlationId, timeout, callback) {
        this._persistence.truncate(correlationId, timeout, callback);
    }
}
exports.ProcessStatesController = ProcessStatesController;
//# sourceMappingURL=ProcessStatesController.js.map