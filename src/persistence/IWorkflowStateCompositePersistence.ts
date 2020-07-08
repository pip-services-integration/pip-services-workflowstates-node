
import { FilterParams } from "pip-services3-commons-node";
import { PagingParams } from "pip-services3-commons-node";
import { SortParams } from "pip-services3-commons-node";
import { ProjectionParams } from "pip-services3-commons-node";
import { DataPage } from "pip-services3-commons-node";
import { IWorkflowStatePersistence } from "./IWorkflowStatePersistence";
import { PersistenceStorageType } from "./PersistenceStorageType";
import { WorkflowStatusV1 } from "../data/version1/WorkflowStatusV1";

export interface IWorkflowStateCompositePersistence extends IWorkflowStatePersistence {
    workflowsOpenedPersistence: IWorkflowStatePersistence;
    workflowsClosedPersistence: IWorkflowStatePersistence;

    deleteInStorageById(correlationId: string, id: string, persistenceStorage: PersistenceStorageType, callback: (err: any, item: WorkflowStatusV1) => void): void;
    deleteInStorageByFilter(correlationId: string, filter: FilterParams, persistenceStorage: PersistenceStorageType, callback: (err: any) => void): void;
    getFromStorageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, sort: SortParams, projection: ProjectionParams, persistenceStorage: PersistenceStorageType,
        callback: (err: any, page: DataPage<any>) => void): void;

    createInClosedPersistence(correlationId: string, workflowStatus: WorkflowStatusV1, callback: (err: any, item: WorkflowStatusV1) => void): void;
    updateInOpenedPersistence(correlationId: string, workflowStatus: WorkflowStatusV1, callback: (err: any, item: WorkflowStatusV1) => void): void;
}

