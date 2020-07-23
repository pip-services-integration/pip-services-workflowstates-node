import { ProcessStateV1 } from "../../src/data/version1/ProcessStateV1";
import { ProcessLockManager } from "../../src/logic/ProcessLockManager";

const _ = require('lodash');
const async = require('async');
const assert = require('chai').assert;

suite('ProcessLockManager', () => {
    test('Test Lock operations', (done) => {

        let process: ProcessStateV1 = new ProcessStateV1();
        let result = ProcessLockManager.isUnlocked(process);
        assert.isTrue(result);

        process.lock_token = "token";
        result = ProcessLockManager.isUnlocked(process);
        assert.isTrue(result);

        process = new ProcessStateV1();
        process.lock_token = "token";
        process.locked_until_time = new Date();

        result = ProcessLockManager.isUnlocked(process);
        assert.isFalse(result);

        process = new ProcessStateV1();
        process.locked_until_time = new Date();
        process.lock_token = "token";
        ProcessLockManager.unlockProcess(process);
        assert.isNull(process.lock_token);
        assert.isNull(process.locked_until_time);

        process = new ProcessStateV1();
        process.lock_token = "token";
        process.recovery_attempts = 2;
        ProcessLockManager.lockProcess(process, null);
        assert.isNotNull(process.lock_token);
        assert.isNotNull(process.locked_until_time);
        assert.isNotNull(process.last_action_time);
        assert.equal(3, process.recovery_attempts);

        process = new ProcessStateV1();
        process.lock_token = "token";
        process.locked_until_time = new Date(Date.now() + 24 * 3600);

        ProcessLockManager.checkNotLocked(process);

        process = new ProcessStateV1();
        ProcessLockManager.checkLocked(process);

        process = new ProcessStateV1();
        process.lock_token = "token";
        ProcessLockManager.checkLockMatches(process, new ProcessStateV1());

        process = new ProcessStateV1();
        process.locked_until_time = new Date(Date.now() - 24 * 3600);
        ProcessLockManager.checkLockValid(process);
        done();
    });

});