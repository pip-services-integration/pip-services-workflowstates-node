"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const version1_1 = require("../data/version1");
class ProcessStatesCommandSet extends pip_services3_commons_node_1.CommandSet {
    constructor(controller) {
        super();
        this._controller = controller;
        this.addCommand(this.makeGetProcessesCommand());
        this.addCommand(this.makeGetProcessesByIdCommand());
        this.addCommand(this.makeStartProcessCommand());
        this.addCommand(this.makeActivateOrStartProcessCommand());
        this.addCommand(this.makeActivateProcessCommand());
        this.addCommand(this.makeActivateProcessByKeyCommand());
        this.addCommand(this.makeRollbackProcessCommand());
        this.addCommand(this.makeContinueProcessCommand());
        this.addCommand(this.makeContinueAndRecoveryProcessCommand());
        this.addCommand(this.makeRepeatProcessRecoveryCommand());
        this.addCommand(this.makeClearProcessRecoveryCommand());
        this.addCommand(this.makeFailAndContinueProcessCommand());
        this.addCommand(this.makeFailAndRecoverProcessCommand());
        this.addCommand(this.makeSuspendProcessCommand());
        this.addCommand(this.makeFailProcessCommand());
        this.addCommand(this.makeResumeProcessCommand());
        this.addCommand(this.makeCompleteProcessCommand());
        this.addCommand(this.makeAbortProcessCommand());
        this.addCommand(this.makeUpdateProcessCommand());
        this.addCommand(this.makeDeleteProcessByIdCommand());
        this.addCommand(this.makeRequestProcessForResponceCommand());
    }
    makeGetProcessesCommand() {
        return new pip_services3_commons_node_1.Command('get_processes', new pip_services3_commons_node_1.ObjectSchema(true)
            .withOptionalProperty('filter', new pip_services3_commons_node_1.FilterParamsSchema())
            .withOptionalProperty('paging', new pip_services3_commons_node_2.PagingParamsSchema()), (correlationId, args, callback) => {
            let filter = pip_services3_commons_node_2.FilterParams.fromValue(args.get('filter'));
            let paging = pip_services3_commons_node_2.PagingParams.fromValue(args.get('paging'));
            this._controller.getProcesses(correlationId, filter, paging, callback);
        });
    }
    makeGetProcessesByIdCommand() {
        return new pip_services3_commons_node_1.Command('get_process_by_id', new pip_services3_commons_node_1.ObjectSchema(true)
            .withRequiredProperty('process_id', pip_services3_commons_node_1.TypeCode.String), (correlationId, args, callback) => {
            let processId = args.getAsString('process_id');
            this._controller.getProcessById(correlationId, processId, callback);
        });
    }
    makeStartProcessCommand() {
        return new pip_services3_commons_node_1.Command('start_process', new pip_services3_commons_node_1.ObjectSchema(true)
            .withRequiredProperty('process_type', pip_services3_commons_node_1.TypeCode.String)
            .withRequiredProperty('process_key', pip_services3_commons_node_1.TypeCode.String)
            .withRequiredProperty('task_type', pip_services3_commons_node_1.TypeCode.String)
            .withRequiredProperty('queue_name', pip_services3_commons_node_1.TypeCode.String)
            .withRequiredProperty('message', new version1_1.MessageV1Schema())
            .withRequiredProperty('ttl', pip_services3_commons_node_1.TypeCode.Long), (correlationId, args, callback) => {
            let processType = args.getAsString('process_type');
            let processKey = args.getAsString('process_key');
            let taskType = args.getAsString('task_type');
            let queueName = args.getAsString('queue_name');
            let message = args.getAsObject('message');
            let ttl = args.getAsLong('ttl');
            this._controller.startProcess(correlationId, processType, processKey, taskType, queueName, message, ttl, callback);
        });
    }
    makeActivateOrStartProcessCommand() {
        return new pip_services3_commons_node_1.Command('activate_or_start_process', new pip_services3_commons_node_1.ObjectSchema(true)
            .withRequiredProperty('process_type', pip_services3_commons_node_1.TypeCode.String)
            .withRequiredProperty('process_key', pip_services3_commons_node_1.TypeCode.String)
            .withRequiredProperty('task_type', pip_services3_commons_node_1.TypeCode.String)
            .withRequiredProperty('queue_name', pip_services3_commons_node_1.TypeCode.String)
            .withRequiredProperty('message', new version1_1.MessageV1Schema())
            .withRequiredProperty('ttl', pip_services3_commons_node_1.TypeCode.Long), (correlationId, args, callback) => {
            let processType = args.getAsString('process_type');
            let processKey = args.getAsString('process_key');
            let taskType = args.getAsString('task_type');
            let queueName = args.getAsString('queue_name');
            let message = args.getAsObject('message');
            let ttl = args.getAsLong('ttl');
            this._controller.activateOrStartProcess(correlationId, processType, processKey, taskType, queueName, message, ttl, callback);
        });
    }
    makeActivateProcessCommand() {
        return new pip_services3_commons_node_1.Command('activate_process', new pip_services3_commons_node_1.ObjectSchema(true)
            .withRequiredProperty('process_id', pip_services3_commons_node_1.TypeCode.String)
            .withRequiredProperty('task_type', pip_services3_commons_node_1.TypeCode.String)
            .withRequiredProperty('queue_name', pip_services3_commons_node_1.TypeCode.String)
            .withRequiredProperty('message', new version1_1.MessageV1Schema()), (correlationId, args, callback) => {
            let processId = args.getAsString('process_id');
            let taskType = args.getAsString('task_type');
            let queueName = args.getAsString('queue_name');
            let message = args.getAsObject('message');
            this._controller.activateProcess(correlationId, processId, taskType, queueName, message, callback);
        });
    }
    makeActivateProcessByKeyCommand() {
        return new pip_services3_commons_node_1.Command('activate_process_by_key', new pip_services3_commons_node_1.ObjectSchema(true)
            .withRequiredProperty('process_type', pip_services3_commons_node_1.TypeCode.String)
            .withRequiredProperty('process_key', pip_services3_commons_node_1.TypeCode.String)
            .withRequiredProperty('task_type', pip_services3_commons_node_1.TypeCode.String)
            .withRequiredProperty('queue_name', pip_services3_commons_node_1.TypeCode.String)
            .withRequiredProperty('message', new version1_1.MessageV1Schema()), (correlationId, args, callback) => {
            let processType = args.getAsString('process_type');
            let processKey = args.getAsString('process_key');
            let taskType = args.getAsString('task_type');
            let queueName = args.getAsString('queue_name');
            let message = args.getAsObject('message');
            this._controller.activateProcessByKey(correlationId, processType, processKey, taskType, queueName, message, callback);
        });
    }
    makeRollbackProcessCommand() {
        return new pip_services3_commons_node_1.Command('rollback_process', new pip_services3_commons_node_1.ObjectSchema(true)
            .withRequiredProperty('state', new version1_1.ProcessStateV1Schema()), (correlationId, args, callback) => {
            let state = args.getAsObject('state');
            this._controller.rollbackProcess(correlationId, state, (err) => {
                callback(err, null);
            });
        });
    }
    makeContinueProcessCommand() {
        return new pip_services3_commons_node_1.Command('continue_process', new pip_services3_commons_node_1.ObjectSchema(true)
            .withRequiredProperty('state', new version1_1.ProcessStateV1Schema()), (correlationId, args, callback) => {
            let state = args.getAsObject('state');
            this._controller.continueProcess(correlationId, state, (err) => {
                callback(err, null);
            });
        });
    }
    makeContinueAndRecoveryProcessCommand() {
        return new pip_services3_commons_node_1.Command('continue_and_recovery_process', new pip_services3_commons_node_1.ObjectSchema(true)
            .withRequiredProperty('state', new version1_1.ProcessStateV1Schema())
            .withRequiredProperty('queue_name', pip_services3_commons_node_1.TypeCode.String)
            .withRequiredProperty('message', new version1_1.MessageV1Schema())
            .withRequiredProperty('ttl', pip_services3_commons_node_1.TypeCode.Long), (correlationId, args, callback) => {
            let state = args.getAsObject('state');
            let queueName = args.getAsString('queue_name');
            let message = args.getAsObject('message');
            let ttl = args.getAsLong('ttl');
            this._controller.continueAndRecoverProcess(correlationId, state, queueName, message, ttl, (err) => {
                callback(err, null);
            });
        });
    }
    makeRepeatProcessRecoveryCommand() {
        return new pip_services3_commons_node_1.Command('repeat_process_recovery', new pip_services3_commons_node_1.ObjectSchema(true)
            .withRequiredProperty('state', new version1_1.ProcessStateV1Schema())
            .withRequiredProperty('timeout', pip_services3_commons_node_1.TypeCode.Long), (correlationId, args, callback) => {
            let state = args.getAsObject('state');
            let timeout = args.getAsLong('timeout');
            this._controller.repeatProcessRecovery(correlationId, state, timeout, (err) => {
                callback(err, null);
            });
        });
    }
    makeClearProcessRecoveryCommand() {
        return new pip_services3_commons_node_1.Command('clear_process_recovery', new pip_services3_commons_node_1.ObjectSchema(true)
            .withRequiredProperty('state', new version1_1.ProcessStateV1Schema()), (correlationId, args, callback) => {
            let state = args.getAsObject('state');
            this._controller.clearProcessRecovery(correlationId, state, (err) => {
                callback(err, null);
            });
        });
    }
    makeFailAndContinueProcessCommand() {
        return new pip_services3_commons_node_1.Command('fail_and_continue_process', new pip_services3_commons_node_1.ObjectSchema(true)
            .withRequiredProperty('state', new version1_1.ProcessStateV1Schema())
            .withRequiredProperty('err_msg', pip_services3_commons_node_1.TypeCode.String), (correlationId, args, callback) => {
            let state = args.getAsObject('state');
            let errMsg = args.getAsObject('err_msg');
            this._controller.failAndContinueProcess(correlationId, state, errMsg, (err) => {
                callback(err, null);
            });
        });
    }
    makeFailAndRecoverProcessCommand() {
        return new pip_services3_commons_node_1.Command('fail_and_recover_process', new pip_services3_commons_node_1.ObjectSchema(true)
            .withRequiredProperty('state', new version1_1.ProcessStateV1Schema())
            .withRequiredProperty('err_msg', pip_services3_commons_node_1.TypeCode.String)
            .withRequiredProperty('queue_name', pip_services3_commons_node_1.TypeCode.String)
            .withRequiredProperty('message', new version1_1.MessageV1Schema())
            .withRequiredProperty('timeout', pip_services3_commons_node_1.TypeCode.Long), (correlationId, args, callback) => {
            let state = args.getAsObject('state');
            let errMsg = args.getAsObject('err_msg');
            let queueName = args.getAsString('queue_name');
            let message = args.getAsObject('message');
            let timeout = args.getAsLong('timeout');
            this._controller.failAndRecoverProcess(correlationId, state, errMsg, queueName, message, timeout, (err) => {
                callback(err, null);
            });
        });
    }
    makeSuspendProcessCommand() {
        return new pip_services3_commons_node_1.Command('suspend_process', new pip_services3_commons_node_1.ObjectSchema(true)
            .withRequiredProperty('state', new version1_1.ProcessStateV1Schema())
            .withRequiredProperty('request', pip_services3_commons_node_1.TypeCode.String)
            .withRequiredProperty('queue_name', pip_services3_commons_node_1.TypeCode.String)
            .withRequiredProperty('message', new version1_1.MessageV1Schema())
            .withRequiredProperty('timeout', pip_services3_commons_node_1.TypeCode.Long), (correlationId, args, callback) => {
            let state = args.getAsObject('state');
            let request = args.getAsString('request');
            let queueName = args.getAsString('queue_name');
            let message = args.getAsObject('message');
            let timeout = args.getAsLong('timeout');
            this._controller.suspendProcess(correlationId, state, request, queueName, message, timeout, (err) => {
                callback(err, null);
            });
        });
    }
    makeFailProcessCommand() {
        return new pip_services3_commons_node_1.Command('fail_process', new pip_services3_commons_node_1.ObjectSchema(true)
            .withRequiredProperty('state', new version1_1.ProcessStateV1Schema())
            .withRequiredProperty('err_msg', pip_services3_commons_node_1.TypeCode.String), (correlationId, args, callback) => {
            let state = args.getAsObject('state');
            let errMsg = args.getAsString('err_msg');
            this._controller.failProcess(correlationId, state, errMsg, (err) => {
                callback(err, null);
            });
        });
    }
    makeResumeProcessCommand() {
        return new pip_services3_commons_node_1.Command('resume_process', new pip_services3_commons_node_1.ObjectSchema(true)
            .withRequiredProperty('state', new version1_1.ProcessStateV1Schema())
            .withRequiredProperty('comment', pip_services3_commons_node_1.TypeCode.String), (correlationId, args, callback) => {
            let state = args.getAsObject('state');
            let comment = args.getAsString('comment');
            this._controller.resumeProcess(correlationId, state, comment, callback);
        });
    }
    makeCompleteProcessCommand() {
        return new pip_services3_commons_node_1.Command('complete_process', new pip_services3_commons_node_1.ObjectSchema(true)
            .withRequiredProperty('state', new version1_1.ProcessStateV1Schema()), (correlationId, args, callback) => {
            let state = args.getAsObject('state');
            this._controller.completeProcess(correlationId, state, (err) => {
                callback(err, null);
            });
        });
    }
    makeAbortProcessCommand() {
        return new pip_services3_commons_node_1.Command('abort_process', new pip_services3_commons_node_1.ObjectSchema(true)
            .withRequiredProperty('state', new version1_1.ProcessStateV1Schema())
            .withRequiredProperty('comment', pip_services3_commons_node_1.TypeCode.String), (correlationId, args, callback) => {
            let state = args.getAsObject('state');
            let comment = args.getAsString('comment');
            this._controller.abortProcess(correlationId, state, comment, (err) => {
                callback(err, null);
            });
        });
    }
    makeUpdateProcessCommand() {
        return new pip_services3_commons_node_1.Command('update_process', new pip_services3_commons_node_1.ObjectSchema(true)
            .withRequiredProperty('state', new version1_1.ProcessStateV1Schema()), (correlationId, args, callback) => {
            let state = args.getAsObject('state');
            this._controller.updateProcess(correlationId, state, (err) => {
                callback(err, null);
            });
        });
    }
    makeDeleteProcessByIdCommand() {
        return new pip_services3_commons_node_1.Command('delete_process_by_id', new pip_services3_commons_node_1.ObjectSchema(true)
            .withRequiredProperty('process_id', pip_services3_commons_node_1.TypeCode.String), (correlationId, args, callback) => {
            let processId = args.getAsString('process_id');
            this._controller.deleteProcessById(correlationId, processId, callback);
        });
    }
    makeRequestProcessForResponceCommand() {
        return new pip_services3_commons_node_1.Command('request_process_for_responce', new pip_services3_commons_node_1.ObjectSchema(true)
            .withRequiredProperty('state', new version1_1.ProcessStateV1Schema())
            .withRequiredProperty('request', pip_services3_commons_node_1.TypeCode.String)
            .withRequiredProperty('queue_name', pip_services3_commons_node_1.TypeCode.String)
            .withRequiredProperty('message', new version1_1.MessageV1Schema()), (correlationId, args, callback) => {
            let state = args.getAsObject('state');
            let request = args.getAsString('request');
            let queueName = args.getAsString('queue_name');
            let message = args.getAsObject('message');
            this._controller.requestProcessForResponse(correlationId, state, request, queueName, message, (err) => {
                callback(err, null);
            });
        });
    }
}
exports.ProcessStatesCommandSet = ProcessStatesCommandSet;
//# sourceMappingURL=ProcessStatesCommandSet.js.map