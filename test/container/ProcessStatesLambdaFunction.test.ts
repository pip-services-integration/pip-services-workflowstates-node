// let _ = require('lodash');
// let async = require('async');
// let assert = require('chai').assert;

// import { Descriptor } from 'pip-services3-commons-node';
// import { ConfigParams } from 'pip-services3-commons-node';
// import { References } from 'pip-services3-commons-node';
// import { ConsoleLogger } from 'pip-services3-components-node';

// import { ProcessStateV1 } from '../../src/data/version1/ProcessStateV1';
// import { ProcessStateTypeV1 } from '../../src/data/version1/ProcessStateTypeV1';
// import { ProcessStateStateV1 } from '../../src/data/version1/ProcessStateStateV1';
// import { ProcessStatesMemoryPersistence } from '../../src/persistence/ProcessStatesMemoryPersistence';
// import { ProcessStatesController } from '../../src/logic/ProcessStatesController';
// import { ProcessStatesLambdaFunction } from '../../src/container/ProcessStatesLambdaFunction';

// let STATE1: ProcessStateV1 = {
//     id: '1',
//     customer_id: '1',
//     type: ProcessStateTypeV1.Visa,
//     number: '1111111111111111',
//     expire_month: 1,
//     expire_year: 2021,
//     first_name: 'Bill',
//     last_name: 'Gates',
//     billing_address: {
//         line1: '2345 Swan Rd',
//         city: 'Tucson',
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
//     number: '2222222222222222',
//     expire_month: 4,
//     expire_year: 2028,
//     first_name: 'Joe',
//     last_name: 'Dow',
//     billing_address: {
//         line1: '123 Broadway Blvd',
//         city: 'New York',
//         postal_code: '123001',
//         country_code: 'US'
//     },
//     name: 'Test State 2',
//     saved: true,
//     default: false,
//     state: ProcessStateStateV1.Expired
// };

// suite('ProcessStatesLambdaFunction', ()=> {
//     let lambda: ProcessStatesLambdaFunction;

//     suiteSetup((done) => {
//         let config = ConfigParams.fromTuples(
//             'logger.descriptor', 'pip-services:logger:console:default:1.0',
//             'persistence.descriptor', 'pip-services-processstates:persistence:memory:default:1.0',
//             'controller.descriptor', 'pip-services-processstates:controller:default:default:1.0'
//         );

//         lambda = new ProcessStatesLambdaFunction();
//         lambda.configure(config);
//         lambda.active(null, done);
//     });
    
//     suiteTeardown((done) => {
//         lambda.close(null, done);
//     });
    
//     test('CRUD Operations', (done) => {
//         var processState1, processState2: ProcessStateV1;

//         async.series([
//         // Create one process state
//             (callback) => {
//                 lambda.act(
//                     {
//                         role: 'process_states',
//                         cmd: 'create_state',
//                         state: STATE1
//                     },
//                     (err, processState) => {
//                         assert.isNull(err);

//                         assert.isObject(processState);
//                         assert.equal(processState.number, STATE1.number);
//                         assert.equal(processState.expire_year, STATE1.expire_year);
//                         assert.equal(processState.customer_id, STATE1.customer_id);

//                         processState1 = processState;

//                         callback();
//                     }
//                 );
//             },
//         // Create another process state
//             (callback) => {
//                 lambda.act(
//                     {
//                         role: 'process_states',
//                         cmd: 'create_state',
//                         state: STATE2
//                     },
//                     (err, processState) => {
//                         assert.isNull(err);

//                         assert.isObject(processState);
//                         assert.equal(processState.number, STATE2.number);
//                         assert.equal(processState.expire_year, STATE2.expire_year);
//                         assert.equal(processState.customer_id, STATE2.customer_id);

//                         processState2 = processState;

//                         callback();
//                     }
//                 );
//             },
//         // Get all process states
//             (callback) => {
//                 lambda.act(
//                     {
//                         role: 'process_states',
//                         cmd: 'get_states' 
//                     },
//                     (err, page) => {
//                         assert.isNull(err);

//                         assert.isObject(page);
//                         assert.lengthOf(page.data, 2);

//                         callback();
//                     }
//                 );
//             },
//         // Update the process state
//             (callback) => {
//                 processState1.name = 'Updated State 1';

//                 lambda.act(
//                     {
//                         role: 'process_states',
//                         cmd: 'update_state',
//                         state: processState1
//                     },
//                     (err, processState) => {
//                         assert.isNull(err);

//                         assert.isObject(processState);
//                         assert.equal(processState.name, 'Updated State 1');
//                         assert.equal(processState.id, STATE1.id);

//                         processState1 = processState;

//                         callback();
//                     }
//                 );
//             },
//         // Delete process state
//             (callback) => {
//                 lambda.act(
//                     {
//                         role: 'process_states',
//                         cmd: 'delete_state_by_id',
//                         state_id: processState1.id,
//                         customer_id: processState1.customer_id
//                     },
//                     (err) => {
//                         assert.isNull(err);

//                         callback();
//                     }
//                 );
//             },
//         // Try to get delete process state
//             (callback) => {
//                 lambda.act(
//                     {
//                         role: 'process_states',
//                         cmd: 'get_state_by_id',
//                         state_id: processState1.id,
//                         customer_id: processState1.customer_id
//                     },
//                     (err, processState) => {
//                         assert.isNull(err);

//                         assert.isNull(processState || null);

//                         callback();
//                     }
//                 );
//             }
//         ], done);
//     });
// });