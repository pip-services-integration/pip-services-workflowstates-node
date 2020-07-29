import { ProcessStateV1 } from "../../src/data/version1/ProcessStateV1";
import { ProcessStatusV1 } from "../../src/data/version1/ProcessStatusV1";
import { RecoveryManager } from "../../src/logic/RecoveryManager";
import { MessageV1 } from "../../src/data/version1/MessageV1";

const assert = require('chai').assert;

suite('ProcessRecoveryManager', () => {

    test('Test Return False If Process State Not Equal Running Or Starting', (done) => {
        var process = new ProcessStateV1();
        process.status = ProcessStatusV1.Running;
        var result = RecoveryManager.isRecoveryDue(process);
        assert.equal(result, false);
        done();
    });

    test('Test Return True If Process State Equal Running Or Starting', (done) => {
        var process = new ProcessStateV1();
        process.status = ProcessStatusV1.Running;
        process.recovery_time = new Date(Date.now() - 36000);

        var result = RecoveryManager.isRecoveryDue(process);
        assert.equal(result, true);
        done();
    });

    test('Test Return True if Process More Than Max Attempts', (done) => {
        var process = new ProcessStateV1();
        process.recovery_attempts = 10;

        var result = RecoveryManager.isAttemptsExceeded(process);
        assert.equal(result, true);
        done();
    });

    test('Test Set Recovery', (done) => {
        var process = new ProcessStateV1();
        process.recovery_message = null;
        process.recovery_queue_name = "name";

        RecoveryManager.setRecovery(process, null, null, null);
        assert.equal("name", process.recovery_queue_name);
        assert.isNull(process.recovery_message);

        var message = new MessageV1();
        message.correlation_id = "correlation id";
        message.message_type = "type";
        message.message = null;

        RecoveryManager.setRecovery(process, "new name", message, null);
        assert.equal("new name", process.recovery_queue_name);

        assert.include(message, process.recovery_message);
        done();
    });

    test('Test Retry Recovery', (done) => {
        var process = new ProcessStateV1();
        process.recovery_message = null;
        process.recovery_queue_name = "name";

        RecoveryManager.retryRecovery(process, null, null, null);
        assert.equal("name", process.recovery_queue_name);
        assert.isNull(process.recovery_message);

        var message = new MessageV1();
        message.correlation_id = "correlation id";
        message.message_type = "type";
        message.message = null;

        RecoveryManager.retryRecovery(process, "new name", message, null);
        assert.equal("new name", process.recovery_queue_name);

        assert.include(message, process.recovery_message);
        done();
    });

    test('Test Clean_Recovery', (done) => {
        var process = new ProcessStateV1();
        process.recovery_queue_name = "name";
        var message = new MessageV1();
        message.correlation_id = "correlation id";
        message.message_type = "type";
        message.message = null;
        process.recovery_message = message;
        process.recovery_time = new Date();

        RecoveryManager.clearRecovery(process);
        assert.isNull(process.recovery_message);
        assert.isNull(process.recovery_queue_name);
        assert.isNull(process.recovery_time);
        done();
    });

});