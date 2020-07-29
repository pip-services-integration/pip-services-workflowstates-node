let async = require('async');

import { IConfigurable, IReferenceable, IOpenable, ConfigParams, IReferences, FixedRateTimer, Descriptor, FilterParams, PagingParams } from "pip-services3-commons-node";
import { CompositeLogger } from "pip-services3-components-node";
import { IProcessStatesController } from "./IProcessStatesController";
import { Parameters } from "pip-services3-commons-node";
import { ProcessStatusV1 } from "../data/version1";
import { IProcessStatesPersistence } from "../persistence";

export class ProcessCloseExpiredProcessor implements IConfigurable, IReferenceable, IOpenable {

    private _logger: CompositeLogger = new CompositeLogger();
    private _timer: FixedRateTimer = new FixedRateTimer();
    private _controller: IProcessStatesController;
    private _persistence: IProcessStatesPersistence;
    private _correlationId: string = "integration.processesstates";
    private _interval: number = 5 * 60 * 1000; // 5 minutes
    private readonly _batchSize: number = 100;

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
                this._closeExpiredProcessing(correlationId);
            }
        });
        this._logger.info(correlationId, "Closing expired processing is enable");
        this._timer.start();
        callback(null);
    }

    public close(correlationId: string, callback: (err: any) => any) {
        this._timer.stop();
        this._logger.info(correlationId, "Closing expired processing is disable");
        callback(null);
    }

    public isOpen(): boolean {
        return this._timer != null && this._timer.isStarted();
    }


    private _closeExpiredProcessing(correlationId: string, callback?: (err: any) => void): void {

        this._logger.info(correlationId, "Starting close expired of process states");

        var expirations = 0;
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
                        },
                        (err) => {
                            if (page.data.length < this._batchSize)
                                recover = false;
                            else
                                skip += page.data.length;
                            callback(err);
                        }
                    )
                })
            }, (err) => {
                if (expirations > 0)
                    this._logger.info(correlationId, "Close " + expirations + " expired processes");
                else
                    this._logger.info(correlationId, "No expired processes were found");
                this._logger.debug(correlationId, "Completed close expired of process states");
                if (callback) {
                    callback(err);
                }
            }
        )

    }
}