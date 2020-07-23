"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let async = require('async');
let _ = require('lodash');
const version1_1 = require("../data/version1");
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const ProcessLockManager_1 = require("./ProcessLockManager");
const ProcessStateManager_1 = require("./ProcessStateManager");
const TasksManager_1 = require("./TasksManager");
const RecoveryManager_1 = require("./RecoveryManager");
const pip_services3_components_node_1 = require("pip-services3-components-node");
const ProcessStateCommandSet_1 = require("./ProcessStateCommandSet");
/*
 options:
  - options.trunc_interval  - (default ) Truncate proceses interval in ms
  - options.close_exp_interval - (default ) Close expired processes interval in ms
  - options.recovery_interval - (default ) Recovery processes interval in ms
*/
class ProcessStatesController {
    constructor() {
        this._logger = new pip_services3_components_node_1.CompositeLogger();
        this._counters = new pip_services3_components_node_1.CompositeCounters();
        this._opened = false;
        this._trunc_interval = 90 * 24 * 60 * 60 * 1000; // 90 days
        this._close_exp_interval = 5 * 60 * 1000; // 5 minutes
        this._recovery_interval = 1 * 60 * 1000; // 1 minute
        this._batchSize = 100;
    }
    getCommandSet() {
        this._commandset = this._commandset || new ProcessStateCommandSet_1.ProcessStateCommandSet(this);
        return this._commandset;
    }
    configure(config) {
        this._config = config;
        this._trunc_interval = config.getAsLongWithDefault('options.trunc_interval', this._trunc_interval);
        this._close_exp_interval = config.getAsLongWithDefault('options.close_exp_interval', this._close_exp_interval);
        this._recovery_interval = config.getAsLongWithDefault('options.recovery_interval', this._recovery_interval);
    }
    isOpen() {
        return this._opened;
    }
    open(correlationId, callback) {
        // Enable periodic truncate process items
        if (this._trunc_interval > 0) {
            this._truncate_timer = setInterval(() => {
                this._truncateProcessing(correlationId);
            }, this._trunc_interval);
            this._logger.info(correlationId, "Truncate processing is enable");
        }
        if (this._close_exp_interval > 0) {
            this._close_exp_timer = setInterval(() => {
                this._closeExpiredProcessing(correlationId);
            }, this._close_exp_interval);
            this._logger.info(correlationId, "Closing expired processing is enable");
        }
        if (this._recovery_interval > 0) {
            this._recovery_timer = setInterval(() => {
                this._recoveryProcessing(correlationId);
            }, this._recovery_interval);
            this._logger.info(correlationId, "Recovery processing is enable");
        }
        this._opened = true;
        this._logger.info(correlationId, "Process state controller is opened");
        callback(null);
    }
    close(correlationId, callback) {
        if (this._recovery_timer) {
            clearInterval(this._recovery_timer);
            this._logger.info(correlationId, "Recovery processing is disable");
        }
        if (this._close_exp_timer) {
            clearInterval(this._close_exp_timer);
            this._logger.info(correlationId, "Closing expired processing is disable");
        }
        if (this._truncate_timer) {
            clearInterval(this._truncate_timer);
            this._logger.info(correlationId, "Truncate processing is disable");
        }
        this._opened = false;
        this._logger.info(correlationId, "Process state controller is closed");
        callback(null);
    }
    setReferences(references) {
        //this._references = references;
        this._logger.setReferences(references);
        this._counters.setReferences(references);
        this._persistence = references.getOneRequired(new pip_services3_commons_node_1.Descriptor("pip-services-processstates", "persistence", "*", "*", "1.0"));
    }
    _getProcess(processType, processKey, initiatorId, callback) {
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
                if (item == null) {
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
                if (item == null) {
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
            checkRes = ProcessStateManager_1.ProcessStateManager.checkActive(process);
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
        this._getProcess(processType, processKey, message != null ? message.correlation_id : null, (err, process) => {
            // if (err) {
            //     callback(err, null);
            //     return;
            // }
            if (process == null) {
                // Starting a new process
                ProcessStateManager_1.ProcessStateManager.startProcess(processType, processKey, timeToLive, (err, process) => {
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
        this._getProcess(processType, processKey, message != null ? message.correlation_id : null, (err, process) => {
            if (process == null) {
                // Starting a new process
                ProcessStateManager_1.ProcessStateManager.startProcess(processType, processKey, timeToLive, (err, item) => {
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
                checkRes = ProcessStateManager_1.ProcessStateManager.checkActive(process);
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
            var checkRes = ProcessStateManager_1.ProcessStateManager.checkActive(process);
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
        this._getProcess(processType, processKey, null, (err, process) => {
            if (err) {
                callback(err, null);
                return;
            }
            var checkRes = ProcessLockManager_1.ProcessLockManager.checkNotLocked(process);
            if (checkRes) {
                callback(checkRes, null);
                return;
            }
            checkRes = ProcessStateManager_1.ProcessStateManager.checkActive(process);
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
            ProcessStateManager_1.ProcessStateManager.continueProcess(process);
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
            ProcessStateManager_1.ProcessStateManager.continueProcess(process);
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
            ProcessStateManager_1.ProcessStateManager.repeatProcessActivation(process);
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
                ProcessStateManager_1.ProcessStateManager.repeatProcessActivation(process);
                RecoveryManager_1.RecoveryManager.retryRecovery(process);
                // Copy process data
                process.data = state.data || process.data;
                this._persistence.update(correlationId, process, (err, item) => {
                    callback(err);
                });
            }
        });
    }
    requestForResponse(correlationId, state, request, recoveryQueueName, recoveryMessage, callback) {
        this._getActiveProcess(state, (err, process) => {
            if (err) {
                callback(err, null);
                return;
            }
            ProcessLockManager_1.ProcessLockManager.unlockProcess(process);
            TasksManager_1.TasksManager.completeTasks(process);
            ProcessStateManager_1.ProcessStateManager.requestProcessResponse(process, request);
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
            ProcessStateManager_1.ProcessStateManager.repeatProcessActivation(process);
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
            ProcessStateManager_1.ProcessStateManager.repeatProcessActivation(process);
            //ProcessStateManager.ActivateProcessWithFailure(process);
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
            ProcessStateManager_1.ProcessStateManager.failProcess(process);
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
            var checkRes = ProcessStateManager_1.ProcessStateManager.checkPending(process);
            if (checkRes) {
                callback(checkRes, null);
            }
            ProcessLockManager_1.ProcessLockManager.unlockProcess(process);
            if (TasksManager_1.TasksManager.hasCompletedTasks(process))
                ProcessStateManager_1.ProcessStateManager.continueProcess(process);
            else
                ProcessStateManager_1.ProcessStateManager.restartProcess(process);
            RecoveryManager_1.RecoveryManager.setRecovery(process, state.recovery_queue_name, state.recovery_message, 0);
            ProcessStateManager_1.ProcessStateManager.extendProcessExpiration(process);
            // Copy process data
            process.data = state.data || process.data;
            process.comment = comment;
            this._persistence.update(correlationId, process, callback);
            return process;
        });
    }
    abortProcess(correlationId, state, comment, callback) {
        this._getProcessByState(state, (err, process) => {
            ProcessLockManager_1.ProcessLockManager.unlockProcess(process);
            TasksManager_1.TasksManager.failTasks(process, "Lock timeout expired");
            ProcessStateManager_1.ProcessStateManager.abortProcess(process);
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
            ProcessStateManager_1.ProcessStateManager.completeProcess(process);
            RecoveryManager_1.RecoveryManager.clearRecovery(process);
            // Copy process data
            process.data = state.data || process.data;
            this._persistence.update(correlationId, process, (err, item) => {
                callback(err);
            });
            return process;
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
            ProcessStateManager_1.ProcessStateManager.requestProcessResponse(process, request);
            // TODO: need added recovery time or not?  Add timeout to interface
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
    _truncateProcessing(correlationId, callback) {
        this._logger.info(correlationId, "Starting truncation of process states");
        this.truncate(correlationId, 0, (err) => {
            if (err) {
                this._logger.error(correlationId, err, "Truncation of process states failed");
            }
            else
                this._logger.info(correlationId, "Completed truncation of process states");
            if (callback) {
                callback(err);
            }
        });
    }
    _recoveryProcessing(correlationId, callback) {
        this._logger.info(correlationId, "Starting recovery of process states");
        var recovered = 0;
        var skip = 0;
        var now = new Date();
        var recover = true;
        async.whilst(() => {
            return recover;
        }, (callback) => {
            var filter = pip_services3_commons_node_1.FilterParams.fromTuples("states", version1_1.ProcessStatusV1.Starting + "," + version1_1.ProcessStatusV1.Running, "recovered", true);
            var paging = new pip_services3_commons_node_1.PagingParams(skip, this._batchSize, false);
            this._persistence.getPageByFilter(correlationId, filter, paging, (err, page) => {
                var counter = 0;
                async.whilst(() => {
                    return counter != page.data.length;
                }, (cb) => {
                    var process = page.data[counter];
                    counter++;
                    if (this._recoveryController.isAttemptsExceeded(process)) {
                        this._logger.warn(process.id, "Process " + process + " has reached maximum number of attempts and will be failed");
                        this.failProcess(correlationId, process, "Exceeded number of failed attempts", (err) => {
                            if (err) {
                                this._logger.error(correlationId, err, "Failed to fail recovery process " + process);
                            }
                            recovered++;
                            cb();
                        });
                    }
                    else if (this._recoveryController.isRecoveryDue(process)) {
                        this._logger.info(process.id, "Recovery started for process " + process);
                        this._recoveryController.sendRecovery(process, (err, res) => {
                            if (err) {
                                this._logger.error(correlationId, err, "Failed to fail recovery process " + process);
                                cb();
                                return;
                            }
                            // Clear compensation
                            this.clearProcessRecovery(correlationId, process, (err) => {
                                if (err) {
                                    this._logger.error(correlationId, err, "Failed to fail recovery process " + process);
                                    cb();
                                    return;
                                }
                                recovered++;
                                cb();
                            });
                        });
                    }
                }, (err) => {
                    if (page.data.length < this._batchSize)
                        recover = false;
                    else
                        skip += page.data.length;
                    callback(err);
                });
            });
        }, (err) => {
            if (recovered > 0)
                this._logger.info(correlationId, "Recovered " + recovered + " processes");
            else
                this._logger.info(correlationId, "Found no processes that require recovery");
            this._logger.debug(correlationId, "Finished processes recovery");
            if (callback) {
                callback(err);
            }
        });
    }
    _closeExpiredProcessing(correlationId, callback) {
        this._logger.info(correlationId, "Starting close expired of process states");
        var expirations = 0;
        var skip = 0;
        var now = new Date();
        var recover = true;
        async.whilst(() => {
            return recover;
        }, (callback) => {
            var filter = pip_services3_commons_node_1.FilterParams.fromTuples("states", version1_1.ProcessStatusV1.Starting + "," + version1_1.ProcessStatusV1.Running, "recovered", true);
            var paging = new pip_services3_commons_node_1.PagingParams(skip, this._batchSize, false);
            this._persistence.getPageByFilter(correlationId, filter, paging, (err, page) => {
                var counter = 0;
                async.whilst(() => {
                    return counter != page.data.length;
                }, (cb) => {
                    var process = page.data[counter];
                    counter++;
                    // Double check for expired processes
                    if (process.expiration_time < now) {
                        // Fail expired processes
                        this.failProcess(correlationId, process, "Reached expiration time", (err) => {
                            if (err) {
                                this._logger.error(process.id, err, "Failed to expire process " + process);
                                cb();
                                return;
                            }
                            expirations++;
                            this._logger.warn(process.id, "Close expired process " + process);
                            cb();
                        });
                    }
                }, (err) => {
                    if (page.data.length < this._batchSize)
                        recover = false;
                    else
                        skip += page.data.length;
                    callback(err);
                });
            });
        }, (err) => {
            if (expirations > 0)
                this._logger.info(correlationId, "Close " + expirations + " expired processes");
            else
                this._logger.info(correlationId, "No expired processes were found");
            this._logger.debug(correlationId, "Completed close expired of process states");
            if (callback) {
                callback(err);
            }
        });
    }
}
exports.ProcessStatesController = ProcessStatesController;
//# sourceMappingURL=ProcessStatesController.js.map