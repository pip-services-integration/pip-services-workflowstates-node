import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IdentifiableMemoryPersistence } from 'pip-services3-data-node';
import { ProcessStateV1 } from '../data/version1/ProcessStateV1';
import { IProcessStatesPersistence } from './IProcessStatesPersistence';
export declare class ProcessStatesMemoryPersistence extends IdentifiableMemoryPersistence<ProcessStateV1, string> implements IProcessStatesPersistence {
    constructor();
    private toStringArray;
    private matchString;
    private matchSearch;
    private composeFilter;
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<ProcessStateV1>) => void): void;
    getActiveById(correlationId: string, id: string, callback: (err: any, item: ProcessStateV1) => void): void;
    getActiveByKey(correlationId: string, processType: string, processKey: string, callback: (err: any, item: ProcessStateV1) => void): void;
    getActiveByRequestId(correlationId: string, requestId: string, callback: (err: any, item: ProcessStateV1) => void): void;
    truncate(correlationId: string, timeout: number, callback: (err: any) => void): void;
}
