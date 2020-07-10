import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';

import { ProcessStateV1 } from '../data/version1/ProcessStateV1';

export interface IProcessStatesPersistence {
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<ProcessStateV1>) => void): void;

    getOneById(correlationId: string, id: string, 
        callback: (err: any, item: ProcessStateV1) => void): void;

    getListByIds(correlationId: string, ids: string[], 
        callback: (err: any, items: ProcessStateV1[]) => void): void;

    getActiveById(correlationId: string, id: string, 
        callback: (err: any, item: ProcessStateV1) => void): void;
            
    getActiveByKey(correlationId: string, processType: string, processKey: string, 
        callback: (err: any, item: ProcessStateV1) => void): void;

    getActiveByInitiatorId(correlationId: string, initiatorId: string, 
        callback: (err: any, item: ProcessStateV1) => void): void;
            
    create(correlationId: string, item: ProcessStateV1, 
        callback: (err: any, item: ProcessStateV1) => void): void;

    update(correlationId: string, item: ProcessStateV1, 
        callback: (err: any, item: ProcessStateV1) => void): void;

    deleteById(correlationId: string, id: string,
        callback: (err: any, item: ProcessStateV1) => void): void;

    deleteByIds(correlationId: string, ids: string[],
        callback: (err: any) => void): void;

    truncate(correlationId: string, timeout: number,
        callback: (err: any) => void): void;
}
