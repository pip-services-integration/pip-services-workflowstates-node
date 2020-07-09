import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { SortParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { ICleanable } from 'pip-services3-commons-node';

import { WorkflowStateV1 } from '../data/version1/WorkflowStateV1';

export interface IWorkflowStatesPersistence extends ICleanable {
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, sorting: SortParams,
        callback: (err: any, page: DataPage<WorkflowStateV1>) => void): void;

    getOneById(correlationId: string, id: string, 
        callback: (err: any, item: WorkflowStateV1) => void): void;

    getOneByFilter(correlationId: string, filter: FilterParams,
        callback: (err: any, item: WorkflowStateV1) => void): void;
    
    create(correlationId: string, item: WorkflowStateV1, 
        callback: (err: any, item: WorkflowStateV1) => void): void;

    update(correlationId: string, item: WorkflowStateV1, 
        callback: (err: any, item: WorkflowStateV1) => void): void;

    deleteById(correlationId: string, id: string,
        callback: (err: any, item: WorkflowStateV1) => void): void;

    deleteByFilter(correlationId: string, filter: FilterParams,
        callback: (err: any) => void): void;
}
