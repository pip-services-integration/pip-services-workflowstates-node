"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecoveryController = void 0;
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_components_node_1 = require("pip-services3-components-node");
const RecoveryManager_1 = require("./RecoveryManager");
const pip_services3_messaging_node_1 = require("pip-services3-messaging-node");
class RecoveryController {
    constructor(references, logger) {
        this._references = references;
        if (!logger) {
            logger = new pip_services3_components_node_1.CompositeLogger(references);
        }
        this._logger = logger;
    }
    isRecoveryDue(status) {
        return RecoveryManager_1.RecoveryManager.isRecoveryDue(status);
    }
    isAttemptsExceeded(status) {
        //TEMPORARY, to get workflows flowing
        return false;
        return RecoveryManager_1.RecoveryManager.isAttemptsExceeded(status);
    }
    sendRecovery(status, callback) {
        var message = status.recovery_message;
        if (message == null) {
            this._logger.error(status.id, null, "Process " + status + " is missing recovery message");
            callback(null, false);
            return;
        }
        var queue = status.recovery_queue_name != null
            // TODO: must change mechanism of geting queues
            ? this._references.getOneRequired(new pip_services3_commons_node_1.Descriptor("*", "queue", "*", status.recovery_queue_name, "1.0")) : null;
        if (queue == null) {
            this._logger.error(status.id, null, "Process " + status + " is missing recovery queue name");
            callback(null, false);
            return;
        }
        // Send a recovery message
        message.correlation_id = message.correlation_id || status.id;
        queue.send(message.correlation_id, this._convertToMessageEnvelope(message), (err) => {
            if (err) {
                callback(err, false);
            }
            this._logger.info(status.id, "Sent recovery message for process " + status + " to " + queue);
            callback(null, true);
            return;
        });
    }
    _convertToMessageEnvelope(msg) {
        var item = new pip_services3_messaging_node_1.MessageEnvelope(msg.correlation_id, msg.message_type, msg.message);
        item.sent_time = msg.sent_time;
        item.message_id = msg.message_id;
        return item;
    }
}
exports.RecoveryController = RecoveryController;
//# sourceMappingURL=RecoveryController.js.map