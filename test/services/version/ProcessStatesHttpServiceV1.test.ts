let _ = require('lodash');
let async = require('async');
let restify = require('restify');
let assert = require('chai').assert;

import { ConfigParams, FilterParams, PagingParams } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';

import { ProcessStateV1 } from '../../../src/data/version1/ProcessStateV1';
import { ProcessStatesMemoryPersistence } from '../../../src/persistence/ProcessStatesMemoryPersistence';
import { ProcessStatesController } from '../../../src/logic/ProcessStatesController';
import { ProcessStatesHttpServiceV1 } from '../../../src/services/version1/ProcessStatesHttpServiceV1';
import { MessageV1, ProcessStatusV1, TaskStateV1 } from '../../../src/data/version1';

let httpConfig = ConfigParams.fromTuples(
    "connection.protocol", "http",
    "connection.host", "localhost",
    "connection.port", 3000
);


const PROCESS1: ProcessStateV1 = <ProcessStateV1>{
    id: "id1",
    lock_token: "proc.token",
    key: "proc.key",
    type: "proc.type.c",
    locked_until_time: new Date(),
    last_action_time: new Date(),
    status: ProcessStatusV1.Starting,
    request_id: "req.id1"
}

const PROCESS2: ProcessStateV1 = <ProcessStateV1>{
    id: "id2",
    lock_token: "proc.token2",
    key: "proc.key",
    type: "proc.type",
    locked_until_time: new Date(),
    last_action_time: new Date(),
    recovery_time:new Date(Date.now() - 3600),
    status: ProcessStatusV1.Running,
    request_id: "req.id2"
}

const PROCESS3: ProcessStateV1 = <ProcessStateV1>{
    id: "id2",
    lock_token: "proc.token",
    key: "proc.key1",
    type: "proc.type",
    locked_until_time: new Date(),
    last_action_time: new Date(),
    status: ProcessStatusV1.Suspended,
    request_id: "req.id3"
}

