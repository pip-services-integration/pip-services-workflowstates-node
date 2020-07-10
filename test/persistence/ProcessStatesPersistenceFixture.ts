// let _ = require('lodash');
// let async = require('async');
// let assert = require('chai').assert;

// import { FilterParams } from 'pip-services3-commons-node';
// import { PagingParams } from 'pip-services3-commons-node';

// import { ProcessStateV1 } from '../../src/data/version1/ProcessStateV1';
// import { ProcessStateTypeV1 } from '../../src/data/version1/ProcessStateTypeV1';
// import { ProcessStateStateV1 } from '../../src/data/version1/ProcessStateStateV1';

// import { IProcessStatesPersistence } from '../../src/persistence/IProcessStatesPersistence';
// import { AddressV1 } from '../../src/data/version1/ShippingDetailsV1';

// let STATE1: ProcessStateV1 = {
//     id: '1',
//     customer_id: '1',
//     type: ProcessStateTypeV1.Visa,
//     number: '4032036094894795',
//     expire_month: 1,
//     expire_year: 2021,
//     first_name: 'Bill',
//     last_name: 'Gates',
//     billing_address: {
//         line1: '2345 Swan Rd',
//         city: 'Tucson',
//         state: 'AZ',
//         postal_code: '85710',
//         country_code: 'US'
//     },
//     ccv: '213',
//     name: 'Test State 1',
//     saved: true,
//     default: true,
//     state: ProcessStateStateV1.Ok
// };
// let STATE2: ProcessStateV1 = {
//     id: '2',
//     customer_id: '1',
//     type: ProcessStateTypeV1.Visa,
//     number: '4032037578262780',
//     expire_month: 4,
//     expire_year: 2028,
//     first_name: 'Joe',
//     last_name: 'Dow',
//     billing_address: {
//         line1: '123 Broadway Blvd',
//         city: 'New York',
//         state: 'NY',
//         postal_code: '123001',
//         country_code: 'US'
//     },
//     name: 'Test State 2',
//     saved: true,
//     default: false,
//     state: ProcessStateStateV1.Expired
// };
// let STATE3: ProcessStateV1 = {
//     id: '3',
//     customer_id: '2',
//     type: ProcessStateTypeV1.Visa,
//     number: '4032037578262780',
//     expire_month: 5,
//     expire_year: 2022,
//     first_name: 'Steve',
//     last_name: 'Jobs',
//     billing_address: {
//         line1: '234 6th Str',
//         city: 'Los Angeles',
//         state: 'CA',
//         postal_code: '65320',
//         country_code: 'US'
//     },
//     ccv: '124',
//     name: 'Test State 2',
//     state: ProcessStateStateV1.Ok
// };

// export class ProcessStatesPersistenceFixture {
//     private _persistence: IProcessStatesPersistence;
    
//     constructor(persistence) {
//         assert.isNotNull(persistence);
//         this._persistence = persistence;
//     }

//     private testCreateProcessStates(done) {
//         async.series([
//         // Create one process state
//             (callback) => {
//                 this._persistence.create(
//                     null,
//                     STATE1,
//                     (err, processState) => {
//                         assert.isNull(err);

//                         assert.isObject(processState);
//                         assert.equal(processState.first_name, STATE1.first_name);
//                         assert.equal(processState.last_name, STATE1.last_name);
//                         assert.equal(processState.expire_year, STATE1.expire_year);
//                         assert.equal(processState.customer_id, STATE1.customer_id);

//                         callback();
//                     }
//                 );
//             },
//         // Create another process state
//             (callback) => {
//                 this._persistence.create(
//                     null,
//                     STATE2,
//                     (err, processState) => {
//                         assert.isNull(err);

//                         assert.isObject(processState);
//                         assert.equal(processState.first_name, STATE2.first_name);
//                         assert.equal(processState.last_name, STATE2.last_name);
//                         assert.equal(processState.expire_year, STATE2.expire_year);
//                         assert.equal(processState.customer_id, STATE2.customer_id);

