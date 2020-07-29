import { IConfigurable, IReferenceable, IOpenable, ConfigParams, IReferences } from "pip-services3-commons-node";
export declare class ProcessTruncateProcessor implements IConfigurable, IReferenceable, IOpenable {
    private _logger;
    private _timer;
    private _controller;
    private _correlationId;
    private _interval;
    constructor();
    configure(config: ConfigParams): void;
    setReferences(references: IReferences): void;
    open(correlationId: string, callback: (err: any) => void): void;
    close(correlationId: string, callback: (err: any) => any): void;
    isOpen(): boolean;
    private _truncateProcessing;
}
