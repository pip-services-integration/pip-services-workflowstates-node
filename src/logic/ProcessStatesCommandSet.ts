import { CommandSet, ICommand, Command, ObjectSchema, FilterParamsSchema, TypeCode } from "pip-services3-commons-node";
import { PagingParamsSchema, FilterParams, PagingParams } from "pip-services3-commons-node";
import { IProcessStatesController } from './IProcessStatesController';
import { Parameters } from 'pip-services3-commons-node';
import { MessageV1Schema, MessageV1, ProcessStateV1Schema, ProcessStateV1 } from "../data/version1";


export class ProcessStatesCommandSet extends CommandSet {
    private _controller: IProcessStatesController;

    constructor(controller: IProcessStatesController) {
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

    private makeGetProcessesCommand(): ICommand {
        return new Command(
            'get_processes',
            new ObjectSchema(true)
                .withOptionalProperty('filter', new FilterParamsSchema())
                .withOptionalProperty('paging', new PagingParamsSchema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let filter = FilterParams.fromValue(args.get('filter'));
                let paging = PagingParams.fromValue(args.get('paging'));
                this._controller.getProcesses(correlationId, filter, paging, callback);
            }
        );
    }

    private makeGetProcessesByIdCommand(): ICommand {
        return new Command(
            'get_process_by_id',
            new ObjectSchema(true)
                .withRequiredProperty('process_id', TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let processId = args.getAsString('process_id');
                this._controller.getProcessById(correlationId, processId, callback);
            }
        );
    }

    private makeStartProcessCommand(): ICommand {
        return new Command(
            'start_process',
            new ObjectSchema(true)
                .withOptionalProperty('process_type', TypeCode.String)
                .withOptionalProperty('process_key', TypeCode.String)
                .withOptionalProperty('task_type', TypeCode.String)
                .withOptionalProperty('queue_name', TypeCode.String)
                .withOptionalProperty('message', new MessageV1Schema())
                .withOptionalProperty('ttl', TypeCode.Long),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let processType = args.getAsString('process_type');
                let processKey = args.getAsString('process_key');
                let taskType = args.getAsString('task_type');
                let queueName = args.getAsString('queue_name');
                let message: MessageV1 = args.getAsObject('message');
                let ttl = args.getAsLongWithDefault('ttl', 0);

                this._controller.startProcess(correlationId, processType, processKey, taskType, queueName,
                    message, ttl, callback);
            }
        );
    }

