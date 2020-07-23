import { ProcessStateV1 } from "../../src/data/version1/ProcessStateV1";
import { ProcessStateManager } from "../../src/logic/ProcessStateManager";
import { ProcessStatusV1 } from "../../src/data/version1/ProcessStatusV1";

const _ = require('lodash');
const async = require('async');
const assert = require('chai').assert;

suite('ProcessStatusManager', () => {
    test('Test Status operations', (done) => {

        let process: ProcessStateV1 = new ProcessStateV1();

        async.series([
            (callback) => {
                ProcessStateManager.checkNotExpired(process);

                process = new ProcessStateV1();
                process.status = ProcessStatusV1.Completed;
                ProcessStateManager.checkActive(process);

                process = new ProcessStateV1();
                process.status = ProcessStatusV1.Completed;
                ProcessStateManager.checkPending(process);
                callback();
            },
            (callback) => {
                ProcessStateManager.startProcess(null, null, null, (err, item) => {
                    assert.isNotNull(err);
                    callback();
                });
            },
            (callback) => {
                process = new ProcessStateV1();
                let result: ProcessStateV1 = ProcessStateManager.extendProcessExpiration(process);
                assert.isNotNull(result.expiration_time);

                process = new ProcessStateV1();
                ProcessStateManager.restartProcess(process);
                assert.isNull(process.end_time);
                assert.isNull(process.request);
                assert.equal(0, process.recovery_attempts);
                assert.equal(ProcessStatusV1.Starting, process.status);

                process = new ProcessStateV1();
                ProcessStateManager.continueProcess(process);
                assert.isNull(process.end_time);
                assert.isNull(process.request);
                assert.equal(ProcessStatusV1.Running, process.status);

                process = new ProcessStateV1();
                process.recovery_attempts = 6;
                ProcessStateManager.repeatProcessActivation(process);
                assert.isNull(process.end_time);
                assert.isNull(process.request);
                assert.equal(7, process.recovery_attempts);

                process = new ProcessStateV1();
                process.recovery_attempts = 6;
                ProcessStateManager.activateProcessWithFailure(process);
                assert.isNull(process.end_time);
                assert.isNull(process.request);
                assert.equal(7, process.recovery_attempts);
                assert.equal(ProcessStatusV1.Running, process.status);

                process = new ProcessStateV1();
                ProcessStateManager.failProcess(process);
                assert.isNull(process.end_time);
                assert.isNull(process.request);
                assert.equal(ProcessStatusV1.Failed, process.status);

                process = new ProcessStateV1();
                process.recovery_attempts = 6;
                ProcessStateManager.requestProcessResponse(process, "request");
                assert.isNull(process.end_time);
                assert.equal("request", process.request);
                assert.equal(7, process.recovery_attempts);
                assert.equal(ProcessStatusV1.Suspended, process.status);

                process = new ProcessStateV1();
                process.recovery_attempts = 6;
                ProcessStateManager.abortProcess(process);
                assert.isNotNull(process.end_time);
                assert.equal(ProcessStatusV1.Aborted, process.status);

                process = new ProcessStateV1();
                ProcessStateManager.completeProcess(process);
                assert.isNotNull(process.end_time);
                assert.equal(0, process.recovery_attempts);
                assert.isNull(process.request);
                assert.equal(ProcessStatusV1.Completed, process.status);
                callback();
            }
        ], (err) => {
            done();
        });

    })
});