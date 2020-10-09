"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessTruncateProcessor = void 0;
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_components_node_1 = require("pip-services3-components-node");
class ProcessTruncateProcessor {
    constructor() {
        this._logger = new pip_services3_components_node_1.CompositeLogger();
        this._timer = new pip_services3_commons_node_1.FixedRateTimer();
        this._correlationId = "integration.processesstates";
        this._interval = 90 * 24 * 60 * 60 * 1000; // 90 days;
    }
    configure(config) {
        this._logger.configure(config);
        this._interval = config.getAsIntegerWithDefault("options.interval", this._interval);
    }
    setReferences(references) {
        this._logger.setReferences(references);
        this._controller = references.getOneRequired(new pip_services3_commons_node_1.Descriptor("pip-services-processstates", "controller", "default", "*", "1.0"));
    }
    open(correlationId, callback) {
        this._timer.setDelay(this._interval);
        this._timer.setInterval(this._interval);
        this._timer.setTask({
            notify: (correlationId, args) => {
                this._truncateProcessing(correlationId);
            }
        });
        this._logger.info(correlationId, "Truncate processing is enable");
        this._timer.start();
        callback(null);
    }
    close(correlationId, callback) {
        this._timer.stop();
        this._logger.info(correlationId, "Truncate processing is disable");
        callback(null);
    }
    isOpen() {
        return this._timer != null && this._timer.isStarted();
    }
    _truncateProcessing(correlationId) {
        this._logger.info(correlationId, "Starting truncation of process states");
        this._controller.truncate(correlationId, 0, (err) => {
            if (err) {
                this._logger.error(correlationId, err, "Truncation of process states failed");
            }
            else
                this._logger.info(correlationId, "Completed truncation of process states");
        });
    }
}
exports.ProcessTruncateProcessor = ProcessTruncateProcessor;
//# sourceMappingURL=ProcessTruncateProcessor.js.map