    private makeActivateOrStartProcessCommand(): ICommand {
        return new Command(
            'activate_or_start_process',
            new ObjectSchema(true)
                .withOptionalProperty('process_type', TypeCode.String)
                .withOptionalProperty('process_key', TypeCode.String)
                .withOptionalProperty('task_type', TypeCode.String)
                .withOptionalProperty('queue_name', TypeCode.String)
                .withOptionalProperty('message', new MessageV1Schema())
                .withOptionalProperty('ttl', TypeCode.Long),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let processType = args.getAsString('process_type');
                let processKey = args.getAsString('process_key');
                let taskType = args.getAsString('task_type');
                let queueName = args.getAsString('queue_name');
                let message: MessageV1 = args.getAsObject('message');
                let ttl = args.getAsLongWithDefault('ttl', 0);

                this._controller.activateOrStartProcess(correlationId, processType, processKey, taskType, queueName,
                    message, ttl, callback);
            }
        );
    }

    private makeActivateProcessCommand(): ICommand {
        return new Command(
            'activate_process',
            new ObjectSchema(true)
                .withRequiredProperty('process_id', TypeCode.String)
                .withOptionalProperty('task_type', TypeCode.String)
                .withOptionalProperty('queue_name', TypeCode.String)
                .withOptionalProperty('message', new MessageV1Schema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let processId = args.getAsString('process_id');
                let taskType = args.getAsString('task_type');
                let queueName = args.getAsString('queue_name');
                let message: MessageV1 = args.getAsObject('message');
                this._controller.activateProcess(correlationId, processId, taskType, queueName,
                    message, callback);
            }
        );
    }

    private makeActivateProcessByKeyCommand(): ICommand {
        return new Command(
            'activate_process_by_key',
            new ObjectSchema(true)
                .withOptionalProperty('process_type', TypeCode.String)
                .withOptionalProperty('process_key', TypeCode.String)
                .withOptionalProperty('task_type', TypeCode.String)
                .withOptionalProperty('queue_name', TypeCode.String)
                .withOptionalProperty('message', new MessageV1Schema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let processType = args.getAsString('process_type');
                let processKey = args.getAsString('process_key');
                let taskType = args.getAsString('task_type');
                let queueName = args.getAsString('queue_name');
                let message: MessageV1 = args.getAsObject('message');
                this._controller.activateProcessByKey(correlationId, processType, processKey, taskType, queueName,
                    message, callback);
            }
        );
    }

    private makeRollbackProcessCommand(): ICommand {
        return new Command(
            'rollback_process',
            new ObjectSchema(true)
                .withRequiredProperty('state', new ProcessStateV1Schema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let state: ProcessStateV1 = args.getAsObject('state');
                this._controller.rollbackProcess(correlationId, state, (err) => {
                    callback(err, null);
                });
            }
        );
    }

    private makeContinueProcessCommand(): ICommand {
        return new Command(
            'continue_process',
            new ObjectSchema(true)
                .withRequiredProperty('state', new ProcessStateV1Schema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let state: ProcessStateV1 = args.getAsObject('state');
                this._controller.continueProcess(correlationId, state, (err) => {
                    callback(err, null);
                });
            }
        );
    }

    private makeContinueAndRecoveryProcessCommand(): ICommand {
        return new Command(
            'continue_and_recovery_process',
            new ObjectSchema(true)
                .withRequiredProperty('state', new ProcessStateV1Schema())
                .withOptionalProperty('queue_name', TypeCode.String)
                .withOptionalProperty('message', new MessageV1Schema())
                .withRequiredProperty('timeout', TypeCode.Long),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let state: ProcessStateV1 = args.getAsObject('state');
                let queueName = args.getAsString('queue_name');
                let message: MessageV1 = args.getAsObject('message');
                let timeout = args.getAsLongWithDefault('timeout', 0);
                this._controller.continueAndRecoverProcess(correlationId, state, queueName, message, timeout, (err) => {
                    callback(err, null);
                });
            }
        );
    }

    private makeRepeatProcessRecoveryCommand(): ICommand {
        return new Command(
            'repeat_process_recovery',
            new ObjectSchema(true)
                .withRequiredProperty('state', new ProcessStateV1Schema())
                .withRequiredProperty('timeout', TypeCode.Long),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let state: ProcessStateV1 = args.getAsObject('state');
                let timeout = args.getAsLong('timeout');
                this._controller.repeatProcessRecovery(correlationId, state, timeout, (err) => {
                    callback(err, null);
                });
            }
        );
    }

    private makeClearProcessRecoveryCommand(): ICommand {
        return new Command(
            'clear_process_recovery',
            new ObjectSchema(true)
                .withRequiredProperty('state', new ProcessStateV1Schema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let state: ProcessStateV1 = args.getAsObject('state');
                this._controller.clearProcessRecovery(correlationId, state, (err) => {
                    callback(err, null);
                });
            }
        );
    }

    private makeFailAndContinueProcessCommand(): ICommand {
        return new Command(
            'fail_and_continue_process',
            new ObjectSchema(true)
                .withRequiredProperty('state', new ProcessStateV1Schema())
                .withRequiredProperty('err_msg', TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let state: ProcessStateV1 = args.getAsObject('state');
                let errMsg = args.getAsObject('err_msg');
                this._controller.failAndContinueProcess(correlationId, state, errMsg, (err) => {
                    callback(err, null);
                });
            }
        );
    }

    private makeFailAndRecoverProcessCommand(): ICommand {
        return new Command(
            'fail_and_recover_process',
            new ObjectSchema(true)
                .withRequiredProperty('state', new ProcessStateV1Schema())
                .withRequiredProperty('err_msg', TypeCode.String)
                .withOptionalProperty('queue_name', TypeCode.String)
                .withOptionalProperty('message', new MessageV1Schema())
                .withRequiredProperty('timeout', TypeCode.Long),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let state: ProcessStateV1 = args.getAsObject('state');
                let errMsg = args.getAsObject('err_msg');
                let queueName = args.getAsString('queue_name');
                let message: MessageV1 = args.getAsObject('message');
                let timeout = args.getAsLong('timeout');
                this._controller.failAndRecoverProcess(correlationId, state, errMsg, queueName, message, timeout, (err) => {
                    callback(err, null);
                });
            }
        );
    }

    private makeSuspendProcessCommand(): ICommand {
        return new Command(
            'suspend_process',
            new ObjectSchema(true)
                .withRequiredProperty('state', new ProcessStateV1Schema())
                .withOptionalProperty('request', TypeCode.String)
                .withOptionalProperty('queue_name', TypeCode.String)
                .withOptionalProperty('message', new MessageV1Schema())
                .withRequiredProperty('timeout', TypeCode.Long),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let state: ProcessStateV1 = args.getAsObject('state');
                let request = args.getAsString('request');
                let queueName = args.getAsString('queue_name');
                let message: MessageV1 = args.getAsObject('message');
                let timeout = args.getAsLong('timeout');
                this._controller.suspendProcess(correlationId, state, request, queueName, message, timeout, (err) => {
                    callback(err, null);
                });
            }
        );
    }



    private makeFailProcessCommand(): ICommand {
        return new Command(
            'fail_process',
            new ObjectSchema(true)
                .withRequiredProperty('state', new ProcessStateV1Schema())
                .withRequiredProperty('err_msg', TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let state: ProcessStateV1 = args.getAsObject('state');
                let errMsg = args.getAsString('err_msg');
                this._controller.failProcess(correlationId, state, errMsg, (err) => {
                    callback(err, null);
                });
            }
        );
    }

    private makeResumeProcessCommand(): ICommand {
        return new Command(
            'resume_process',
            new ObjectSchema(true)
                .withRequiredProperty('state', new ProcessStateV1Schema())
                .withRequiredProperty('comment', TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let state: ProcessStateV1 = args.getAsObject('state');
                let comment = args.getAsString('comment');
                this._controller.resumeProcess(correlationId, state, comment, callback);
            }
        );
    }

    private makeCompleteProcessCommand(): ICommand {
        return new Command(
            'complete_process',
            new ObjectSchema(true)
                .withRequiredProperty('state', new ProcessStateV1Schema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let state: ProcessStateV1 = args.getAsObject('state');
                this._controller.completeProcess(correlationId, state, (err) => {
                    callback(err, null);
                });
            }
        );
    }

    private makeAbortProcessCommand(): ICommand {
        return new Command(
            'abort_process',
            new ObjectSchema(true)
                .withRequiredProperty('state', new ProcessStateV1Schema())
                .withRequiredProperty('comment', TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let state: ProcessStateV1 = args.getAsObject('state');
                let comment = args.getAsString('comment');
                this._controller.abortProcess(correlationId, state, comment, (err) => {
                    callback(err, null);
                });
            }
        );
    }

    private makeUpdateProcessCommand(): ICommand {
        return new Command(
            'update_process',
            new ObjectSchema(true)
                .withRequiredProperty('state', new ProcessStateV1Schema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let state: ProcessStateV1 = args.getAsObject('state');
                this._controller.updateProcess(correlationId, state, callback);
            }
        );
    }

    private makeDeleteProcessByIdCommand(): ICommand {
        return new Command(
            'delete_process_by_id',
            new ObjectSchema(true)
                .withRequiredProperty('process_id', TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let processId = args.getAsString('process_id');
                this._controller.deleteProcessById(correlationId, processId, callback);
            }
        );
    }

    private makeRequestProcessForResponceCommand(): ICommand {
        return new Command(
            'request_process_for_response',
            new ObjectSchema(true)
                .withRequiredProperty('state', new ProcessStateV1Schema())
                .withRequiredProperty('request', TypeCode.String)
                .withOptionalProperty('queue_name', TypeCode.String)
                .withOptionalProperty('message', new MessageV1Schema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let state: ProcessStateV1 = args.getAsObject('state');
                let request = args.getAsString('request');
                let queueName = args.getAsString('queue_name');
                let message: MessageV1 = args.getAsObject('message');
                this._controller.requestProcessForResponse(correlationId, state, request, queueName, message, callback);
            }
        );
    }
}