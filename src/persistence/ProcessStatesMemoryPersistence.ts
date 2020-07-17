let _ = require('lodash');

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IdentifiableMemoryPersistence } from 'pip-services3-data-node';

import { ProcessStateV1 } from '../data/version1/ProcessStateV1';
import { IProcessStatesPersistence } from './IProcessStatesPersistence';
import { ProcessStatusV1 } from '../data/version1';

export class ProcessStatesMemoryPersistence 
    extends IdentifiableMemoryPersistence<ProcessStateV1, string> 
    implements IProcessStatesPersistence {

    constructor() {
        super();
    }

    private toStringArray(value: string): string[] {
        if (value == null) return null;
        let items = value.split(',');
        return items.length > 0 ? items : null;
    }

    private matchString(value: string, search: string): boolean {
        if (value == null && search == null)
            return true;
        if (value == null || search == null)
            return false;
        return value.toLowerCase().indexOf(search.toLowerCase()) >= 0;
    }

    private matchSearch(status: ProcessStateV1, search: string): boolean {
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

    private composeFilter(filter: FilterParams): any {
        filter = filter || new FilterParams();
        
        let id = filter.getAsNullableString('id');
        let type = filter.getAsNullableString('type');
        let status = filter.getAsNullableString('status');
        let statuses = this.toStringArray(filter.getAsNullableString('statuses'));
        let key = filter.getAsNullableString('key');
        let recoverd = filter.getAsNullableBoolean('recovered');
        let expired = filter.getAsNullableBoolean('expired');
        let fromTime = filter.getAsNullableDateTime('from_time');
        let toTime = filter.getAsNullableDateTime('to_time');
        let search = filter.getAsNullableString('search');

        let now = new Date().getTime();
        
        return (item: ProcessStateV1) => {
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
            if (recoverd == true && (item.recovery_time == null || item.recovery_time.getTime() >= now)) 
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

    public getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<ProcessStateV1>) => void): void {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
    }
            
    public getActiveById(correlationId: string, id: string, 
        callback: (err: any, item: ProcessStateV1) => void): void {
        let items = this._items.filter((x) => {
            return x.id == id
                && (x.status != ProcessStatusV1.Aborted && x.status != ProcessStatusV1.Completed);
        });
        let item = items.length > 0 ? items[0] : null;

        if (item != null)
            this._logger.trace(correlationId, "Retrieved item %s", id);
        else
            this._logger.trace(correlationId, "Cannot find item by %s", id);

        callback(null, item);
    
    }

    public getActiveByKey(correlationId: string, processType: string, processKey: string, 
        callback: (err: any, item: ProcessStateV1) => void): void {
        let items = this._items.filter((x) => {
            return x.type == processType && x.key == processKey
                && (x.status != ProcessStatusV1.Aborted && x.status != ProcessStatusV1.Completed);
        });
        let item = items.length > 0 ? items[0] : null;

        if (item != null)
            this._logger.trace(correlationId, "Retrieved item %s and %s", processType, processKey);
        else
            this._logger.trace(correlationId, "Cannot find item by %s and %s", processType, processKey);

        callback(null, item);
    
    }

    public getActiveByRequestId(correlationId: string, requestId: string, 
        callback: (err: any, item: ProcessStateV1) => void): void {
        let items = this._items.filter((x) => {
            return x.request_id == requestId
                && (x.status != ProcessStatusV1.Aborted && x.status != ProcessStatusV1.Completed);
        });
        let item = items.length > 0 ? items[0] : null;

        if (item != null)
            this._logger.trace(correlationId, "Retrieved item %s", requestId);
        else
            this._logger.trace(correlationId, "Cannot find item by %s", requestId);

        callback(null, item);    
    }
            
    public truncate(correlationId: string, timeout: number,
        callback: (err: any) => void): void {
        let filterFunc = (item: ProcessStateV1): boolean => {
            return item.status == ProcessStatusV1.Completed
                || item.status == ProcessStatusV1.Aborted;
        }
        super.deleteByFilter(correlationId, filterFunc, callback);
    }
}
