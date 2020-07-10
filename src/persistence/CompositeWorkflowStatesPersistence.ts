const _ = require('lodash');
const async = require('async');

import { FilterParams, IReferences } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { ConfigParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IConfigurable } from 'pip-services3-commons-node';
import { IReferenceable } from 'pip-services3-commons-node';
import { ICleanable } from 'pip-services3-commons-node';

import { WorkflowStateV1 } from '../data/version1/WorkflowStateV1';
import { IWorkflowStatesPersistence } from './IWorkflowStatesPersistence';
import { WorkflowStatusV1 } from '../data/version1';

export class CompositeWorkflowStatesPersistence
    implements IWorkflowStatesPersistence, IConfigurable, IReferenceable, ICleanable {
    protected _openPersistence: IWorkflowStatesPersistence;
    protected _allPersistence: IWorkflowStatesPersistence;

    protected constructor(openPersistence: IWorkflowStatesPersistence,
        allPersistence: IWorkflowStatesPersistence) {
        this._openPersistence = openPersistence;
        this._allPersistence = allPersistence;
    }

    public configure(config: ConfigParams): void {
        if (_.isFunction(this._allPersistence['configure']))
            this._allPersistence['configure'](config);

        if (_.isFunction(this._openPersistence['configure'])) {
            let collection = config.getAsNullableString('collection');
            if (collection != null && collection.length > 0)
                config.setAsObject('collection', 'open_' + collection);

            this._openPersistence['configure'](config);

            if (collection != null && collection.length > 0)
                config.setAsObject('collection', collection);
        }
    }

    public setReferences(references: IReferences): void {
        if (_.isFunction(this._allPersistence['setReferences']))
            this._allPersistence['setReferences'](references);

        if (_.isFunction(this._openPersistence['setReferences']))
            this._openPersistence['setReferences'](references);
    }

    public clear(correlationId, callback: (err: any) => void): void {
        async.parallel([
            (callback) => {
                this._openPersistence['clear'](correlationId, callback);
            },
            (callback) => {
                this._openPersistence['clear'](correlationId, callback);
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

    public isOpenQuery(filter: FilterParams): boolean {
        if (filter == null)
            return false;

        let compensated = filter.getAsNullableBoolean('compensated');
        let expired = filter.getAsNullableBoolean('expired');
        if (compensated || expired)
            return true;

        let status = filter.getAsNullableString('status');
        if (status != null) {
            return status != WorkflowStatusV1.Completed
                && status != WorkflowStatusV1.Aborted;
        }

        let statuses = this.toStringArray(filter.getAsNullableString('statuses'));
        if (statuses != null) {
            return _.indexOf(statuses, WorkflowStatusV1.Completed) < 0
                && _.indexOf(statuses, WorkflowStatusV1.Aborted);
        }

        return false;
    }

    public getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<WorkflowStateV1>) => void): void {
        if (this.isOpenQuery(filter))
            this._openPersistence.getPageByFilter(correlationId, filter, paging, callback);
        else
            this._allPersistence.getPageByFilter(correlationId, filter, paging, callback);
    }

    public getOneById(correlationId: string, id: string, 
        callback: (err: any, item: WorkflowStateV1) => void): void {
        this._allPersistence.getOneById(correlationId, id, callback);
    }

    public getListByIds(correlationId: string, ids: string[], 
        callback: (err: any, items: WorkflowStateV1[]) => void): void {
        this._allPersistence.getListByIds(correlationId, ids, callback);
    }

    public getOpenById(correlationId: string, id: string, 
        callback: (err: any, item: WorkflowStateV1) => void): void {
        this._openPersistence.getOpenById(correlationId, id, callback);     
    }
            
    public getOpenByKey(correlationId: string, workflowType: string, workflowKey: string, 
        callback: (err: any, item: WorkflowStateV1) => void): void {
        this._openPersistence.getOpenByKey(correlationId, workflowType, workflowKey, callback);     
    }

    public getOpenByInitiatorId(correlationId: string, initiatorId: string, 
        callback: (err: any, item: WorkflowStateV1) => void): void {
        this._openPersistence.getOpenByInitiatorId(correlationId, initiatorId, callback);     
    }
            
    public create(correlationId: string, item: WorkflowStateV1, 
        callback: (err: any, item: WorkflowStateV1) => void): void {
        let openItem: WorkflowStateV1;
        let resultItem: WorkflowStateV1;

        async.series([
            (callback) => {
                if (item.status == WorkflowStatusV1.Starting
                    || item.status == WorkflowStatusV1.Active
                    || item.status == WorkflowStatusV1.WaitingForResponse
                    || item.status == WorkflowStatusV1.Failed) {
                    this._openPersistence.create(correlationId, item, (err, result) => {
                        openItem = result;
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
            if (err && openItem != null && resultItem == null) {
                this._openPersistence.deleteById(correlationId, openItem.id, (err) => {
                    // Do nothing...
                });
            }
            if (callback) callback(err, resultItem);
        });
    }

    public update(correlationId: string, item: WorkflowStateV1, 
        callback: (err: any, item: WorkflowStateV1) => void): void {
        let resultItem: WorkflowStateV1;

        async.parallel([
            (callback) => {
                if (item.status == WorkflowStatusV1.Starting
                    || item.status == WorkflowStatusV1.Active
                    || item.status == WorkflowStatusV1.WaitingForResponse
                    || item.status == WorkflowStatusV1.Failed) {
                    this._openPersistence.update(correlationId, item, callback);
                } else {
                    this._openPersistence.deleteById(correlationId, item.id, callback);
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
        callback: (err: any, item: WorkflowStateV1) => void): void {
        let resultItem: WorkflowStateV1;

        async.series([
            (callback) => {
                this._openPersistence.deleteById(correlationId, id, callback);
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
                this._openPersistence.deleteByIds(correlationId, ids, callback);
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
