
let _ = require('lodash');
let async = require('async');

import { IdentifiableMongoDbPersistence } from "pip-services3-mongodb-node";
import { IWorkflowStatePersistence } from "./IWorkflowStatePersistence";
import { FilterParams, ProjectionParams, PagingParams, SortParams } from "pip-services3-commons-node";
import { WorkflowStateV1 } from "../data/version1";
import { PartitionHelper } from "../logic/PartitionHelper";
import { DataPage } from "pip-services3-commons-node";
import { Partition } from "../data/version1/Partition";

export class WorkflowStateClosedMongoDbPersistence extends IdentifiableMongoDbPersistence<WorkflowStateV1, string> implements IWorkflowStatePersistence {
    public constructor(collectionName: string) {
        super(collectionName);
    }

    protected composeFilter(filter: FilterParams): any {

        filter = filter ?? new FilterParams();

        let criteria = [];

        for (var key in filter.getKeys()) {
            if (key == "status") {
                criteria.push({ status: filter.getAsNullableString(key) });
                continue;
            }

            if (key == "statuses") {
                let statuses = filter.getAsObject(key);
                if (_.isString(statuses))
                    statuses = statuses.split(',');
                if (_.isArray(statuses))
                    criteria.push({ status: { $in: statuses } });
                continue;
            }

            if (key == "type") {
                criteria.push({ type: filter.getAsNullableString(key) });
                continue;
            }

            if (key == "expired" && filter.getAsBoolean("expired")) {
                criteria.push({ expiration_time: { $lte: new Date() } });
                continue;
            }

            if (key == "compensated" && filter.getAsBoolean("compensated")) {
                criteria.push({ compensation_time: { $lte: new Date() } });
                continue;
            }

            if (key == "truncate_time") {
                criteria.push({ start_time: { $lte: filter.getAsDateTime("truncate_time") } });
                continue;
            }

            if (key == "from_time") {
                criteria.push({ start_time: { $gte: filter.getAsDateTime("from_time") } });
                continue;
            }

            if (key == "to_time") {
                criteria.push({ start_time: { $lte: filter.getAsDateTime("to_time") } });
                continue;
            }

            if (key == "search") {
                var searchFilter = [];
                searchFilter.push({ type: filter.getAsNullableString(key) });
                searchFilter.push({ _id: filter.getAsNullableString(key) });
                searchFilter.push({ request_id: filter.getAsNullableString(key) });
                searchFilter.push({ request: filter.getAsNullableString(key) });
                searchFilter.push({ key: filter.getAsNullableString(key) });

                let searchRegex = new RegExp(WorkflowStateClosedMongoDbPersistence._wildcardToRegex(filter.getAsNullableString(key)), "i");
                searchFilter.push({ key: { $regexp: searchRegex } });
                searchFilter.push({ request: { $regexp: searchRegex } });

                criteria.push({ $or: searchFilter });
                continue;
            }

            criteria.push({ [key]: filter[key] });
        }

        return criteria.length > 0 ? { $and: criteria } : null;
    }

    сreate(correlationId: string, state: WorkflowStateV1, callback: (err: any, item: WorkflowStateV1) => void): void {
        super.create(correlationId, state, callback);
    }

    getById(correlationId: string, id: string, select: ProjectionParams, callback: (err: any, item: any) => void): void {

        if (select) {
            super.getListByFilter(correlationId, { _id: id }, null, select, (err, items) => {
                if (err) {
                    callback(err, null);
                    return;
                }
                let item: WorkflowStateV1;
                if (items.length > 0) {
                    item = items[0];
                }
                callback(err, item);
            })
        } else {
            super.getOneById(correlationId, id, callback);
        }
    }

    getByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, sort: SortParams, select: ProjectionParams, callback: (err: any, page: DataPage<WorkflowStateV1>) => void): void {
        //         public async Task < DataPage < object >> GetAsync(string correlationId, FilterParams filter, PagingParams paging, SortParams sort, ProjectionParams projection)
        //     {
        //         var result = new DataPage < object >
        //         {
        //             Data = new List<object>(),
        //             Total = 0
        //         };

        //         var getPageByFilterAndProjectionTasks = new List<Task<DataPage<object>>>();

        //         for (var index = 0; index < WorkflowStateConstants.Partition.Count; index++) {
        //             var partitionFilter = new FilterParams(filter);

        //             if (!partitionFilter.ContainsKey(WorkflowStateConstants.Partition.Key)) {
        //                 partitionFilter.Add(WorkflowStateConstants.Partition.Key, PartitionHelper.GetName(index));
        //             }

        //             getPageByFilterAndProjectionTasks.Add(GetPageByFilterAndProjectionAsync(correlationId, ComposeFilter(partitionFilter), paging, ComposeSort(sort), projection));
        //         }

        //         await Task.WhenAll(getPageByFilterAndProjectionTasks);

        //         getPageByFilterAndProjectionTasks.ForEach(getPageByFilterAndProjectionTask => {
        //             if (getPageByFilterAndProjectionTask.Result != null) {
        //                 var partitionData = getPageByFilterAndProjectionTask.Result.Data;

        //                 result.Data.AddRange(partitionData);
        //                 result.Total += partitionData.Count;
        //             }
        //         });

        //         return result;
        //     }

        //         public async Task < DataPage < WorkflowStateV1 >> GetAsync(string correlationId, FilterParams filter, PagingParams paging, SortParams sort)
        //     {
        //         var result = new DataPage < WorkflowStateV1 >
        //         {
        //             Data = new List<WorkflowStateV1>(),
        //             Total = 0
        //         };

        //         var getPageByFilterTasks = new List<Task<DataPage<WorkflowStateMongoDbSchema>>>();

        //         for (var index = 0; index < WorkflowStateConstants.Partition.Count; index++) {
        //             var partitionFilter = new FilterParams(filter);

        //             if (!partitionFilter.ContainsKey(WorkflowStateConstants.Partition.Key)) {
        //                 partitionFilter.Add(WorkflowStateConstants.Partition.Key, PartitionHelper.GetName(index));
        //             }

        //             getPageByFilterTasks.Add(GetPageByFilterAsync(correlationId, ComposeFilter(partitionFilter), paging, ComposeSort(sort)));
        //         }

        //         await Task.WhenAll(getPageByFilterTasks);

        //         getPageByFilterTasks.ForEach(getPageByFilterTask => {
        //             if (getPageByFilterTask.Result != null) {
        //                 var partitionData = getPageByFilterTask.Result.Data.ConvertAll(x => ToPublic(x));

        //                 result.Data.AddRange(partitionData);
        //                 result.Total += partitionData.Count;
        //             }
        //         });

        //         return result;
        //     }
    }

    getOneByFilter(correlationId: string, filter: FilterParams, callback: (err: any, item: WorkflowStateV1) => void): void {
        super.getListByFilter(correlationId, filter, null, null, (err, items) =>{
            if (err) {
                callback(err, null);
            }
            let item:WorkflowStateV1;
            if (items.length > 0) {
                item = items[0];
            }
            callback(err, item);
        });
    }

    update(correlationId: string, state: WorkflowStateV1, callback: (err: any, item: WorkflowStateV1) => void): void {
        super.update(correlationId, state, callback);
    }

    deleteById(correlationId: string, id: string, callback: (err: any, item: any) => void): void {
        super.deleteById(correlationId, id, callback);
    }


    deleteByFilter(correlationId: string, filter: FilterParams, callback?: (err: any) => void) {
        let index = 0;
        async.whilst(
            (cb) => { cb(null, index < Partition.Count); },
            (callback) => {
                var partitionFilter: FilterParams = filter.clone();

                if (partitionFilter.getAsNullableString(Partition.Key) == null) {
                    partitionFilter.setAsObject(Partition.Key, PartitionHelper.getName(index));
                }
                super.deleteByFilter(correlationId, this.composeFilter(partitionFilter), (err) => {
                    index++;
                    callback(err);
                });
            },
            (err) => {
                callback(err);
            }
        );
    }

    clear(correlationId: string, callback: (err: any) => void) {
        //         public async Task ClearAsync()
        //     {
        //         for (var index = 0; index < WorkflowStateConstants.Partition.Count; index++) {
        //             var builder = Builders<WorkflowStateMongoDbSchema>.Filter;
        //             var filter = builder.Empty;

        //             filter &= builder.Eq(_partitionKey, PartitionHelper.GetName(index));

        //             using(var cursor = await _collection.FindAsync(filter))
        //                 {
        //                     while (await cursor.MoveNextAsync())
        //             {
        //                 foreach(var entity in cursor.Current)
        //                 {
        //                     await DeleteByIdAsync(null, entity.Id);
        //                 }
        //             }
        //         }
        //     }
        // }
    }

    protected getPartitionKey(id: string): string {
        return PartitionHelper.getValue(id);
    }

    // protected   getIndexes():Array<string>
    // {
    //     return super._indexes;
    // }
    //=============================================================================================

    // private static toPublicWorkflowStateV1(value: WorkflowStateMongoDbSchema): WorkflowStateV1 {
    //     if (value == null) {
    //         return null;
    //     }

    //     var result = new WorkflowStateV1();

    //     result.activities = this.toPublicActivityStateV1(value.activities),
    //     result.attempt_count = value.attempt_count,
    //     result.comment = value.comment,
    //     result.compensation_message = this.toPublicMessageEnvelope(value.compensation_message),
    //     result.compensation_queue_name = value.compensation_queue_name,
    //     result.compensation_time = value.compensation_time,
    //     result.data = new Map<string, string>(value.data),
    //     result.end_time = value.end_time,
    //     result.expiration_time = value.expiration_time,
    //     result.id = value.id,
    //     result.request_id = value.request_id,
    //     result.key = value.key,
    //     result.last_action_time = value.last_action_time,
    //     result.locked_until_time = value.locked_until_time,
    //     result.lock_token = value.lock_token,
    //     result.request = value.request,
    //     result.start_time = value.start_time,
    //     result.status = value.status,
    //     result.type = value.type
    //     return result;
    // }

    // private static toPublicActivityStateV1(activities: Array<ActivityStateMongoDbSchema>): Array<ActivityStateV1> {
    //     var result = new Array<ActivityStateV1>();

    //     if (activities == null) {
    //         return result;
    //     }

    //     for (var activity of activities) {
    //         let item = new ActivityStateV1();

    //         item.end_time = activity.end_time,
    //             item.error_message = activity.error_message,
    //             item.message = this.toPublicMessageEnvelope(activity.message),
    //             item.queue_name = activity.queue_name,
    //             item.start_time = activity.start_time,
    //             item.status = activity.status,
    //             item.type = activity.type

    //         result.push(item);
    //     }

    //     return result;
    // }

    // private static toPublicMessageEnvelope(message: MessageEnvelopeMongoDbSchema): MessageEnvelope {
    //     if (message == null) {
    //         return null;
    //     }

    //     let item = new MessageEnvelope(message.correlation_id, message.message_type, message.message);
    //     item.message_id = message.message_id;
    //     item.sent_time = message.sent_time;

    //     return item;
    // }

    // private static fromPublicWorkflowStateV1(value: WorkflowStateV1): WorkflowStateMongoDbSchema {
    //     if (value == null) {
    //         return null;
    //     }

    //     var result = new WorkflowStateMongoDbSchema();

    //     result.activities = this.fromPublicActivityStateV1(value.activities),
    //         result.attempt_count = value.attempt_count,
    //         result.comment = value.comment,
    //         result.compensation_message = this.fromPublicMessageEnvelope(value.compensation_message),
    //         result.compensation_queue_name = value.compensation_queue_name,
    //         result.compensation_time = value.compensation_time,
    //         result.data = new Map<string, string>(value.data),
    //         result.end_time = value.end_time,
    //         result.expiration_time = value.expiration_time,
    //         result.id = value.id,
    //         result.request_id = value.request_id,
    //         result.key = value.key,
    //         result.last_action_time = value.last_action_time,
    //         result.locked_until_time = value.locked_until_time,
    //         result.lock_token = value.lock_token,
    //         result.request = value.request,
    //         result.start_time = value.start_time,
    //         result.status = value.status,
    //         result.type = value.type


    //     return result;
    // }

    // private static fromPublicActivityStateV1(activities: Array<ActivityStateV1>): Array<ActivityStateMongoDbSchema> {
    //     var result = new Array<ActivityStateMongoDbSchema>();

    //     if (activities == null) {
    //         return result;
    //     }

    //     for (var activity of activities) {
    //         let item = new ActivityStateMongoDbSchema();

    //         item.end_time = activity.end_time;
    //         item.error_message = activity.error_message;
    //         item.message = this.fromPublicMessageEnvelope(activity.message);
    //         item.queue_name = activity.queue_name;
    //         item.start_time = activity.start_time;
    //         item.status = activity.status;
    //         item.type = activity.type;
    //         result.push(item);
    //     }

    //     return result;
    // }

    // private static fromPublicMessageEnvelope(msg: MessageEnvelope): MessageEnvelopeMongoDbSchema {
    //     if (msg == null) {
    //         return null;
    //     }

    //     let item = new MessageEnvelopeMongoDbSchema();
    //     item.correlation_id = msg.correlation_id,
    //         item.message = msg.message.toString(),
    //         item.message_id = msg.message_id,
    //         item.message_type = msg.message_type,
    //         item.sent_time = msg.sent_time
    //     return item;
    // }

    private static _wildcardToRegex(wildcard: string): string {
        return "^" + wildcard.replace(".", "\\.").replace(")", "\\)").replace("(", "\\(").replace("?", ".?").replace("*", ".*") + "$";
    }
}

