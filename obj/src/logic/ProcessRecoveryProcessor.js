"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let async = require('async');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_components_node_1 = require("pip-services3-components-node");
const ProcessStatusV1_1 = require("../data/version1/ProcessStatusV1");
class ProcessRecoveryProcessor {
    constructor() {
        this._logger = new pip_services3_components_node_1.CompositeLogger();
        this._timer = new pip_services3_commons_node_1.FixedRateTimer();
        this._correlationId = "integration.processesstates";
        this._interval = 1 * 60 * 1000; // 1 minute
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
                this._recoveryProcessing(correlationId);
            }
        });
        this._logger.info(correlationId, "Recovery processing is enable");
        this._timer.start();
        callback(null);
    }
    close(correlationId, callback) {
        this._timer.stop();
        this._logger.info(correlationId, "Recovery processing is disable");
        callback(null);
    }
    isOpen() {
        return this._timer != null && this._timer.isStarted();
    }
    _recoveryProcessing(correlationId, callback) {
        this._logger.info(correlationId, "Starting recovery of process states");
        var recovered = 0;
        var skip = 0;
        var now = new Date();
        var recover = true;
        async.whilst(() => {
            return recover;
        }, (callback) => {
            var filter = pip_services3_commons_node_1.FilterParams.fromTuples("states", ProcessStatusV1_1.ProcessStatusV1.Starting + "," + ProcessStatusV1_1.ProcessStatusV1.Running, "recovered", true);
            var paging = new pip_services3_commons_node_1.PagingParams(skip, this._batchSize, false);
            this._persistence.getPageByFilter(correlationId, filter, paging, (err, page) => {
                var counter = 0;
                async.whilst(() => {
                    return counter != page.data.length;
                }, (cb) => {
                    var process = page.data[counter];
                    counter++;
                    if (this._recoveryController.isAttemptsExceeded(process)) {
                        this._logger.warn(process.id, "Process " + process + " has reached maximum number of attempts and will be failed");
                        this._controller.failProcess(correlationId, process, "Exceeded number of failed attempts", (err) => {
                            if (err) {
                                this._logger.error(correlationId, err, "Failed to fail recovery process " + process);
                            }
                            recovered++;
                            cb();
                        });
                    }
                    else if (this._recoveryController.isRecoveryDue(process)) {
                        this._logger.info(process.id, "Recovery started for process " + process);
                        this._recoveryController.sendRecovery(process, (err, res) => {
                            if (err) {
                                this._logger.error(correlationId, err, "Failed to fail recovery process " + process);
                                cb();
                                return;
                            }
                            // Clear compensation
                            this._controller.clearProcessRecovery(correlationId, process, (err) => {
                                if (err) {
                                    this._logger.error(correlationId, err, "Failed to fail recovery process " + process);
                                    cb();
                                    return;
                                }
                                recovered++;
                                cb();
                            });
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
            if (recovered > 0)
                this._logger.info(correlationId, "Recovered " + recovered + " processes");
            else
                this._logger.info(correlationId, "Found no processes that require recovery");
            this._logger.debug(correlationId, "Finished processes recovery");
            if (callback) {
                callback(err);
            }
        });
    }
}
exports.ProcessRecoveryProcessor = ProcessRecoveryProcessor;
//# sourceMappingURL=ProcessRecoveryProcessor.js.map