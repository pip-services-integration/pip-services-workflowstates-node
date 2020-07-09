import { DataPage } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';

import { WorkflowStateV1 } from '../data/version1/WorkflowStateV1';
import { MessageV1 } from '../data/version1';

export interface IWorkflowStatesController {
    getWorkflow(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<WorkflowStateV1>) => void): void;

    getWorkflowById(correlationId: string, workflowId: string,
        callback: (err: any, state: WorkflowStateV1) => void): void;

    startWorkflow(correlationId: string, workflowType: string, workflowKey: string,
        activityType: string, queueName: string, message: MessageV1, timeToLive: number,
        callback: (err: any, state: WorkflowStateV1) => void): void;

    activateOrStartWorkflow(correlationId: string, workflowType: string, workflowKey: string,
        activityType: string, queueName: string, message: MessageV1, timeToLive: number,
        callback: (err: any, state: WorkflowStateV1) => void): void;

    activateWorkflow(correlationId: string, workflowId: string,
        activityType: string, queueName: string, message: MessageV1,
        callback: (err: any, state: WorkflowStateV1) => void): void;

    activateWorkflowByKey(correlationId: string, workflowType: string, workflowKey: string,
        activityType: string, queueName: string, message: MessageV1,
        callback: (err: any, state: WorkflowStateV1) => void): void;

    rollbackWorkflow(correlationId: string, state: WorkflowStateV1,
        callback: (err: any) => void): void;
    
    continueWorkflow(correlationId: string, state: WorkflowStateV1,
        callback: (err: any) => void): void;

    continueAndCompensateWorkflow(correlationId: string, state: WorkflowStateV1,
        compensationQueue: string, compensationMessage: MessageV1, compensationTimeout: number,
        callback: (err: any) => void): void;

    repeatWorkflowCompensation(correlationId: string, state: WorkflowStateV1, compensationTimeout: number,
        callback: (err: any) => void): void;

    clearWorkflowCompensation(correlationId: string, state: WorkflowStateV1,
        callback: (err: any) => void): void;
            
    failAndContinueWorkflow(correlationId: string, state: WorkflowStateV1, errorMessage: string,
        callback: (err: any) => void): void;

    failAndCompensateWorkflow(correlationId: string, state: WorkflowStateV1, errorMessage: string,
        compensationQueue: string, compensationMessage: MessageV1, compensationTimeout: number,
        callback: (err: any) => void): void;
    
    requestWorkflowForResponse(correlationId: string, state: WorkflowStateV1, request: string,
        compensationQueue: string, compensationMessage: MessageV1,
        callback: (err: any) => void): void;
    
    failWorkflow(correlationId: string, state: WorkflowStateV1, errorMessage: string,
        callback: (err: any) => void): void;
            
    reactivateWorkflow(correlationId: string, state: WorkflowStateV1, comment: string,
        callback: (err: any, state: WorkflowStateV1) => void): void;
    
    completeWorkflow(correlationId: string, state: WorkflowStateV1,
        callback: (err: any) => void): void;

    abortWorkflow(correlationId: string, state: WorkflowStateV1, comment: string,
        callback: (err: any) => void): void;
    
    updateWorkflow(correlationId: string, state: WorkflowStateV1, 
        callback: (err: any, state: WorkflowStateV1) => void): void;

    deleteWorkflowById(correlationId: string, workflowId: string,
        callback: (err: any, state: WorkflowStateV1) => void): void;    
}
