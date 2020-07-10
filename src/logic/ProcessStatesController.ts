// let async = require('async');

// import { ConfigParams } from 'pip-services3-commons-node';
// import { IConfigurable } from 'pip-services3-commons-node';
// import { IReferences } from 'pip-services3-commons-node';
// import { Descriptor } from 'pip-services3-commons-node';
// import { IReferenceable } from 'pip-services3-commons-node';
// import { DependencyResolver } from 'pip-services3-commons-node';
// import { FilterParams } from 'pip-services3-commons-node';
// import { PagingParams } from 'pip-services3-commons-node';
// import { DataPage } from 'pip-services3-commons-node';
// import { ICommandable } from 'pip-services3-commons-node';
// import { CommandSet } from 'pip-services3-commons-node';
// import { BadRequestException } from 'pip-services3-commons-node';

// import { ProcessStateV1 } from '../data/version1/ProcessStateV1';
// import { ProcessStateStateV1 } from '../data/version1/ProcessStateStateV1';
// import { IProcessStatesPersistence } from '../persistence/IProcessStatesPersistence';
// import { IProcessStatesController } from './IProcessStatesController';
// import { ProcessStatesCommandSet } from './ProcessStatesCommandSet';
// import { UnauthorizedException } from 'pip-services3-commons-node/obj/src/errors/UnauthorizedException';

// export class ProcessStatesController implements  IConfigurable, IReferenceable, ICommandable, IProcessStatesController {
//     private static _defaultConfig: ConfigParams = ConfigParams.fromTuples(
//         'dependencies.persistence', 'pip-services-processstates:persistence:*:*:1.0'
//     );

//     private _dependencyResolver: DependencyResolver = new DependencyResolver(ProcessStatesController._defaultConfig);
//     private _persistence: IProcessStatesPersistence;
//     private _commandSet: ProcessStatesCommandSet;

//     public configure(config: ConfigParams): void {
//         this._dependencyResolver.configure(config);
//     }

//     public setReferences(references: IReferences): void {
//         this._dependencyResolver.setReferences(references);
//         this._persistence = this._dependencyResolver.getOneRequired<IProcessStatesPersistence>('persistence');
//     }

//     public getCommandSet(): CommandSet {
//         if (this._commandSet == null)
//             this._commandSet = new ProcessStatesCommandSet(this);
//         return this._commandSet;
//     }
    
//     public getStates(correlationId: string, filter: FilterParams, paging: PagingParams, 
//         callback: (err: any, page: DataPage<ProcessStateV1>) => void): void {
//         this._persistence.getPageByFilter(correlationId, filter, paging, callback);
//     }

//     public getStateById(correlationId: string, id: string, customerId: string,
//         callback: (err: any, state: ProcessStateV1) => void): void {
//         this._persistence.getOneById(correlationId, id, (err, state) => {
//             // Do not allow to access state of different customer
//             if (state && state.customer_id != customerId)
//                 state = null;
            
//             callback(err, state);
//         });
//     }

//     public createState(correlationId: string, state: ProcessStateV1, 
//         callback: (err: any, process_state: ProcessStateV1) => void): void {

//         state.state = state.state || ProcessStateStateV1.Ok;
//         state.create_time = new Date();
//         state.update_time = new Date();

//         this._persistence.create(correlationId, state, callback);
//     }

//     public updateState(correlationId: string, state: ProcessStateV1, 
//         callback: (err: any, process_state: ProcessStateV1) => void): void {

//         let newState: ProcessStateV1;

//         state.state = state.state || ProcessStateStateV1.Ok;
//         state.update_time = new Date();
    
//         async.series([
//             (callback) => {
//                 this._persistence.getOneById(correlationId, state.id, (err, data) => {
//                     if (err == null && data && data.customer_id != state.customer_id) {
//                         err = new BadRequestException(correlationId, 'WRONG_CUST_ID', 'Wrong process state customer id')
//                             .withDetails('id', state.id)
//                             .withDetails('customer_id', state.customer_id);
//                     }
//                     callback(err);
//                 });
//             },
//             (callback) => {
//                 this._persistence.update(correlationId, state, (err, data) => {
//                     newState = data;
//                     callback(err);
//                 });
//             }
//         ], (err) => {
//             callback(err, newState);
//         });
//     }

//     public deleteStateById(correlationId: string, id: string, customerId: string,
//         callback: (err: any, state: ProcessStateV1) => void): void {  

//         let oldState: ProcessStateV1;

//         async.series([
//             (callback) => {
//                 this._persistence.getOneById(correlationId, id, (err, data) => {
//                     if (err == null && data && data.customer_id != customerId) {
//                         err = new BadRequestException(correlationId, 'WRONG_CUST_ID', 'Wrong process state customer id')
//                             .withDetails('id', id)
//                             .withDetails('customer_id', customerId);
//                     }
//                     callback(err);
//                 });
//             },
//             (callback) => {
//                 this._persistence.deleteById(correlationId, id, (err, data) => {
//                     oldState = data;
//                     callback(err);
//                 });
//             }
//         ], (err) => {
//             if (callback) callback(err, oldState);
//         });
//     }

// }
