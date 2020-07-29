import { IConfigurable, IReferenceable, IOpenable, ConfigParams, IReferences } from "pip-services3-commons-node";
export declare class ProcessRecoveryProcessor implements IConfigurable, IReferenceable, IOpenable {
    private _logger;
    private _timer;
    private _controller;
    private _persistence;
    private _correlationId;
    private _interval;
    private readonly _batchSize;
    private _recoveryController;
    constructor();
    configure(config: ConfigParams): void;
    setReferences(references: IReferences): void;
    open(correlationId: string, callback: (err: any) => void): void;
    close(correlationId: string, callback: (err: any) => any): void;
    isOpen(): boolean;
    private _recoveryProcessing;
}
