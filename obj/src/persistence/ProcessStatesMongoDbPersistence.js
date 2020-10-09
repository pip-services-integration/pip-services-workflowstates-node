"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessStatesMongoDbPersistence = void 0;
let _ = require('lodash');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_mongodb_node_1 = require("pip-services3-mongodb-node");
const ProcessStatusV1_1 = require("../data/version1/ProcessStatusV1");
class ProcessStatesMongoDbPersistence extends pip_services3_mongodb_node_1.IdentifiableMongoDbPersistence {
    constructor(name) {
        super(name || 'processes');
        super.ensureIndex({ start_time: -1 });
    }
    toStringArray(value) {
        if (value == null)
            return null;
        let items = value.split(',');
        return items.length > 0 ? items : null;
    }
    composeFilter(filter) {
        filter = filter || new pip_services3_commons_node_1.FilterParams();
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
        if (key != null)
            criteria.push({ key: key });
        let recovered = filter.getAsNullableBoolean('recovered');
        if (recovered == true)
            criteria.push({ recovery_time: { $lt: new Date() } });
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
    getPageByFilter(correlationId, filter, paging, callback) {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, '-start_time', null, callback);
    }
    getActiveById(correlationId, id, callback) {
        let filter = {
            $and: [
                { _id: id },
                { status: { $ne: ProcessStatusV1_1.ProcessStatusV1.Aborted } },
                { status: { $ne: ProcessStatusV1_1.ProcessStatusV1.Completed } }
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
    getActiveByKey(correlationId, processType, processKey, callback) {
        let filter = {
            $and: [
                { type: processType },
                { key: processKey },
                { status: { $ne: ProcessStatusV1_1.ProcessStatusV1.Aborted } },
                { status: { $ne: ProcessStatusV1_1.ProcessStatusV1.Completed } }
            ]
        };
        this._collection.findOne(filter, (err, item) => {
            if (item == null)
                this._logger.trace(correlationId, "Nothing found from %s with type = %s and key = %s", this._collectionName, processType, processKey);
            else
                this._logger.trace(correlationId, "Retrieved from %s with type = %s and key = %s", this._collectionName, processType, processKey);
            item = this.convertToPublic(item);
            callback(err, item);
        });
    }
    getActiveByRequestId(correlationId, requestId, callback) {
        let filter = {
            $and: [
                { request_id: requestId },
                { status: { $ne: ProcessStatusV1_1.ProcessStatusV1.Aborted } },
                { status: { $ne: ProcessStatusV1_1.ProcessStatusV1.Completed } }
            ]
        };
        this._collection.findOne(filter, (err, item) => {
            if (item == null)
                this._logger.trace(correlationId, "Nothing found from %s with request_id = %s", this._collectionName, requestId);
            else
                this._logger.trace(correlationId, "Retrieved from %s with request_id = %s", this._collectionName, requestId);
            item = this.convertToPublic(item);
            callback(err, item);
        });
    }
    truncate(correlationId, timeout, callback) {
        let filter = {
            $or: [
                { status: ProcessStatusV1_1.ProcessStatusV1.Aborted },
                { status: ProcessStatusV1_1.ProcessStatusV1.Completed }
            ]
        };
        super.deleteByFilter(correlationId, filter, callback);
    }
}
exports.ProcessStatesMongoDbPersistence = ProcessStatesMongoDbPersistence;
//# sourceMappingURL=ProcessStatesMongoDbPersistence.js.map