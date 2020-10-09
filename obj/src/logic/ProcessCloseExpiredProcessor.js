"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessCloseExpiredProcessor = void 0;
let async = require('async');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_components_node_1 = require("pip-services3-components-node");
const version1_1 = require("../data/version1");
class ProcessCloseExpiredProcessor {
    constructor() {
        this._logger = new pip_services3_components_node_1.CompositeLogger();
        this._timer = new pip_services3_commons_node_1.FixedRateTimer();
        this._correlationId = "integration.processesstates";
        this._interval = 5 * 60 * 1000; // 5 minutes
        this._batchSize = 100;
    }
    configure(config) {
        this._logger.configure(config);
        this._interval = config.getAsIntegerWithDefault("options.interval", this._interval);
    }
    setReferences(references) {
        this._logger.setReferences(references);
        this._controller = references.getOneRequired(new pip_services3_commons_node_1.Descriptor("pip-services-processstates", "controller", "default", "*", "1.0"));
        this._persistence = references.getOneRequired(new pip_services3_commons_node_1.Descriptor("pip-services-processstates", "persistence", "*", "*", "1.0"));
    }
    open(correlationId, callback) {
        this._timer.setDelay(this._interval);
        this._timer.setInterval(this._interval);
        this._timer.setTask({
            notify: (correlationId, args) => {
                this._closeExpiredProcessing(correlationId);
            }
        });
        this._logger.info(correlationId, "Closing expired processing is enable");
        this._timer.start();
        callback(null);
    }
    close(correlationId, callback) {
        this._timer.stop();
        this._logger.info(correlationId, "Closing expired processing is disable");
        callback(null);
    }
    isOpen() {
        return this._timer != null && this._timer.isStarted();
    }
    _closeExpiredProcessing(correlationId, callback) {
        this._logger.info(correlationId, "Starting close expired of process states");
        var expirations = 0;
        var skip = 0;
        var now = new Date();
        var recover = true;
        async.whilst(() => {
            return recover;
        }, (callback) => {
            var filter = pip_services3_commons_node_1.FilterParams.fromTuples("states", version1_1.ProcessStatusV1.Starting + "," + version1_1.ProcessStatusV1.Running, "recovered", true);
            var paging = new pip_services3_commons_node_1.PagingParams(skip, this._batchSize, false);
            this._persistence.getPageByFilter(correlationId, filter, paging, (err, page) => {
                var counter = 0;
                async.whilst(() => {
                    return counter != page.data.length;
                }, (cb) => {
                    var process = page.data[counter];
                    counter++;
                    // Double check for expired processes
                    if (process.expiration_time < now) {
                        // Fail expired processes
                        this._controller.failProcess(correlationId, process, "Reached expiration time", (err) => {
                            if (err) {
                                this._logger.error(process.id, err, "Failed to expire process " + process);
                                cb();
                                return;
                            }
                            expirations++;
                            this._logger.warn(process.id, "Close expired process " + process);
                            cb();
                        });
                    }
                }, (err) => {
                    if (page.data.length < this._batchSize)
                        recover = false;
                    else
                        skip += page.data.length;
                    callback(err);
                });
            });
        }, (err) => {
            if (expirations > 0)
                this._logger.info(correlationId, "Close " + expirations + " expired processes");
            else
                this._logger.info(correlationId, "No expired processes were found");
            this._logger.debug(correlationId, "Completed close expired of process states");
            if (callback) {
                callback(err);
            }
        });
    }
}
exports.ProcessCloseExpiredProcessor = ProcessCloseExpiredProcessor;
//# sourceMappingURL=ProcessCloseExpiredProcessor.js.map