import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IGetter } from 'pip-services3-data-node';
import { IWriter } from 'pip-services3-data-node';

import { WorkflowStateV1 } from '../data/version1/WorkflowStateV1';

export interface IWorkflowStatesPersistence extends IGetter<WorkflowStateV1, string>, IWriter<WorkflowStateV1, string> {
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, 
        callback: (err: any, page: DataPage<WorkflowStateV1>) => void): void;

    getOneById(correlationId: string, id: string, 
        callback: (err: any, item: WorkflowStateV1) => void): void;

    create(correlationId: string, item: WorkflowStateV1, 
        callback: (err: any, item: WorkflowStateV1) => void): void;

    update(correlationId: string, item: WorkflowStateV1, 
        callback: (err: any, item: WorkflowStateV1) => void): void;

    deleteById(correlationId: string, id: string,
        callback: (err: any, item: WorkflowStateV1) => void): void;
}
