import { DataPage } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';

import { WorkflowStateV1 } from '../data/version1/WorkflowStateV1';

export interface IWorkflowStatesController {
    getStates(correlationId: string, filter: FilterParams, paging: PagingParams, 
        callback: (err: any, page: DataPage<WorkflowStateV1>) => void): void;

    getStateById(correlationId: string, state_id: string, customer_id: string,
        callback: (err: any, state: WorkflowStateV1) => void): void;

    createState(correlationId: string, state: WorkflowStateV1, 
        callback: (err: any, state: WorkflowStateV1) => void): void;

    updateState(correlationId: string, state: WorkflowStateV1, 
        callback: (err: any, state: WorkflowStateV1) => void): void;

    deleteStateById(correlationId: string, state_id: string, customer_id: string,
        callback: (err: any, state: WorkflowStateV1) => void): void;
}