suite('ProcessStatesHttpServiceV1', () => {
    let service: ProcessStatesHttpServiceV1;
    let rest: any;
    let _message: MessageV1 = new MessageV1();
    let persistence: ProcessStatesMemoryPersistence;

    suiteSetup((done) => {
        persistence = new ProcessStatesMemoryPersistence();
        let controller = new ProcessStatesController();

        service = new ProcessStatesHttpServiceV1();
        service.configure(httpConfig);

        let references: References = References.fromTuples(
            new Descriptor('pip-services-processstates', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('pip-services-processstates', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('pip-services-processstates', 'service', 'http', 'default', '1.0'), service
        );
        controller.setReferences(references);
        service.setReferences(references);
        service.open(null, done);
    });

    suiteTeardown((done) => {
        service.close(null, done);
    });

    setup((done) => {
        let url = 'http://localhost:3000';
        rest = restify.createJsonClient({ url: url, version: '*' });
        persistence.clear("123", done);
    });

    test('Rollback Process', (done) => {
        // arrange
        let process: ProcessStateV1 = new ProcessStateV1();
        process.id = "id";
        process.lock_token = "token";
        process.type = "type";
        process.locked_until_time = new Date();
        process.status = ProcessStatusV1.Running;

        async.series([
            (callback) => {
                persistence.create(null, process, (err, item) => {
                    assert.isNull(err);
                    process = item;
                    callback();
                })
            },
            (callback) => {
                rest.post('/v1/process_states/rollback_process',
                    {
                        state: process
                    },
                    (err, req, res, result) => {
                        assert.isNull(err);
                        callback();
                    });
            },
            (callback) => {
                persistence.getOneById(null, process.id, (err, processResult) => {
                    assert.isNull(err);
                    assert.equal(process.id, processResult.id);
                    assert.equal(ProcessStatusV1.Running, processResult.status);
                    assert.isNull(process.lock_token);
                    callback();
                });
            }
        ], (err) => {
            done(err);
        });
    });

    test('Return Error If Rollback Process Dont Have Id', (done) => {
        let process: ProcessStateV1 = new ProcessStateV1();
        rest.post('/v1/process_states/rollback_process',
            {
                state: process
            },
            (err, req, res, result) => {
                assert.isNotNull(err);
                done();
            });
    });



    test('Test Get Processes With Filters', (done) => {

        let process1, process2: ProcessStateV1;

        async.series([
            // Create process one
            (callback) => {
                persistence.create(null, PROCESS1, (err, item) => {
                    assert.isNull(err);
                    callback();
                })
            },
            // Create process two
            (callback) => {
                persistence.create(null, PROCESS2, (err, item) => {
                    assert.isNull(err);
                    callback();
                })
            },
            // Create process three
            (callback) => {
                persistence.create(null, PROCESS3, (err, item) => {
                    assert.isNull(err);
                    callback();
                })
            },
            // Get all processes
            (callback) => {
                rest.post('/v1/process_states/get_processes',
                    {
                        filter: new FilterParams(),
                        paging: new PagingParams()
                    },
                    (err, req, res, page) => {
                        assert.isNull(err);
                        assert.isNotNull(page);
                        assert.isObject(page);
                        assert.equal(page.data.length, 3);
                        callback();
                    });
            },
            // Get processes by type
            (callback) => {
                rest.post('/v1/process_states/get_processes',
                    {
                        filter: FilterParams.fromTuples("type", "proc.type"),
                        paging: new PagingParams()
                    },
                    (err, req, res, page) => {
                        assert.isNull(err);
                        assert.isNotNull(page);
                        assert.isObject(page);
                        assert.equal(page.data.length, 2);
                        callback();
                    });
            },
            // Get processes by status
            (callback) => {
                rest.post('/v1/process_states/get_processes',
                    {
                        filter: FilterParams.fromTuples("status", ProcessStatusV1.Running),
                        paging: new PagingParams()
                    },
                    (err, req, res, page) => {
                        assert.isNull(err);
                        assert.isNotNull(page);
                        assert.isObject(page);
                        assert.equal(page.data.length, 1);
                        callback();
                    });
            },
            // Get recovered processes
            (callback) => {
                rest.post('/v1/process_states/get_processes',
                    {
                        filter: FilterParams.fromTuples("recovered", true),
                        paging: new PagingParams()
                    },
                    (err, req, res, page) => {
                        assert.isNull(err);
                        assert.isNotNull(page);
                        assert.isObject(page);
                        assert.equal(page.data.length, 1);
                        callback();
                    });
            }],
            (err) => {
                done();
            });
    });

    test('Return Error If Activate Or Start Process Without Type', (done) => {
        rest.post('/v1/process_states/activate_or_start_process',
            {
                process_type: null,
                process_key: null,
                task_type: null,
                queue_name: null,
                message: null,
                ttl: 0
            },
            (err, req, res, result) => {
                assert.isNotNull(err);
                done();
            });
    });

    test('Return Error If Activate Process Without Type', (done) => {
        rest.post('/v1/process_states/activate_process',
            {
                process_id: null,
                task_type: null,
                queue_name: null,
                message: null
            },
            (err, req, res, result) => {
                assert.isNotNull(err);
                done();
            });
    });

    test('Return Error If Activate By Key Process Without Type', (done) => {
        rest.post('/v1/process_states/activate_process_by_key',
            {
                process_type: null,
                process_key: null,
                task_type: null,
                queue_name: null,
                message: null
            },
            (err, req, res, result) => {
                assert.isNotNull(err);
                done();
            });
    });

    test('Return Error If Request For Response Without Process Id', (done) => {
        rest.post('/v1/process_states/request_process_for_responce',
            {
                process_type: null,
                process_key: null,
                task_type: null,
                queue_name: null,
                message: null
            },
            (err, req, res, result) => {
                assert.isNotNull(err);
                done();
            });
    });

    test('Return Error If Complete Process Without Process Id', (done) => {

        rest.post('/v1/process_states/complete_process',
            {
                state: null
            },
            (err, req, res, result) => {
                assert.isNotNull(err);
                done();
            });
    });

    test('Return Error If Abort Process Without Process Id', (done) => {
        rest.post('/v1/process_states/abort_process',
            {
                state: null,
                comment: null
            },
            (err, req, res, result) => {
                assert.isNotNull(err);
                done();
            });
    });

    test('Return Error If Fail Process Without Process Id', (done) => {
        rest.post('/v1/process_states/fail_process',
            {
                state: null,
                err_msg: null
            },
            (err, req, res, result) => {
                assert.isNotNull(err);
                done();
            });
    });

    test('Return Error If Get By Id Process Without Process Id', (done) => {
        rest.post('/v1/process_states/get_process_by_id',
            {
                process_id: null
            },
            (err, req, res, result) => {
                assert.isNotNull(err);
                done();
            });
    });

    test('Return Error If Start Async Process Without Process Id', (done) => {

        rest.post('/v1/process_states/start_process',
            {
                process_type: null,
                process_key: null,
                task_type: null,
                queue_name: null,
                message: null,
                ttl: null
            },
            (err, req, res, result) => {
                assert.isNotNull(err);
                done();
            });
    });

    test('Return Error If Reactive Process Without Process Id', (done) => {

        rest.post('/v1/process_states/resume_process',
            {
                state: null,
                comment: null
            },
            (err, req, res, result) => {
                assert.isNotNull(err);
                done();
            });
    });

    test('Return Error If Continue Process With Null State State', (done) => {

        rest.post('/v1/process_states/continue_process',
            {
                state: null
            },
            (err, req, res, result) => {
                assert.isNotNull(err);
                done();
            });
    });

    test('Return Error If Clear Recovery Process With Null Process State', (done) => {

        rest.post('/v1/process_states/clear_process_recovery',
            {
                state: null
            },
            (err, req, res, result) => {
                assert.isNotNull(err);
                done();
            });
    });

    test('Return Error If Repeat Recovery Process With Null Process State', (done) => {
        rest.post('/v1/process_states/repeat_process_recovery',
            {
                state: null,
                timeout: 0
            },
            (err, req, res, result) => {
                assert.isNotNull(err);
                done();
            });
    });

    test('Return Error If Fail And Continue Process With Null Process State', (done) => {
        rest.post('/v1/process_states/fail_and_continue_process',
            {
                state: null,
                err_msg: null
            },
            (err, req, res, result) => {
                assert.isNotNull(err);
                done();
            });
    });

    test('Return Error If Fail And Recover Process With Null Process State', (done) => {

        rest.post('/v1/process_states/fail_and_recover_process',
            {
                state: null,
                err_msg: null,
                queue_name: null,
                message: null,
                timeout: null
            },
            (err, req, res, result) => {
                assert.isNotNull(err);
                done();
            });
    });


    // It_Should_Return_Error_If_Continue_With_Recovery_Process_With_Null_Flow()
    test('Return Error If Continue With Recovery Process With Null Process States', (done) => {
        rest.post('/v1/process_states/continue_and_recovery_process',
            {
                state: null,
                queue_name: null,
                message: null,
                ttl: null
            },
            (err, req, res, result) => {
                assert.isNotNull(err);
                done();
            });
    });



    // It_Should_Continue_Process()
    test('Continue Process', (done) => {
        let process: ProcessStateV1 = new ProcessStateV1();
        process.id = "id";
        process.lock_token = "token";
        process.locked_until_time = new Date();
        process.status = ProcessStatusV1.Starting;
        process.type = "area.type";

        async.series([
            (callback) => {
                persistence.create(null, process, (err, item) => {
                    assert.isNull(err);
                    process = item;
                    callback();
                })
            },
            (callback) => {
                rest.post('/v1/process_states/continue_process',
                    {
                        state: process
                    },
                    (err, req, res, result) => {
                        assert.isNull(err);
                        callback();
                    });
            },
            (callback) => {
                persistence.getOneById(null, process.id, (err, processResult) => {
                    assert.isNull(err);
                    assert.equal(process.id, processResult.id);
                    assert.equal(ProcessStatusV1.Running, processResult.status);
                    callback();
                });
            }
        ], (err) => {
            done(err);
        });
    });

    test('Fail Process', (done) => {
        let process: ProcessStateV1 = new ProcessStateV1();
        process.id = "id";
        process.lock_token = "token";
        process.type = "type";
        process.locked_until_time = new Date();
        process.status = ProcessStatusV1.Running;
        let comment: string = "comment";
        async.series([
            (callback) => {
                persistence.create(null, process, (err, item) => {
                    assert.isNull(err);
                    process = item;
                    callback();
                })
            },
            (callback) => {
                rest.post('/v1/process_states/fail_process',
                    {
                        state: process,
                        err_msg: comment
                    },
                    (err, req, res, result) => {
                        assert.isNull(err);
                        callback();
                    });
            },
            (callback) => {
                persistence.getOneById(null, process.id, (err, processResult) => {
                    assert.isNull(err);
                    assert.equal(process.id, processResult.id);
                    assert.equal(ProcessStatusV1.Failed, processResult.status);
                    callback();
                });
            }
        ], (err) => {
            done(err);
        });

    });


    test('Fail With Recovery Proces', (done) => {
        let process: ProcessStateV1 = new ProcessStateV1();
        process.id = "id";
        process.lock_token = "token";
        process.type = "type";
        process.locked_until_time = new Date();
        process.status = ProcessStatusV1.Running;

        let error = "error Message";
        let messageEnvelop: MessageV1 = new MessageV1();
        messageEnvelop.correlation_id = "corrlation id";
        messageEnvelop.message_type = "message type"
        messageEnvelop.message = "";

        async.series([
            (callback) => {
                persistence.create(null, process, (err, item) => {
                    assert.isNull(err);
                    process = item;
                    callback();
                })
            },
            (callback) => {
                rest.post('/v1/process_states/fail_and_recover_process',
                    {
                        state: process,
                        err_msg: error,
                        queue_name: "queue name",
                        message: messageEnvelop,
                        timeout: 0
                    },
                    (err, req, res, result) => {
                        assert.isNull(err);
                        callback();
                    });
            },
            (callback) => {
                persistence.getOneById(null, process.id, (err, processResult) => {
                    assert.isNull(err);
                    assert.equal(process.id, processResult.id);
                    assert.equal(messageEnvelop.correlation_id, processResult.recovery_message.correlation_id);
                    assert.equal("queue name", processResult.recovery_queue_name);
                    callback();
                });
            }
        ], (err) => {
            done(err);
        });

    });

    test('Continue For Fail Process', (done) => {
        let process: ProcessStateV1 = new ProcessStateV1();
        process.id = "id";
        process.lock_token = "token";
        process.type = "type";
        process.locked_until_time = new Date();
        process.status = ProcessStatusV1.Running;

        let error = "error Message";
        let messageEnvelop: MessageV1 = new MessageV1();
        messageEnvelop.correlation_id = "corrlation id";
        messageEnvelop.message_type = "message type"
        messageEnvelop.message = "";

        async.series([
            (callback) => {
                persistence.create(null, process, (err, item) => {
                    assert.isNull(err);
                    process = item;
                    callback();
                })
            },
            (callback) => {
                process.recovery_message = messageEnvelop;
                rest.post('/v1/process_states/fail_and_continue_process',
                    {
                        state: process,
                        err_msg: error
                    },
                    (err, req, res, result) => {
                        assert.isNull(err);
                        callback();
                    });
            },
            (callback) => {
                persistence.getOneById(null, process.id, (err, processResult) => {
                    assert.isNull(err);
                    assert.equal(ProcessStatusV1.Running, processResult.status);
                    assert.isNull(processResult.recovery_message);
                    assert.isNull(processResult.recovery_queue_name);
                    callback();
                });
            }
        ], (err) => {
            done(err);
        });
    });


    // It_Should_Repeat_Recovery_Process()
    test('Repeat Recovery Process', (done) => {
        let process: ProcessStateV1 = new ProcessStateV1();
        process.id = "id";
        process.type = "type";
        process.lock_token = "token";
        process.locked_until_time = new Date();
        process.status = ProcessStatusV1.Running;

        async.series([
            (callback) => {
                persistence.create(null, process, (err, item) => {
                    assert.isNull(err);
                    process = item;
                    callback();
                })
            },
            (callback) => {

                rest.post('/v1/process_states/repeat_process_recovery',
                    {
                        state: process,
                        timeout: 0
                    },
                    (err, req, res, result) => {
                        assert.isNull(err);
                        callback();
                    });
            },
            (callback) => {
                persistence.getOneById(null, process.id, (err, processResult) => {
                    assert.isNull(err);
                    assert.equal(1, processResult.recovery_attempts);
                    callback();
                })
            }], (err) => {
                done(err);
            });
    });

    test('Resume Process', (done) => {
        let process: ProcessStateV1 = new ProcessStateV1();
        process.id = "id";
        process.type = "type";
        process.lock_token = "token";
        process.locked_until_time = new Date();
        process.status = ProcessStatusV1.Suspended;
        process.tasks = new Array<TaskStateV1>();

        let comment = "comment";

        async.series([
            (callback) => {
                persistence.create(null, process, (err, item) => {
                    assert.isNull(err);
                    process = item;
                    callback();
                })
            },
            (callback) => {

                rest.post('/v1/process_states/resume_process',
                    {
                        state: process,
                        comment: comment
                    },
                    (err, req, res, processResult) => {
                        assert.isNull(err);
                        assert.equal(ProcessStatusV1.Starting, processResult.status);
                        assert.equal("comment", processResult.comment);
                        callback();
                    });
            }], (err) => {
                done(err);
            });
    });

    test('Request For Response Process', (done) => {
        let process: ProcessStateV1 = new ProcessStateV1();
        process.id = "id";
        process.lock_token = "token";
        process.type = "type";
        process.locked_until_time = new Date();
        process.status = ProcessStatusV1.Starting;

        async.series([
            (callback) => {
                persistence.create(null, process, (err, item) => {
                    assert.isNull(err);
                    process = item;
                    callback();
                })
            },
            (callback) => {
                rest.post('/v1/process_states/request_process_for_responce',
                    {
                        state: process,
                        request: "request",
                        queue_name: "queue",
                        message: new MessageV1()
                    },
                    (err, req, res, result) => {
                        assert.isNull(err);
                        callback();
                    });
            },
            (callback) => {
                persistence.getOneById(null, process.id, (err, processResult) => {
                    assert.isNull(err);
                    assert.equal(process.id, processResult.id);
                    assert.equal("queue", processResult.recovery_queue_name);
                    assert.equal("request", processResult.request);
                    assert.equal(ProcessStatusV1.Suspended, processResult.status);
                    callback();
                })
            }
        ], (err) => {
            done(err);
        });
    });

    test('Complete Proces', (done) => {
        let process: ProcessStateV1 = new ProcessStateV1();
        process.id = "id";
        process.lock_token = "token";
        process.type = "type";
        process.locked_until_time = new Date();
        process.status = ProcessStatusV1.Starting;

        async.series([
            (callback) => {
                persistence.create(null, process, (err, item) => {
                    assert.isNull(err);
                    process = item;
                    callback();
                })
            },
            (callback) => {
                rest.post('/v1/process_states/complete_process',
                    {
                        state: process
                    },
                    (err, req, res, result) => {
                        assert.isNull(err);
                        callback();
                    });
            },
            (callback) => {
                persistence.getOneById(null, process.id, (err, processResult) => {
                    assert.isNull(err);
                    assert.equal(process.id, processResult.id);
                    assert.equal(ProcessStatusV1.Completed, processResult.status);
                    callback();
                })
            }
        ], (err) => {
            done(err);
        });
    });

    test('Abort Process', (done) => {
        let process: ProcessStateV1 = new ProcessStateV1();
        process.id = "id";
        process.lock_token = "token";
        process.type = "type";
        process.locked_until_time = new Date();
        process.status = ProcessStatusV1.Running;

        let comment = "comment";
        async.series([
            (callback) => {
                persistence.create(null, process, (err, item) => {
                    assert.isNull(err);
                    process = item;
                    callback();
                })
            },
            (callback) => {
                rest.post('/v1/process_states/abort_process',
                    {
                        state: process,
                        comment: comment
                    },
                    (err, req, res, result) => {
                        assert.isNull(err);
                        callback();
                    });
            },
            (callback) => {
                persistence.getOneById(null, process.id, (err, processResult) => {
                    assert.equal(process.id, processResult.id);
                    assert.equal(ProcessStatusV1.Aborted, processResult.status);
                    assert.equal(comment, processResult.comment);
                    callback();
                });
            }
        ], (err) => {
            done(err);
        });
    });

    test('Delete Process', (done) => {
        let process: ProcessStateV1 = new ProcessStateV1();
        process.id = "id";
        process.lock_token = "token";
        process.type = "type";
        process.locked_until_time = new Date();
        process.status = ProcessStatusV1.Running;
        process.recovery_message = new MessageV1();
        process.recovery_time = new Date();
        process.recovery_queue_name = "queue";

        async.series([
            (callback) => {
                persistence.create(null, process, (err, item) => {
                    assert.isNull(err);
                    callback();
                })
            },
            (callback) => {
                rest.post('/v1/process_states/delete_process_by_id',
                    {
                        process_id: process.id
                    },
                    (err, req, res, result) => {
                        assert.isNull(err);
                        callback();
                    });
            },
            (callback) => {
                persistence.getOneById(null, process.id, (err, processResult) => {
                    assert.isNull(err);
                    assert.isNull(processResult);
                    callback();
                })
            }], (err) => {
                done(err);
            });
    });

    test('Continue With Recovery Process', (done) => {
        let process: ProcessStateV1 = new ProcessStateV1();
        process.id = "id";
        process.lock_token = "token";
        process.type = "type";
        process.locked_until_time = new Date();
        process.status = ProcessStatusV1.Running;
        let messageEnvelop: MessageV1 = new MessageV1();
        messageEnvelop.correlation_id = "correlation id";
        messageEnvelop.message_type = "message type"
        messageEnvelop.message = "";

        async.series([
            (callback) => {
                persistence.create(null, process, (err, item) => {
                    assert.isNull(err);
                    process = item;
                    callback();
                })
            },
            (callback) => {
                rest.post('/v1/process_states/continue_and_recovery_process',
                    {
                        state: process,
                        queue_name: "queue name",
                        message: messageEnvelop,
                        ttl: 0
                    },
                    (err, req, res, result) => {
                        assert.isNull(err);
                        callback();
                    });
            },
            (callback) => {
                persistence.getOneById(null, process.id, (err, processResult) => {
                    assert.isNull(err);
                    assert.equal(ProcessStatusV1.Running, processResult.status);
                    assert.equal(process.id, processResult.id);
                    assert.equal(messageEnvelop.correlation_id, processResult.recovery_message.correlation_id);
                    assert.equal(messageEnvelop.message_type, processResult.recovery_message.message_type);
                    assert.equal("queue name", processResult.recovery_queue_name);
                    callback();
                })
            }
        ], (err) => {
            done(err);
        });
    });

    test('Update_Process', (done) => {

        let process: ProcessStateV1 = new ProcessStateV1();
        process.id = "id";
        process.lock_token = "token";
        process.type = "type";
        process.locked_until_time = new Date();
        process.status = ProcessStatusV1.Running;
        process.recovery_message = new MessageV1();
        process.recovery_time = new Date();
        process.recovery_queue_name = "queue";

        async.series([
            (callback) => {
                persistence.create(null, process, (err, item) => {
                    assert.isNull(err);
                    callback();
                })
            },
            (callback) => {
                rest.post('/v1/process_states/update_process',
                    {
                        state: process
                    },
                    (err, req, res, result) => {
                        assert.isNull(err);
                        callback();
                    });
            },
            (callback) => {
                persistence.getOneById(null, process.id, (err, resultProcess) => {
                    assert.isNull(err);
                    assert.isNotNull(resultProcess);
                    assert.equal(resultProcess.id, process.id);
                    assert.equal(resultProcess.recovery_queue_name, process.recovery_queue_name);
                    callback();
                })
            }], (err) => {
                done(err);
            })
    });

    test('Get By Id Async If Process Id Not Null', (done) => {


        let process: ProcessStateV1 = new ProcessStateV1();
        process.id = "id";
        process.lock_token = "token";
        process.type = "type";
        process.locked_until_time = new Date();
        process.status = ProcessStatusV1.Running;
        process.recovery_message = new MessageV1();
        process.recovery_time = new Date();
        process.recovery_queue_name = "queue";

        async.series([
            (callback) => {
                persistence.create(null, process, (err, item) => {
                    assert.isNull(err);
                    callback();
                })
            },
            (callback) => {
                rest.post('/v1/process_states/get_process_by_id',
                    {
                        process_id: process.id
                    },
                    (err, req, res, resultProcess) => {
                        assert.isNull(err);
                        assert.equal(resultProcess.id, process.id);
                        assert.equal(resultProcess.recovery_queue_name, process.recovery_queue_name);
                        assert.equal(resultProcess.type, process.type);
                        assert.equal(resultProcess.lock_token, process.lock_token);
                        assert.equal(resultProcess.status, process.status);
                        assert.isNotNull(resultProcess.recovery_time);
                        callback();
                    });
            }], (err) => {
                done(err);
            });
    });

    test('Clear Recovery Message In Process', (done) => {
        let process: ProcessStateV1 = new ProcessStateV1();
        process.id = "id";
        process.lock_token = "token";
        process.type = "type";
        process.locked_until_time = new Date();
        process.status = ProcessStatusV1.Running;
        process.recovery_message = new MessageV1();
        process.recovery_time = new Date();
        process.recovery_queue_name = "queue";

        async.series([
            (callback) => {
                persistence.create(null, process, (err, item) => {
                    assert.isNull(err);
                    callback();
                })
            },
            (callback) => {
                rest.post('/v1/process_states/clear_process_recovery',
                    {
                        state: process
                    },
                    (err, req, res, result) => {
                        assert.isNull(err);
                        callback();
                    });
            },
            (callback) => {
                persistence.getOneById(null, process.id, (err, processResult) => {
                    assert.isNull(err);
                    assert.equal(process.id, processResult.id);
                    assert.isNull(processResult.recovery_queue_name);
                    assert.isNull(processResult.recovery_time);
                    assert.isNull(processResult.recovery_message);
                    callback();
                })
            }], (err) => {
                done(err);
            })
    });


});