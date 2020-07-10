let _ = require('lodash');

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IdentifiableMongoDbPersistence } from 'pip-services3-mongodb-node';

import { WorkflowStateV1 } from '../data/version1/WorkflowStateV1';
import { WorkflowStatusV1 } from '../data/version1/WorkflowStatusV1';
import { IWorkflowStatesPersistence } from './IWorkflowStatesPersistence';

export class WorkflowStatesMongoDbPersistence
    extends IdentifiableMongoDbPersistence<WorkflowStateV1, string>
    implements IWorkflowStatesPersistence {

    public constructor(name?: string) {
        super(name || 'workflows');
        super.ensureIndex({ start_time: -1 });
    }
    
    private toStringArray(value: string): string[] {
        if (value == null) return null;
        let items = value.split(',');
        return items.length > 0 ? items : null;
    }

    private composeFilter(filter: any) {
        filter = filter || new FilterParams();

        let criteria = [];

        let id = filter.getAsNullableString('id');
        if (id != null)
            criteria.push({ _id: id });

        let type = filter.getAsNullableString('type');
        if (type != null)
            criteria.push({ type: type });

        let status = filter.getAsNullableString('status');
        if (status != null)
            criteria.push({ status: status });

        let statuses = this.toStringArray(filter.getAsNullableString('statuses'));
        if (statuses != null)
            criteria.push({ status: { $in: statuses } });

        let key = filter.getAsNullableString('key');
        if (status != null)
            criteria.push({ status: status });

        let compensated = filter.getAsNullableBoolean('compensated');
        if (compensated == true)
            criteria.push({ compensation_time: { $lt: new Date() } });

        let expired = filter.getAsNullableBoolean('expired');
        if (expired == true)
            criteria.push({ expiration_time: { $lt: new Date() } });

        let fromTime = filter.getAsNullableDateTime('from_time');
        if (fromTime != null)
            criteria.push({ start_time: { $gte: fromTime } });

        let toTime = filter.getAsNullableDateTime('to_time');
        if (fromTime != null)
            criteria.push({ start_time: { $lte: toTime } });

        let search = filter.getAsNullableString('search');
        if (search != null) {
            let searchRegex = new RegExp(search, "i");
            let searchCriteria = [];
            searchCriteria.push({ id: { $regex: searchRegex } });
            searchCriteria.push({ type: { $regex: searchRegex } });
            searchCriteria.push({ key: { $regex: searchRegex } });
            searchCriteria.push({ status: { $regex: searchRegex } });
            criteria.push({ $or: searchCriteria });
        }
                
        return criteria.length > 0 ? { $and: criteria } : null;
    }
    
    public getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<WorkflowStateV1>) => void): void {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, '-start_time', null, callback);
    }

    public getOpenById(correlationId: string, id: string, 
        callback: (err: any, item: WorkflowStateV1) => void): void {
        let filter = { 
            $and: [
                { _id: id },
                { status: { $ne: WorkflowStatusV1.Aborted } },
                { status: { $ne: WorkflowStatusV1.Completed } }
            ]
        };

        this._collection.findOne(filter, (err, item) => {
            if (item == null)
                this._logger.trace(correlationId, "Nothing found from %s with id = %s", this._collectionName, id);
            else
                this._logger.trace(correlationId, "Retrieved from %s with id = %s", this._collectionName, id);

            item = this.convertToPublic(item);
            callback(err, item);
        });    
    }

    public getOpenByKey(correlationId: string, workflowType: string, workflowKey: string, 
        callback: (err: any, item: WorkflowStateV1) => void): void {
        let filter = { 
            $and: [
                { type: workflowType },
                { key: workflowKey },
                { status: { $ne: WorkflowStatusV1.Aborted } },
                { status: { $ne: WorkflowStatusV1.Completed } }
            ]
        };

        this._collection.findOne(filter, (err, item) => {
            if (item == null)
                this._logger.trace(correlationId, "Nothing found from %s with type = %s and key = %s", this._collectionName, workflowType, workflowKey);
            else
                this._logger.trace(correlationId, "Retrieved from %s with type = %s and key = %s", this._collectionName, workflowType, workflowKey);

            item = this.convertToPublic(item);
            callback(err, item);
        });    
    }

    public getOpenByInitiatorId(correlationId: string, initiatorId: string, 
        callback: (err: any, item: WorkflowStateV1) => void): void {
        let filter = { 
            $and: [
                { initiator_id: initiatorId },
                { status: { $ne: WorkflowStatusV1.Aborted } },
                { status: { $ne: WorkflowStatusV1.Completed } }
            ]
        };

        this._collection.findOne(filter, (err, item) => {
            if (item == null)
                this._logger.trace(correlationId, "Nothing found from %s with initiator_id = %s", this._collectionName, initiatorId);
            else
                this._logger.trace(correlationId, "Retrieved from %s with initiator_id = %s", this._collectionName, initiatorId);

            item = this.convertToPublic(item);
            callback(err, item);
        });    
    }
            
    public truncate(correlationId: string, timeout: number,
        callback: (err: any) => void): void {
            let filter = { 
                $or: [
                    { status: WorkflowStatusV1.Aborted },
                    { status: WorkflowStatusV1.Completed }
                ]
            };
            super.deleteByFilter(correlationId, filter, callback);
    }    
}
