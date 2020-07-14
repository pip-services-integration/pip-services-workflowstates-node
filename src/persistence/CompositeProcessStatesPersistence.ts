const _ = require('lodash');
const async = require('async');

import { FilterParams, IReferences } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { ConfigParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IConfigurable } from 'pip-services3-commons-node';
import { IReferenceable } from 'pip-services3-commons-node';
import { ICleanable } from 'pip-services3-commons-node';

import { ProcessStateV1 } from '../data/version1/ProcessStateV1';
import { IProcessStatesPersistence } from './IProcessStatesPersistence';
import { ProcessStatusV1 } from '../data/version1';

export class CompositeProcessStatesPersistence
    implements IProcessStatesPersistence, IConfigurable, IReferenceable, ICleanable {
    protected _activePersistence: IProcessStatesPersistence;
    protected _allPersistence: IProcessStatesPersistence;

    protected constructor(activePersistence: IProcessStatesPersistence,
        allPersistence: IProcessStatesPersistence) {
        this._activePersistence = activePersistence;
        this._allPersistence = allPersistence;
    }

    public configure(config: ConfigParams): void {
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

    public setReferences(references: IReferences): void {
        if (_.isFunction(this._allPersistence['setReferences']))
            this._allPersistence['setReferences'](references);

        if (_.isFunction(this._activePersistence['setReferences']))
            this._activePersistence['setReferences'](references);
    }

    public clear(correlationId, callback: (err: any) => void): void {
        async.parallel([
            (callback) => {
                this._activePersistence['clear'](correlationId, callback);
            },
            (callback) => {
                this._activePersistence['clear'](correlationId, callback);
            }
        ], (err) => {
            if (callback) callback(err);
        });
    }

    private toStringArray(value: string): string[] {
        if (value == null) return null;
        let items = value.split(',');
        return items.length > 0 ? items : null;
    }

    public isActiveQuery(filter: FilterParams): boolean {
        if (filter == null)
            return false;

        let recoverd = filter.getAsNullableBoolean('recoverd');
        let expired = filter.getAsNullableBoolean('expired');
        if (recoverd || expired)
            return true;

        let status = filter.getAsNullableString('status');
        if (status != null) {
            return status != ProcessStatusV1.Completed
                && status != ProcessStatusV1.Aborted;
        }

        let statuses = this.toStringArray(filter.getAsNullableString('statuses'));
        if (statuses != null) {
            return _.indexOf(statuses, ProcessStatusV1.Completed) < 0
                && _.indexOf(statuses, ProcessStatusV1.Aborted);
        }

        return false;
    }

    public getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<ProcessStateV1>) => void): void {
        if (this.isActiveQuery(filter))
            this._activePersistence.getPageByFilter(correlationId, filter, paging, callback);
        else
            this._allPersistence.getPageByFilter(correlationId, filter, paging, callback);
    }

    public getOneById(correlationId: string, id: string, 
        callback: (err: any, item: ProcessStateV1) => void): void {
        this._allPersistence.getOneById(correlationId, id, callback);
    }

    public getListByIds(correlationId: string, ids: string[], 
        callback: (err: any, items: ProcessStateV1[]) => void): void {
        this._allPersistence.getListByIds(correlationId, ids, callback);
    }

    public getActiveById(correlationId: string, id: string, 
        callback: (err: any, item: ProcessStateV1) => void): void {
        this._activePersistence.getActiveById(correlationId, id, callback);     
    }
            
    public getActiveByKey(correlationId: string, processType: string, processKey: string, 
        callback: (err: any, item: ProcessStateV1) => void): void {
        this._activePersistence.getActiveByKey(correlationId, processType, processKey, callback);     
    }

    public getActiveByrequestId(correlationId: string, requestId: string, 
        callback: (err: any, item: ProcessStateV1) => void): void {
        this._activePersistence.getActiveByrequestId(correlationId, requestId, callback);     
    }
            
    public create(correlationId: string, item: ProcessStateV1, 
        callback: (err: any, item: ProcessStateV1) => void): void {
        let activeItem: ProcessStateV1;
        let resultItem: ProcessStateV1;

        async.series([
            (callback) => {
                if (item.status == ProcessStatusV1.Starting
                    || item.status == ProcessStatusV1.Running
                    || item.status == ProcessStatusV1.Suspended
                    || item.status == ProcessStatusV1.Failed) {
                    this._activePersistence.create(correlationId, item, (err, result) => {
                        activeItem = result;
                        callback(err);
                    });
                } else callback();                
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
            if (callback) callback(err, resultItem);
        });
    }

    public update(correlationId: string, item: ProcessStateV1, 
        callback: (err: any, item: ProcessStateV1) => void): void {
        let resultItem: ProcessStateV1;

        async.parallel([
            (callback) => {
                if (item.status == ProcessStatusV1.Starting
                    || item.status == ProcessStatusV1.Running
                    || item.status == ProcessStatusV1.Suspended
                    || item.status == ProcessStatusV1.Failed) {
                    this._activePersistence.update(correlationId, item, callback);
                } else {
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
            if (callback) callback(err, resultItem);
        });
    }

    public deleteById(correlationId: string, id: string,
        callback: (err: any, item: ProcessStateV1) => void): void {
        let resultItem: ProcessStateV1;

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
            if (callback) callback(err, resultItem);
        })
    }

    public deleteByIds(correlationId: string, ids: string[],
        callback: (err: any) => void): void {
        async.series([
            (callback) => {
                this._activePersistence.deleteByIds(correlationId, ids, callback);
            },
            (callback) => {
                this._allPersistence.deleteByIds(correlationId, ids, callback);
            }
        ], (err) => {
            if (callback) callback(err);
        })
    }

    public truncate(correlationId: string, timeout: number,
        callback: (err: any) => void): void {
        this._allPersistence.truncate(correlationId, timeout, callback);
    }
}
