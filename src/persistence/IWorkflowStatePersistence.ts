
import { FilterParams } from "pip-services3-commons-node";
import { PagingParams } from "pip-services3-commons-node";
import { SortParams } from "pip-services3-commons-node";
import { DataPage } from "pip-services3-commons-node";
import { ProjectionParams } from "pip-services3-commons-node";
import { WorkflowStateV1 } from "../data/version1/WorkflowStateV1";

export interface IWorkflowStatePersistence {
    сreate(correlationId: string, state: WorkflowStateV1, callback: (err: any, item: WorkflowStateV1) => void): void;
    update(correlationId: string, state: WorkflowStateV1, callback: (err: any, item: WorkflowStateV1) => void): void;
    deleteById(correlationId: string, id: string, callback: (err: any, item: WorkflowStateV1) => void): void;
    deleteByFilter(correlationId: string, filter: FilterParams, callback?: (err: any) => void): void;
    getById(correlationId: string, id: string, select: ProjectionParams, callback: (err: any, item: any) => void): void;
    getByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, sort: SortParams, select: ProjectionParams, callback: (err: any, page: DataPage<WorkflowStateV1>) => void): void;
    getOneByFilter(correlationId: string, filter: FilterParams, callback: (err: any, item: WorkflowStateV1) => void): void;
    clear(correlationId: string, callback: (err: any) => void): void;
}
