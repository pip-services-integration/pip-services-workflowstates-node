let async = require('async');

import { IConfigurable, IReferenceable, IOpenable, ConfigParams, IReferences, FixedRateTimer, FilterParams, PagingParams, Descriptor } from "pip-services3-commons-node";
import { CompositeLogger } from "pip-services3-components-node";
import { IProcessStatesController } from "./IProcessStatesController";
import { Parameters } from "pip-services3-commons-node";
import { RecoveryController } from "./RecoveryController";
import { IProcessStatesPersistence } from "../persistence";
import { ProcessStatusV1 } from "../data/version1/ProcessStatusV1";

export class ProcessRecoveryProcessor implements IConfigurable, IReferenceable, IOpenable {

    private _logger: CompositeLogger = new CompositeLogger();
    private _timer: FixedRateTimer = new FixedRateTimer();
    private _controller: IProcessStatesController;
    private _persistence: IProcessStatesPersistence;
    private _correlationId: string = "integration.processesstates";
    private _interval: number = 1 * 60 * 1000; // 1 minute
    private readonly _batchSize: number = 100;
    private _recoveryController: RecoveryController;

    constructor(){
        
    }
    public configure(config: ConfigParams): void {
        this._logger.configure(config);
        this._interval = config.getAsIntegerWithDefault("options.interval", this._interval);
    }

    public setReferences(references: IReferences): void {
        this._logger.setReferences(references);
        this._controller = references.getOneRequired<IProcessStatesController>(new Descriptor("pip-services-processstates", "controller", "default", "*", "1.0"));
        this._persistence = references.getOneRequired<IProcessStatesPersistence>(new Descriptor("pip-services-processstates", "persistence", "*", "*", "1.0"));
    }

    public open(correlationId: string, callback: (err: any) => void) {
        this._timer.setDelay(this._interval);
        this._timer.setInterval(this._interval);
        this._timer.setTask({
            notify: (correlationId: string, args: Parameters) => {
                this._recoveryProcessing(correlationId);
            }
        });
        this._logger.info(correlationId, "Recovery processing is enable");
        this._timer.start();
        callback(null);
    }

    public close(correlationId: string, callback: (err: any) => any) {
        this._timer.stop();
        this._logger.info(correlationId, "Recovery processing is disable");
        callback(null);
    }

    public isOpen(): boolean {
        return this._timer != null && this._timer.isStarted();
    }

    private _recoveryProcessing(correlationId: string, callback?: (err: any) => void): void {
        this._logger.info(correlationId, "Starting recovery of process states");

        var recovered = 0;
        var skip = 0;
        var now = new Date();
        var recover: boolean = true;

        async.whilst(() => {
            return recover;
        },
            (callback) => {
                var filter = FilterParams.fromTuples(
                    "states", ProcessStatusV1.Starting + "," + ProcessStatusV1.Running,
                    "recovered", true
                );
                var paging = new PagingParams(skip, this._batchSize, false);

                this._persistence.getPageByFilter(correlationId, filter, paging, (err, page) => {
                    var counter = 0
                    async.whilst(() => {
                        return counter != page.data.length
                    },
                        (cb) => {
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
                                })
                            }
                        },
                        (err) => {
                            if (page.data.length < this._batchSize)
                                recover = false;
                            else
                                skip += page.data.length;
                            callback(err);
                        });
                })
            }, (err) => {
                if (recovered > 0)
                    this._logger.info(correlationId, "Recovered " + recovered + " processes");
                else
                    this._logger.info(correlationId, "Found no processes that require recovery");
                this._logger.debug(correlationId, "Finished processes recovery");
                if (callback) {
                    callback(err);
                }
            }
        )
    }

}