//                         callback();
//                     }
//                 );
//             },
//         // Create yet another process state
//             (callback) => {
//                 this._persistence.create(
//                     null,
//                     STATE3,
//                     (err, processState) => {
//                         assert.isNull(err);

//                         assert.isObject(processState);
//                         assert.equal(processState.first_name, STATE3.first_name);
//                         assert.equal(processState.last_name, STATE3.last_name);
//                         assert.equal(processState.expire_year, STATE3.expire_year);
//                         assert.equal(processState.customer_id, STATE3.customer_id);

//                         callback();
//                     }
//                 );
//             }
//         ], done);
//     }
                
//     testCrudOperations(done) {
//         let processState1: ProcessStateV1;

//         async.series([
//         // Create items
//             (callback) => {
//                 this.testCreateProcessStates(callback);
//             },
//         // Get all process states
//             (callback) => {
//                 this._persistence.getPageByFilter(
//                     null,
//                     new FilterParams(),
//                     new PagingParams(),
//                     (err, page) => {
//                         assert.isNull(err);

//                         assert.isObject(page);
//                         assert.lengthOf(page.data, 3);

//                         processState1 = page.data[0];

//                         callback();
//                     }
//                 );
//             },
//         // Update the process state
//             (callback) => {
//                 processState1.name = 'Updated State 1';

//                 this._persistence.update(
//                     null,
//                     processState1,
//                     (err, processState) => {
//                         assert.isNull(err);

//                         assert.isObject(processState);
//                         assert.equal(processState.name, 'Updated State 1');
//                         // PayPal changes id on update
//                         //!!assert.equal(processState.id, processState1.id);

//                         processState1 = processState;

//                         callback();
//                     }
//                 );
//             },
//         // Delete process state
//             (callback) => {
//                 this._persistence.deleteById(
//                     null,
//                     processState1.id,
//                     (err) => {
//                         assert.isNull(err);

//                         callback();
//                     }
//                 );
//             },
//         // Try to get delete process state
//             (callback) => {
//                 this._persistence.getOneById(
//                     null,
//                     processState1.id,
//                     (err, processState) => {
//                         assert.isNull(err);

//                         assert.isNull(processState || null);

//                         callback();
//                     }
//                 );
//             }
//         ], done);
//     }

//     testGetWithFilter(done) {
//         async.series([
//         // Create process states
//             (callback) => {
//                 this.testCreateProcessStates(callback);
//             },
//         // Get process states filtered by customer id
//             (callback) => {
//                 this._persistence.getPageByFilter(
//                     null,
//                     FilterParams.fromValue({
//                         customer_id: '1'
//                     }),
//                     new PagingParams(),
//                     (err, page) => {
//                         assert.isNull(err);

//                         assert.isObject(page);
//                         assert.lengthOf(page.data, 2);

//                         callback();
//                     }
//                 );
//             },
//         // Get process states by state
//             (callback) => {
//                 this._persistence.getPageByFilter(
//                     null,
//                     FilterParams.fromValue({
//                         state: 'ok'
//                     }),
//                     new PagingParams(),
//                     (err, page) => {
//                         assert.isNull(err);

//                         assert.isObject(page);
//                         // PayPal calculate states by itself
//                         //assert.lengthOf(page.data, 2);

//                         callback();
//                     }
//                 );
//             },
//         // Get process states by saved
//             (callback) => {
//                 this._persistence.getPageByFilter(
//                     null,
//                     FilterParams.fromValue({
//                         saved: true
//                     }),
//                     new PagingParams(),
//                     (err, page) => {
//                         assert.isNull(err);

//                         assert.isObject(page);
//                         assert.lengthOf(page.data, 2);

//                         callback();
//                     }
//                 );
//             },
//         // Get process states by ids
//             (callback) => {
//                 this._persistence.getPageByFilter(
//                     null,
//                     FilterParams.fromValue({
//                         ids: ['1', '3']
//                     }),
//                     new PagingParams(),
//                     (err, page) => {
//                         assert.isNull(err);

//                         assert.isObject(page);
//                         // PayPal manages ids by itself
//                         //assert.lengthOf(page.data, 2);

//                         callback();
//                     }
//                 );
//             },
//         ], done);
//     }

// }
