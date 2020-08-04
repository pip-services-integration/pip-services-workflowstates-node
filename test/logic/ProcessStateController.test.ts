const _ = require('lodash');
const async = require('async');
const assert = require('chai').assert;

import { ConfigParams } from "pip-services3-commons-node";
import { Descriptor } from "pip-services3-commons-node";
import { References } from "pip-services3-commons-node";
import { FilterParams } from "pip-services3-commons-node";
import { PagingParams } from "pip-services3-commons-node";

import { ProcessStatesMemoryPersistence } from "../../src/persistence/ProcessStatesMemoryPersistence";
import { ProcessStatesController } from "../../src/logic/ProcessStatesController";
import { ProcessStateV1, ProcessStatusV1, MessageV1, TaskStatusV1 } from "../../src/data/version1";
import { TaskStateV1 } from "../../src/data/version1/TaskStateV1";

let MESSAGE1: MessageV1 = {
    correlation_id: "test_processes1",
    message_id: "msg_1",
    message_type: "Order.Msg",
    sent_time: new Date(Date.now() - 2 * 3600),
    message: "Sync orders"
}

let MESSAGE2: MessageV1 = {
    correlation_id: "test_processes2",
    message_id: "msg_2",
    message_type: "Order.Msg",
    sent_time: new Date(Date.now() - 3600),
    message: "Copy orders"
}

let MESSAGE3: MessageV1 = {
    correlation_id: "test_processes3",
    message_id: "msg_3",
    message_type: "Order.Msg",
    sent_time: new Date(),
    message: "Sync orders"
}

