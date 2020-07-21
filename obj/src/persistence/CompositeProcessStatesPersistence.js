"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require('lodash');
const async = require('async');
const version1_1 = require("../data/version1");
class CompositeProcessStatesPersistence {
    constructor(activePersistence, allPersistence) {
        this._opened = false;
        this._activePersistence = activePersistence;
        this._allPersistence = allPersistence;
    }
    isOpen() {
        return this._opened;
    }
    open(correlationId, callback) {
        this._activePersistence.open(correlationId, (err) => {
            if (err) {
                callback(err);
                return;
            }
            this._allPersistence.open(correlationId, (err) => {
                if (err) {
                    callback(err);
                    this._activePersistence.close(correlationId);
                    return;
                }
                this._opened = true;
                callback(null);
            });
        });
    }
    close(correlationId, callback) {
        this._activePersistence.close(correlationId, (err) => {
            if (err) {
                callback(err);
                this._allPersistence.close(correlationId);
                return;
            }
            this._allPersistence.close(correlationId, (err) => {
                this._opened = false;
                callback(err);
            });
        });
    }
    configure(config) {
        if (_.isFunction(this._allPersistence['configure']))
            this._allPersistence['configure'](config);
        if (_.isFunction(this._activePersistence['configure'])) {
            let collection = config.getAsNullableString('collection');
            if (collection != null && collection.length > 0)
                config.setAsObject('collection', 'active_' + collection);
            this._activePersistence['configure'](config);
            if (collection != null && collection.length > 0)
                config.setAsObject('collection', collection);
        }
    }
    setReferences(references) {
        if (_.isFunction(this._allPersistence['setReferences']))
            this._allPersistence['setReferences'](references);
        if (_.isFunction(this._activePersistence['setReferences']))
            this._activePersistence['setReferences'](references);
    }
    clear(correlationId, callback) {
        async.parallel([
            (callback) => {
                this._activePersistence['clear'](correlationId, callback);
            },
            (callback) => {
                this._allPersistence['clear'](correlationId, callback);
            }
        ], (err) => {
            if (callback)
                callback(err);
        });
    }
    toStringArray(value) {
        if (value == null)
            return null;
        let items = value.split(',');
        return items.length > 0 ? items : null;
    }
    isActiveQuery(filter) {
        if (filter == null)
            return false;
        let recoverd = filter.getAsNullableBoolean('recoverd');
        let expired = filter.getAsNullableBoolean('expired');
        if (recoverd || expired)
            return true;
        let status = filter.getAsNullableString('status');
        if (status != null) {
            return status != version1_1.ProcessStatusV1.Completed
                && status != version1_1.ProcessStatusV1.Aborted;
        }
        let statuses = this.toStringArray(filter.getAsNullableString('statuses'));
        if (statuses != null) {
            return _.indexOf(statuses, version1_1.ProcessStatusV1.Completed) < 0
                && _.indexOf(statuses, version1_1.ProcessStatusV1.Aborted);
        }
        return false;
    }
    getPageByFilter(correlationId, filter, paging, callback) {
        if (this.isActiveQuery(filter))
            this._activePersistence.getPageByFilter(correlationId, filter, paging, callback);
        else
            this._allPersistence.getPageByFilter(correlationId, filter, paging, callback);
    }
    getOneById(correlationId, id, callback) {
        this._allPersistence.getOneById(correlationId, id, callback);
    }
    getListByIds(correlationId, ids, callback) {
        this._allPersistence.getListByIds(correlationId, ids, callback);
    }
    getActiveById(correlationId, id, callback) {
        this._activePersistence.getActiveById(correlationId, id, callback);
    }
    getActiveByKey(correlationId, processType, processKey, callback) {
        this._activePersistence.getActiveByKey(correlationId, processType, processKey, callback);
    }
    getActiveByRequestId(correlationId, requestId, callback) {
        this._activePersistence.getActiveByRequestId(correlationId, requestId, callback);
    }
    create(correlationId, item, callback) {
        let activeItem;
        let resultItem;
        async.series([
            (callback) => {
                if (item.status == version1_1.ProcessStatusV1.Starting
                    || item.status == version1_1.ProcessStatusV1.Running
                    || item.status == version1_1.ProcessStatusV1.Suspended
                    || item.status == version1_1.ProcessStatusV1.Failed) {
                    this._activePersistence.create(correlationId, item, (err, result) => {
                        activeItem = result;
                        callback(err);
                    });
                }
                else
                    callback();
            },
            (callback) => {
                this._allPersistence.create(correlationId, item, (err, result) => {
                    resultItem = result;
                    callback(err);
                });
            }
        ], (err) => {
            if (err && activeItem != null && resultItem == null) {
                this._activePersistence.deleteById(correlationId, activeItem.id, (err) => {
                    // Do nothing...
                });
            }
            if (callback)
                callback(err, resultItem);
        });
    }
    update(correlationId, item, callback) {
        let resultItem;
        async.parallel([
            (callback) => {
                if (item.status == version1_1.ProcessStatusV1.Starting
                    || item.status == version1_1.ProcessStatusV1.Running
                    || item.status == version1_1.ProcessStatusV1.Suspended
                    || item.status == version1_1.ProcessStatusV1.Failed) {
                    this._activePersistence.update(correlationId, item, callback);
                }
                else {
                    this._activePersistence.deleteById(correlationId, item.id, callback);
                }
            },
            (callback) => {
                this._allPersistence.update(correlationId, item, (err, result) => {
                    resultItem = result;
                    callback(err);
                });
            }
        ], (err) => {
            if (callback)
                callback(err, resultItem);
        });
    }
    deleteById(correlationId, id, callback) {
        let resultItem;
        async.series([
            (callback) => {
                this._activePersistence.deleteById(correlationId, id, callback);
            },
            (callback) => {
                this._allPersistence.deleteById(correlationId, id, (err, result) => {
                    resultItem = result;
                    callback(err);
                });
            }
        ], (err) => {
            if (callback)
                callback(err, resultItem);
        });
    }
    deleteByIds(correlationId, ids, callback) {
        async.series([
            (callback) => {
                this._activePersistence.deleteByIds(correlationId, ids, callback);
            },
            (callback) => {
                this._allPersistence.deleteByIds(correlationId, ids, callback);
            }
        ], (err) => {
            if (callback)
                callback(err);
        });
    }
    truncate(correlationId, timeout, callback) {
        this._allPersistence.truncate(correlationId, timeout, callback);
    }
}
exports.CompositeProcessStatesPersistence = CompositeProcessStatesPersistence;
//# sourceMappingURL=CompositeProcessStatesPersistence.js.map