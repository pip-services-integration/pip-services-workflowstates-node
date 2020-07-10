// let _ = require('lodash');
// let async = require('async');
// let restify = require('restify');
// let assert = require('chai').assert;

// import { ConfigParams } from 'pip-services3-commons-node';
// import { Descriptor } from 'pip-services3-commons-node';
// import { References } from 'pip-services3-commons-node';

// import { ProcessStateV1 } from '../../../src/data/version1/ProcessStateV1';
// import { ProcessStateTypeV1 } from '../../../src/data/version1/ProcessStateTypeV1';
// import { ProcessStateStateV1 } from '../../../src/data/version1/ProcessStateStateV1';
// import { ProcessStatesMemoryPersistence } from '../../../src/persistence/ProcessStatesMemoryPersistence';
// import { ProcessStatesController } from '../../../src/logic/ProcessStatesController';
// import { ProcessStatesHttpServiceV1 } from '../../../src/services/version1/ProcessStatesHttpServiceV1';

// let httpConfig = ConfigParams.fromTuples(
//     "connection.protocol", "http",
//     "connection.host", "localhost",
//     "connection.port", 3000
// );

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


// suite('ProcessStatesHttpServiceV1', ()=> {    
//     let service: ProcessStatesHttpServiceV1;
//     let rest: any;

//     suiteSetup((done) => {
//         let persistence = new ProcessStatesMemoryPersistence();
//         let controller = new ProcessStatesController();

//         service = new ProcessStatesHttpServiceV1();
//         service.configure(httpConfig);

//         let references: References = References.fromTuples(
//             new Descriptor('pip-services-processstates', 'persistence', 'memory', 'default', '1.0'), persistence,
//             new Descriptor('pip-services-processstates', 'controller', 'default', 'default', '1.0'), controller,
//             new Descriptor('pip-services-processstates', 'service', 'http', 'default', '1.0'), service
//         );
//         controller.setReferences(references);
//         service.setReferences(references);

//         service.active(null, done);
//     });
    
//     suiteTeardown((done) => {
//         service.close(null, done);
//     });

//     setup(() => {
//         let url = 'http://localhost:3000';
//         rest = restify.createJsonClient({ url: url, version: '*' });
//     });
    
    
//     test('CRUD Operations', (done) => {
//         let processState1, processState2: ProcessStateV1;

//         async.series([
//         // Create one process state
//             (callback) => {
//                 rest.post('/v1/process_states/create_state',
//                     {
//                         state: STATE1
//                     },
//                     (err, req, res, processState) => {
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
//                 rest.post('/v1/process_states/create_state', 
//                     {
//                         state: STATE2
//                     },
//                     (err, req, res, processState) => {
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
//                 rest.post('/v1/process_states/get_states',
//                     {},
//                     (err, req, res, page) => {
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

//                 rest.post('/v1/process_states/update_state',
//                     { 
//                         state: processState1
//                     },
//                     (err, req, res, processState) => {
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
//                 rest.post('/v1/process_states/delete_state_by_id',
//                     {
//                         state_id: processState1.id,
//                         customer_id: processState1.customer_id
//                     },
//                     (err, req, res, result) => {
//                         assert.isNull(err);

//                         //assert.isNull(result);

//                         callback();
//                     }
//                 );
//             },
//         // Try to get delete process state
//             (callback) => {
//                 rest.post('/v1/process_states/get_state_by_id',
//                     {
//                         state_id: processState1.id,
//                         customer_id: processState1.customer_id
//                     },
//                     (err, req, res, result) => {
//                         assert.isNull(err);

//                         //assert.isNull(result);

//                         callback();
//                     }
//                 );
//             }
//         ], done);
//     });
// });