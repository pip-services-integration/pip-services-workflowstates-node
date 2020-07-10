import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';

import { WorkflowStateV1 } from '../data/version1/WorkflowStateV1';

export interface IWorkflowStatesPersistence {
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<WorkflowStateV1>) => void): void;

    getOneById(correlationId: string, id: string, 
        callback: (err: any, item: WorkflowStateV1) => void): void;

    getListByIds(correlationId: string, ids: string[], 
        callback: (err: any, items: WorkflowStateV1[]) => void): void;

    getOpenById(correlationId: string, id: string, 
        callback: (err: any, item: WorkflowStateV1) => void): void;
            
    getOpenByKey(correlationId: string, workflowType: string, workflowKey: string, 
        callback: (err: any, item: WorkflowStateV1) => void): void;

    getOpenByInitiatorId(correlationId: string, initiatorId: string, 
        callback: (err: any, item: WorkflowStateV1) => void): void;
            
    create(correlationId: string, item: WorkflowStateV1, 
        callback: (err: any, item: WorkflowStateV1) => void): void;

    update(correlationId: string, item: WorkflowStateV1, 
        callback: (err: any, item: WorkflowStateV1) => void): void;

    deleteById(correlationId: string, id: string,
        callback: (err: any, item: WorkflowStateV1) => void): void;

    deleteByIds(correlationId: string, ids: string[],
        callback: (err: any) => void): void;

    truncate(correlationId: string, timeout: number,
        callback: (err: any) => void): void;
}
