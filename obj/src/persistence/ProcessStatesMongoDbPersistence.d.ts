import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IdentifiableMongoDbPersistence } from 'pip-services3-mongodb-node';
import { ProcessStateV1 } from '../data/version1/ProcessStateV1';
import { IProcessStatesPersistence } from './IProcessStatesPersistence';
export declare class ProcessStatesMongoDbPersistence extends IdentifiableMongoDbPersistence<ProcessStateV1, string> implements IProcessStatesPersistence {
    constructor(name?: string);
    private toStringArray;
    private composeFilter;
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<ProcessStateV1>) => void): void;
    getActiveById(correlationId: string, id: string, callback: (err: any, item: ProcessStateV1) => void): void;
    getActiveByKey(correlationId: string, processType: string, processKey: string, callback: (err: any, item: ProcessStateV1) => void): void;
    getActiveByRequestId(correlationId: string, requestId: string, callback: (err: any, item: ProcessStateV1) => void): void;
    truncate(correlationId: string, timeout: number, callback: (err: any) => void): void;
}
