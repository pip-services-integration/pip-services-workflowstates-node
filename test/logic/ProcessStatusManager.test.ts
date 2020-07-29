import { ProcessStateV1 } from "../../src/data/version1/ProcessStateV1";
import { ProcessStatesManager } from "../../src/logic/ProcessStatesManager";
import { ProcessStatusV1 } from "../../src/data/version1/ProcessStatusV1";

const _ = require('lodash');
const async = require('async');
const assert = require('chai').assert;

suite('ProcessStatusManager', () => {
    test('Test Status operations', (done) => {

        let process: ProcessStateV1 = new ProcessStateV1();

        async.series([
            (callback) => {
                ProcessStatesManager.checkNotExpired(process);

                process = new ProcessStateV1();
                process.status = ProcessStatusV1.Completed;
                ProcessStatesManager.checkActive(process);

                process = new ProcessStateV1();
                process.status = ProcessStatusV1.Completed;
                ProcessStatesManager.checkPending(process);
                callback();
            },
            (callback) => {
                ProcessStatesManager.startProcess(null, null, null, (err, item) => {
                    assert.isNotNull(err);
                    callback();
                });
            },
            (callback) => {
                process = new ProcessStateV1();
                let result: ProcessStateV1 = ProcessStatesManager.extendProcessExpiration(process);
                assert.isNotNull(result.expiration_time);

                process = new ProcessStateV1();
                ProcessStatesManager.restartProcess(process);
                assert.isNull(process.end_time);
                assert.isNull(process.request);
                assert.equal(0, process.recovery_attempts);
                assert.equal(ProcessStatusV1.Starting, process.status);

                process = new ProcessStateV1();
                ProcessStatesManager.continueProcess(process);
                assert.isNull(process.end_time);
                assert.isNull(process.request);
                assert.equal(ProcessStatusV1.Running, process.status);

                process = new ProcessStateV1();
                process.recovery_attempts = 6;
                ProcessStatesManager.repeatProcessActivation(process);
                assert.isNull(process.end_time);
                assert.isNull(process.request);
                assert.equal(7, process.recovery_attempts);

                process = new ProcessStateV1();
                process.recovery_attempts = 6;
                ProcessStatesManager.activateProcessWithFailure(process);
                assert.isNull(process.end_time);
                assert.isNull(process.request);
                assert.equal(7, process.recovery_attempts);
                assert.equal(ProcessStatusV1.Running, process.status);

                process = new ProcessStateV1();
                ProcessStatesManager.failProcess(process);
                assert.isNull(process.end_time);
                assert.isNull(process.request);
                assert.equal(ProcessStatusV1.Failed, process.status);

                process = new ProcessStateV1();
                process.recovery_attempts = 6;
                ProcessStatesManager.requestProcessResponse(process, "request");
                assert.isNull(process.end_time);
                assert.equal("request", process.request);
                assert.equal(7, process.recovery_attempts);
                assert.equal(ProcessStatusV1.Suspended, process.status);

                process = new ProcessStateV1();
                process.recovery_attempts = 6;
                ProcessStatesManager.abortProcess(process);
                assert.isNotNull(process.end_time);
                assert.equal(ProcessStatusV1.Aborted, process.status);

                process = new ProcessStateV1();
                ProcessStatesManager.completeProcess(process);
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