suite('ProcessStatesController', () => {
    let _persistence: ProcessStatesMemoryPersistence;
    let _controller: ProcessStatesController;

    setup((done) => {
        _persistence = new ProcessStatesMemoryPersistence();
        _controller = new ProcessStatesController();
        _persistence.configure(new ConfigParams());
        let references = References.fromTuples(
            new Descriptor("pip-services-processstates", "persistence", "mock", "default", "1.0"), _persistence
        );
        _controller.setReferences(references);
        _persistence.open(null, done);
    });

    teardown((done) => {
        _persistence.close(null, done);
    });

    test('CRUD Operations', (done) => {

        let process1, process2: ProcessStateV1;

        async.series([
            // Create process one
            (callback) => {
                _controller.startProcess(null, "Process.Type1", null, "Task.TypeX", "queue_x", MESSAGE1, 5 * 3600, (err, process) => {
                    assert.isNull(err);
                    assert.equal(process.request_id, MESSAGE1.correlation_id);
                    assert.equal(process.type, "Process.Type1");
                    assert.equal(process.status, ProcessStatusV1.Starting);
                    assert.isNotNull(process.start_time);
                    assert.isNotNull(process.last_action_time);
                    assert.isNotNull(process.expiration_time);
                    assert.isNotNull(process.tasks);
                    assert.equal(process.tasks.length, 1);
                    assert.isNotNull(process.data);
                    process1 = process;
                    callback();
                });
            },
            // Create process two
            (callback) => {
                _controller.startProcess(null, "Process.Type1", null, "Task.TypeX", "queue_x", MESSAGE2, 2 * 3600, (err, process) => {
                    assert.isNull(err);
                    assert.equal(process.request_id, MESSAGE2.correlation_id);
                    assert.equal(process.type, "Process.Type1");
                    assert.equal(process.status, ProcessStatusV1.Starting);
                    assert.isNotNull(process.start_time);
                    assert.isNotNull(process.last_action_time);
                    assert.isNotNull(process.expiration_time);
                    assert.isNotNull(process.tasks);
                    assert.equal(process.tasks.length, 1);
                    assert.isNotNull(process.data);
                    process2 = process;
                    callback();
                });
            },
            // Create process three
            (callback) => {
                _controller.startProcess(null, "Process.Type1", null, "Task.TypeX", "queue_x", MESSAGE3, 3 * 3600, (err, process) => {
                    assert.isNull(err);
                    assert.equal(process.request_id, MESSAGE3.correlation_id);
                    assert.equal(process.type, "Process.Type1");
                    assert.equal(process.status, ProcessStatusV1.Starting);
                    assert.isNotNull(process.start_time);
                    assert.isNotNull(process.last_action_time);
                    assert.isNotNull(process.expiration_time);
                    assert.isNotNull(process.tasks);
                    assert.equal(process.tasks.length, 1);
                    assert.isNotNull(process.data);

                    callback();
                });
            },
            // Get all processes
            (callback) => {
                _controller.getProcesses(null, new FilterParams(), new PagingParams, (err, page) => {
                    assert.isNull(err);
                    assert.isNotNull(page);
                    assert.isObject(page);
                    assert.equal(page.data.length, 3);
                    callback();
                });
            },
            // Update process
            (callback) => {
                process1.comment = "Update comment";
                _controller.updateProcess(null, process1, (err, process) => {
                    assert.isNull(err);
                    assert.equal(process.comment, "Update comment");
                    assert.equal(process.id, process1.id);
                    callback();
                });
            },
            // Get process
            (callback) => {
                _controller.getProcessById(null, process1.id, (err, process) => {
                    assert.isNull(err);
                    assert.equal(process.id, process1.id);
                    callback();
                });
            },
            // Delete process
            (callback) => {
                _controller.deleteProcessById(null, process2.id, (err, process) => {
                    assert.isNull(err);
                    assert.equal(process2.id, process.id);
                    callback();
                });
            },
            // Get all processes
            (callback) => {
                _controller.getProcesses(null, new FilterParams(), new PagingParams, (err, page) => {
                    assert.isNull(err);
                    assert.isNotNull(page);
                    assert.isObject(page);
                    assert.equal(page.data.length, 2);
                    callback();
                });
            },
            // Try get deleted processes
            (callback) => {
                _controller.getProcessById(null, process2.id, (err, process) => {
                    assert.isNull(err);
                    assert.isNull(process);
                    callback();
                });
            }

        ], (err) => {
            done(err);
        });
    });

    test('Get Process by null Id', (done) => {
        _controller.getProcessById(null, null, (err, process) => {
            assert.isNotNull(err);
            done();
        });
    });

    // It Should Continue Process
    test('Continue Process', (done) => {
        let process: ProcessStateV1 = new ProcessStateV1();
        process.id = "id";
        process.lock_token = "token";
        process.locked_until_time = new Date();
        process.status = ProcessStatusV1.Running;
        _persistence.create(null, process, (err, item) => {
            assert.isNull(err);
            _controller.continueProcess(null, process, (err) => {
                assert.isNull(err);
                done();
            });
        });
    });

    // It Should Return Error If Process Not Found 
    test('Try Continue Process with not exist id', (done) => {
        let process: ProcessStateV1 = new ProcessStateV1();
        process.id = "id_not_exists";
        _controller.continueProcess(null, process, (err) => {
            assert.isNotNull(err);
            done();
        });
    });
    //It Should Return Error If Process Dont Have Id
    test('Try Continue Process with null id', (done) => {
        let process: ProcessStateV1 = new ProcessStateV1();
        _controller.continueProcess(null, process, (err) => {
            assert.isNotNull(err);
            done();
        });
    });

    //It Should Abort Process()
    test('Abort Process', (done) => {
        let process: ProcessStateV1 = new ProcessStateV1();
        process.id = "id";
        process.lock_token = "token";
        process.locked_until_time = new Date();
        process.status = ProcessStatusV1.Running;
        let comment = "comment";
        async.series([
            (callback) => {
                _persistence.create(null, process, (err, item) => {
                    assert.isNull(err);
                    process = item;
                    callback();
                })
            },
            (callback) => {
                _controller.abortProcess(null, process, comment, (err) => {
                    assert.isNull(err);
                    callback();
                });
            },
            (callback) => {
                _persistence.getOneById(null, process.id, (err, processResult) => {
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


    test("Continuie With Recovery Process", (done) => {
        let process: ProcessStateV1 = new ProcessStateV1();
        process.id = "id";
        process.lock_token = "token";
        process.locked_until_time = new Date();
        process.status = ProcessStatusV1.Running;
        let messageEnvelop: MessageV1 = new MessageV1();
        messageEnvelop.correlation_id = "corrlation id";
        messageEnvelop.message_type = "message type"
        messageEnvelop.message = "";
        async.series([
            (callback) => {
                _persistence.create(null, process, (err, item) => {
                    assert.isNull(err);
                    process = item;
                    callback();
                })
            },
            (callback) => {
                _controller.continueAndRecoverProcess(null, process, "queue name", messageEnvelop, 0, (err) => {
                    assert.isNull(err);
                    callback();
                });

            },
            (callback) => {
                _persistence.getOneById(null, process.id, (err, processResult) => {
                    assert.isNull(err);
                    assert.equal(ProcessStatusV1.Running, processResult.status);
                    assert.equal(process.id, processResult.id);
                    assert.equal(messageEnvelop, processResult.recovery_message);
                    assert.equal("queue name", processResult.recovery_queue_name);
                    callback();
                })
            }
        ], (err) => {
            done(err);
        });

    });

    test("Complete Process", (done) => {
        let process: ProcessStateV1 = new ProcessStateV1();
        process.id = "id";
        process.lock_token = "token";
        process.locked_until_time = new Date();
        process.status = ProcessStatusV1.Running;

        async.series([
            (callback) => {
                _persistence.create(null, process, (err, item) => {
                    assert.isNull(err);
                    process = item;
                    callback();
                })
            },
            (callback) => {
                _controller.completeProcess(null, process, (err) => {
                    assert.isNull(err);
                    callback();
                });
            },
            (callback) => {
                _persistence.getOneById(null, process.id, (err, processResult) => {
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


    test("Request For Response Process", (done) => {
        let process: ProcessStateV1 = new ProcessStateV1();
        process.id = "id";
        process.lock_token = "token";
        process.locked_until_time = new Date();
        process.status = ProcessStatusV1.Running;
        async.series([
            (callback) => {
                _persistence.create(null, process, (err, item) => {
                    assert.isNull(err);
                    process = item;
                    callback();
                })
            },
            (callback) => {
                _controller.requestProcessForResponse(null, process, "request", "queue", new MessageV1(), (err, processResult) => {
                    assert.isNull(err);
                    assert.equal(process.id, processResult.id);
                    assert.equal("queue", processResult.recovery_queue_name);
                    assert.equal("request", processResult.request);
                    assert.equal(ProcessStatusV1.Suspended, processResult.status);
                    callback();
                });
            }
        ], (err) => {
            done(err);
        });

    });

    test("Rollback Process With Status Running", (done) => {
        let process: ProcessStateV1 = new ProcessStateV1();
        process.id = "id";
        process.lock_token = "token";
        process.locked_until_time = new Date();
        process.status = ProcessStatusV1.Running;
        async.series([
            (callback) => {
                _persistence.create(null, process, (err, item) => {
                    assert.isNull(err);
                    process = item;
                    callback();
                })
            },
            (callback) => {
                _controller.rollbackProcess(null, process, (err) => {
                    assert.isNull(err);
                    callback();
                });
            },
            (callback) => {
                _persistence.getOneById(null, process.id, (err, processResult) => {
                    assert.equal(process.id, processResult.id);
                    assert.equal(ProcessStatusV1.Running, processResult.status);
                    callback();
                });
            }
        ], (err) => {
            done(err);
        });
    });


    test("Rollback Process With State Starting", (done) => {
        let process: ProcessStateV1 = new ProcessStateV1();
        process.id = "id";
        process.lock_token = "token";
        process.locked_until_time = new Date();
        process.status = ProcessStatusV1.Starting;
        async.series([
            (callback) => {
                _persistence.create(null, process, (err, item) => {
                    assert.isNull(err);
                    process = item;
                    callback();
                })
            },
            (callback) => {
                _controller.rollbackProcess(null, process, (err) => {
                    assert.isNull(err);
                    callback();
                });
            },
            (callback) => {
                _persistence.getOneById(null, process.id, (err, processResult) => {
                    assert.isNull(err);
                    assert.isNull(processResult);
                    callback();
                })
            }
        ], (err) => {
            done(err);
        });
    });


    test("Fail Process", (done) => {
        let process: ProcessStateV1 = new ProcessStateV1();
        process.id = "id";
        process.lock_token = "token";
        process.locked_until_time = new Date();
        process.status = ProcessStatusV1.Running;
        let comment = "comment";

        async.series([
            (callback) => {
                _persistence.create(null, process, (err, item) => {
                    assert.isNull(err);
                    process = item;
                    callback();
                })
            },
            (callback) => {
                _controller.failProcess(null, process, comment, (err) => {
                    assert.isNull(err);
                    callback();
                });
            },
            (callback) => {
                _persistence.getOneById(null, process.id, (err, processResult) => {
                    assert.isNull(err);
                    assert.equal(ProcessStatusV1.Failed, processResult.status);
                    callback();
                })
            }], (err) => {
                done(err);
            });

    });

    test("Fail With Recovery Process", (done) => {

        let process: ProcessStateV1 = new ProcessStateV1();
        process.id = "id";
        process.lock_token = "token";
        process.locked_until_time = new Date();
        process.status = ProcessStatusV1.Running;
        let error = "error Message";
        let messageEnvelop: MessageV1 = new MessageV1();
        messageEnvelop.correlation_id = "corrlation id";
        messageEnvelop.message_type = "message type"
        messageEnvelop.message = "";

        async.series([
            (callback) => {
                _persistence.create(null, process, (err, item) => {
                    assert.isNull(err);
                    process = item;
                    callback();
                })
            },
            (callback) => {
                _controller.failAndRecoverProcess(null, process, error, "queue name", messageEnvelop, 0, (err) => {
                    assert.isNull(err);
                    callback();
                });
            },
            (callback) => {
                _persistence.getOneById(null, process.id, (err, processResult) => {
                    assert.isNull(err);
                    assert.equal(process.id, processResult.id);
                    assert.equal(messageEnvelop, processResult.recovery_message);
                    assert.equal("queue name", processResult.recovery_queue_name);
                    callback();
                })
            }], (err) => {
                done(err);
            });
    });


    test("Continue For Fail Process", (done) => {
        let process: ProcessStateV1 = new ProcessStateV1();
        process.id = "id";
        process.lock_token = "token";
        process.locked_until_time = new Date();
        process.status = ProcessStatusV1.Running;
        let error = "error Message";
        let messageEnvelop: MessageV1 = new MessageV1();
        messageEnvelop.correlation_id = "corrlation id";
        messageEnvelop.message_type = "message type"
        messageEnvelop.message = "";

        async.series([
            (callback) => {
                _persistence.create(null, process, (err, item) => {
                    assert.isNull(err);
                    process = item;
                    callback();
                })
            },
            (callback) => {
                process.recovery_message = messageEnvelop;
                _controller.failAndContinueProcess(null, process, error, (err) => {
                    assert.isNull(err);
                    callback();
                });
            },
            (callback) => {
                _persistence.getOneById(null, process.id, (err, processResult) => {
                    assert.isNull(err);
                    assert.equal(process.id, processResult.id);
                    assert.equal(ProcessStatusV1.Running, processResult.status);
                    assert.isNull(processResult.recovery_message);
                    assert.isNull(processResult.recovery_queue_name);
                    callback();
                })
            }], (err) => {
                done(err);
            });
    });


    test("Repeat Recovery Process", (done) => {
        let process: ProcessStateV1 = new ProcessStateV1();
        process.id = "id";
        process.lock_token = "token";
        process.locked_until_time = new Date();
        process.status = ProcessStatusV1.Running;
        async.series([
            (callback) => {
                _persistence.create(null, process, (err, item) => {
                    assert.isNull(err);
                    process = item;
                    callback();
                })
            },
            (callback) => {

                _controller.repeatProcessRecovery(null, process, 0, (err) => {
                    assert.isNull(err);
                    callback();
                });
            },
            (callback) => {
                _persistence.getOneById(null, process.id, (err, processResult) => {
                    assert.isNull(err);
                    assert.equal(1, processResult.recovery_attempts);
                    callback();
                })
            }], (err) => {
                done(err);
            });

    });


    test("Return Error If Process State Dont Equal Starting", (done) => {
        let process: ProcessStateV1 = new ProcessStateV1();
        process.id = "id";
        process.lock_token = "token";
        process.locked_until_time = new Date();
        process.status = ProcessStatusV1.Running;
        process.key = "key";
        process.type = "type";

        async.series([
            (callback) => {
                _persistence.create(null, process, (err, item) => {
                    assert.isNull(err);
                    process = item;
                    callback();
                })
            },
            (callback) => {
                _controller.startProcess(null, "type", "key", "type", null, null, null, (err, process) => {
                    assert.isNotNull(err);
                    callback();
                });
            }], (err) => {
                done(err);
            });
    });


    test("Start", (done) => {
        let process: ProcessStateV1 = new ProcessStateV1();
        process.id = "id";
        process.lock_token = "token";
        process.locked_until_time = new Date();
        process.status = ProcessStatusV1.Starting;

        async.series([
            (callback) => {
                _persistence.create(null, process, (err, item) => {
                    assert.isNull(err);
                    process = item;
                    callback();
                })
            },
            (callback) => {
                _controller.startProcess(null, "type", "key", "type", null, null, null, (err, processResult) => {
                    assert.isNull(err);
                    assert.equal(ProcessStatusV1.Starting, processResult.status);
                    callback();
                });
            }], (err) => {
                done(err);
            });
    });

    test("Start Or Activate Process", (done) => {
        let process: ProcessStateV1 = new ProcessStateV1();
        process.id = "id";
        process.lock_token = "token";
        process.locked_until_time = new Date();
        process.status = ProcessStatusV1.Starting;

        async.series([
            (callback) => {
                _persistence.create(null, process, (err, item) => {
                    assert.isNull(err);
                    process = item;
                    callback();
                })
            },
            (callback) => {
                _controller.activateOrStartProcess(null, "type", "key", "type", null, null, 0, (err, processResult) => {
                    assert.isNull(err);
                    assert.equal(ProcessStatusV1.Starting, processResult.status);
                    callback();
                });
            }], (err) => {
                done(err);
            });
    });


    test("Return Error If Resume Started Without Process", (done) => {
        let process: ProcessStateV1 = new ProcessStateV1();
        process.id = "id";
        process.lock_token = "token";
        process.locked_until_time = new Date();
        process.status = ProcessStatusV1.Starting;
        _controller.resumeProcess(null, process, "comment", (err, process) => {
            assert.isNotNull(err);
            done();
        });
    });

    test("Return Error If Resume Started Without Process Id", (done) => {
        let process: ProcessStateV1 = new ProcessStateV1();
        process.lock_token = "token";
        process.locked_until_time = new Date();
        process.status = ProcessStatusV1.Starting;

        _controller.resumeProcess(null, process, "comment", (err, process) => {
            assert.isNotNull(err);
            done();
        });
    });


    test("Return Error If Process Type Null", (done) => {
        _controller.activateOrStartProcess(null, null, "key", "type", null, null, 0, (err, process) => {
            assert.isNotNull(err);
            done();
        });
    });

    //TODO: Need check this test!
    test("Return Error If Process Key Null", (done) => {
        _controller.activateOrStartProcess(null, "type", null, "type", null, new MessageV1(), 0, (err, item) => {
            assert.isNotNull(err);
            done();
        });
    });


    test("Resume Without Completed Tasks Process", (done) => {
        let process: ProcessStateV1 = new ProcessStateV1();
        process.id = "id";
        process.lock_token = "token";
        process.locked_until_time = new Date();
        process.status = ProcessStatusV1.Suspended;
        process.tasks = new Array<TaskStateV1>();

        async.series([
            (callback) => {
                _persistence.create(null, process, (err, item) => {
                    assert.isNull(err);
                    process = item;
                    callback();
                })
            },
            (callback) => {
                _controller.resumeProcess(null, process, "comment", (err, processResult) => {
                    assert.isNull(err);
                    assert.equal(ProcessStatusV1.Starting, processResult.status);
                    assert.equal("comment", processResult.comment);
                    callback();
                });
            }], (err) => {
                done(err);
            });
    });


    // It_Should_()
    test("Resume With Completed Tasks Process", (done) => {
        let process: ProcessStateV1 = new ProcessStateV1();
        process.id = "id";
        process.lock_token = "token";
        process.locked_until_time = new Date();
        process.status = ProcessStatusV1.Suspended;
        process.tasks = new Array<TaskStateV1>();
        let task: TaskStateV1 = new TaskStateV1();
        task.status = TaskStatusV1.Completed;
        task.queue_name = "activity queue name";
        process.tasks.push(task);

        async.series([
            (callback) => {
                _persistence.create(null, process, (err, item) => {
                    assert.isNull(err);
                    process = item;
                    callback();
                })
            },
            (callback) => {
                _controller.resumeProcess(null, process, "comment", (err, processResult) => {
                    assert.isNull(err);
                    assert.equal(ProcessStatusV1.Running, processResult.status);
                    assert.equal("comment", processResult.comment);
                    callback();
                });
            }], (err) => {
                done(err);
            });
    });


    test("Clear Recovery Message In Process", (done) => {
        let process: ProcessStateV1 = new ProcessStateV1();
        process.id = "id";
        process.lock_token = "token";
        process.locked_until_time = new Date();
        process.status = ProcessStatusV1.Running;
        process.recovery_message = new MessageV1();
        process.recovery_time = new Date();
        process.recovery_queue_name = "queue";

        async.series([
            (callback) => {
                _persistence.create(null, process, (err, item) => {
                    assert.isNull(err);
                    process = item;
                    callback();
                })
            },
            (callback) => {
                _controller.clearProcessRecovery(null, process, (err) => {
                    assert.isNull(err);
                    callback();
                });
            },
            (callback) => {
                _persistence.getOneById(null, process.id, (err, processResult) => {
                    assert.isNull(err);
                    assert.equal(process.id, processResult.id);
                    assert.isNull(processResult.recovery_queue_name);
                    assert.isNull(processResult.recovery_time);
                    assert.isNull(processResult.recovery_message);
                    callback();
                })
            }], (err) => {
                done(err);
            });
    });

    test("Update Process", (done) => {
        let process: ProcessStateV1 = new ProcessStateV1();
        process.id = "id";
        process.lock_token = "token";
        process.locked_until_time = new Date();
        process.status = ProcessStatusV1.Running;
        process.recovery_message = new MessageV1();
        process.recovery_time = new Date();
        process.recovery_queue_name = "queue";

        async.series([
            (callback) => {
                _persistence.create(null, process, (err, item) => {
                    assert.isNull(err);
                    callback();
                })
            },
            (callback) => {
                process.recovery_queue_name = "updated queue";
                _controller.updateProcess(null, process, (err, resultProcess) => {
                    assert.isNull(err);
                    assert.isNotNull(resultProcess);
                    assert.equal(resultProcess.id, process.id);
                    assert.equal(resultProcess.recovery_queue_name, process.recovery_queue_name);
                    callback();
                });
            }], (err) => {
                done(err);
            });
    });

    test("Delete Process", (done) => {
        let process: ProcessStateV1 = new ProcessStateV1();
        process.id = "id";
        process.lock_token = "token";
        process.locked_until_time = new Date();
        process.status = ProcessStatusV1.Running;
        process.recovery_message = new MessageV1();
        process.recovery_time = new Date();
        process.recovery_queue_name = "queue";

        async.series([
            (callback) => {
                _persistence.create(null, process, (err, item) => {
                    assert.isNull(err);
                    callback();
                })
            },
            (callback) => {
                _controller.deleteProcessById(null, process.id, (err) => {
                    assert.isNull(err);
                    callback();
                });
            },
            (callback) => {
                _persistence.getOneById(null, process.id, (err, processResult) => {
                    assert.isNull(err);
                    assert.isNull(processResult);
                    callback();
                })
            }], (err) => {
                done(err);
            });
    });

    // It_Should_()
    test("Truncate Process", (done) => {

        let process1: ProcessStateV1 = new ProcessStateV1();
        let process2: ProcessStateV1 = new ProcessStateV1();
        let process3: ProcessStateV1 = new ProcessStateV1();
        
        process1.id = "id1";
        process1.lock_token = "token";
        process1.locked_until_time = new Date();
        process1.status = ProcessStatusV1.Completed;
        process1.recovery_message = new MessageV1();
        process1.recovery_time = new Date();
        process1.recovery_queue_name = "queue";

        process2.id = "id2";
        process2.lock_token = "token";
        process2.locked_until_time = new Date();
        process2.status = ProcessStatusV1.Aborted;
        process2.recovery_message = new MessageV1();
        process2.recovery_time = new Date();
        process2.recovery_queue_name = "queue";

        process3.id = "id3";
        process3.lock_token = "token";
        process3.locked_until_time = new Date();
        process3.status = ProcessStatusV1.Running;
        process3.recovery_message = new MessageV1();
        process3.recovery_time = new Date();
        process3.recovery_queue_name = "queue";

        async.series([
            (callback) => {
                _persistence.create(null, process1, (err, item) => {
                    assert.isNull(err);
                    callback();
                })
            },
            (callback) => {
                _persistence.create(null, process2, (err, item) => {
                    assert.isNull(err);
                    callback();
                })
            },
            (callback) => {
                _persistence.create(null, process3, (err, item) => {
                    assert.isNull(err);
                    callback();
                })
            },
            (callback) => {
                _controller.truncate(null, 0, (err) => {
                    assert.isNull(err);
                    callback();
                });
            },
            (callback) => {
                _persistence.getOneById(null, process1.id, (err, processResult) => {
                    assert.isNull(err);
                    assert.isNull(processResult);
                    callback();
                })
            },
            (callback) => {
                _persistence.getOneById(null, process2.id, (err, processResult) => {
                    assert.isNull(err);
                    assert.isNull(processResult);
                    callback();
                })
            },
            (callback) => {
                _persistence.getOneById(null, process3.id, (err, processResult) => {
                    assert.isNull(err);
                    assert.equal(process3.id, processResult.id);
                    callback();
                })
            }], (err) => {
                done(err);
            });
    });

})
