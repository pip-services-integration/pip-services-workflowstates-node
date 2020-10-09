"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessStatesMemoryPersistence = void 0;
let _ = require('lodash');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_data_node_1 = require("pip-services3-data-node");
const version1_1 = require("../data/version1");
class ProcessStatesMemoryPersistence extends pip_services3_data_node_1.IdentifiableMemoryPersistence {
    constructor() {
        super();
    }
    toStringArray(value) {
        if (value == null)
            return null;
        let items = value.split(',');
        return items.length > 0 ? items : null;
    }
    matchString(value, search) {
        if (value == null && search == null)
            return true;
        if (value == null || search == null)
            return false;
        return value.toLowerCase().indexOf(search.toLowerCase()) >= 0;
    }
    matchSearch(status, search) {
        if (this.matchString(status.id, search))
            return true;
        if (this.matchString(status.type, search))
            return true;
        if (this.matchString(status.key, search))
            return true;
        if (this.matchString(status.status, search))
            return true;
        return false;
    }
    composeFilter(filter) {
        filter = filter || new pip_services3_commons_node_1.FilterParams();
        let id = filter.getAsNullableString('id');
        let type = filter.getAsNullableString('type');
        let status = filter.getAsNullableString('status');
        let statuses = this.toStringArray(filter.getAsNullableString('statuses'));
        let key = filter.getAsNullableString('key');
        let recovered = filter.getAsNullableBoolean('recovered');
        let expired = filter.getAsNullableBoolean('expired');
        let fromTime = filter.getAsNullableDateTime('from_time');
        let toTime = filter.getAsNullableDateTime('to_time');
        let search = filter.getAsNullableString('search');
        let now = new Date().getTime();
        return (item) => {
            if (id && item.id != id)
                return false;
            if (type && item.type != type)
                return false;
            if (status && item.status != status)
                return false;
            if (statuses && _.indexOf(statuses, item.status) < 0)
                return false;
            if (key && item.key != key)
                return false;
            if (recovered == true && (item.recovery_time == null || item.recovery_time.getTime() >= now))
                return false;
            if (expired == true && (item.expiration_time == null || item.expiration_time.getTime() >= now))
                return false;
            if (fromTime && item.start_time.getTime() < fromTime.getTime())
                return false;
            if (toTime && item.start_time.getTime() > toTime.getTime())
                return false;
            if (search != null && !this.matchSearch(item, search))
                return false;
            return true;
        };
    }
    getPageByFilter(correlationId, filter, paging, callback) {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
    }
    getActiveById(correlationId, id, callback) {
        let items = this._items.filter((x) => {
            return x.id == id
                && (x.status != version1_1.ProcessStatusV1.Aborted && x.status != version1_1.ProcessStatusV1.Completed);
        });
        let item = items.length > 0 ? items[0] : null;
        if (item != null)
            this._logger.trace(correlationId, "Retrieved item %s", id);
        else
            this._logger.trace(correlationId, "Cannot find item by %s", id);
        callback(null, item);
    }
    getActiveByKey(correlationId, processType, processKey, callback) {
        let items = this._items.filter((x) => {
            return x.type == processType && x.key == processKey
                && (x.status != version1_1.ProcessStatusV1.Aborted && x.status != version1_1.ProcessStatusV1.Completed);
        });
        let item = items.length > 0 ? items[0] : null;
        if (item != null)
            this._logger.trace(correlationId, "Retrieved item %s and %s", processType, processKey);
        else
            this._logger.trace(correlationId, "Cannot find item by %s and %s", processType, processKey);
        callback(null, item);
    }
    getActiveByRequestId(correlationId, requestId, callback) {
        let items = this._items.filter((x) => {
            return x.request_id == requestId
                && (x.status != version1_1.ProcessStatusV1.Aborted && x.status != version1_1.ProcessStatusV1.Completed);
        });
        let item = items.length > 0 ? items[0] : null;
        if (item != null)
            this._logger.trace(correlationId, "Retrieved item %s", requestId);
        else
            this._logger.trace(correlationId, "Cannot find item by %s", requestId);
        callback(null, item);
    }
    truncate(correlationId, timeout, callback) {
        let filterFunc = (item) => {
            return item.status == version1_1.ProcessStatusV1.Completed
                || item.status == version1_1.ProcessStatusV1.Aborted;
        };
        super.deleteByFilter(correlationId, filterFunc, callback);
    }
}
exports.ProcessStatesMemoryPersistence = ProcessStatesMemoryPersistence;
//# sourceMappingURL=ProcessStatesMemoryPersistence.js.map