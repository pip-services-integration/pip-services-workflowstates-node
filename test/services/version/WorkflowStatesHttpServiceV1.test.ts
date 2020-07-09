// let _ = require('lodash');
// let async = require('async');
// let restify = require('restify');
// let assert = require('chai').assert;

// import { ConfigParams } from 'pip-services3-commons-node';
// import { Descriptor } from 'pip-services3-commons-node';
// import { References } from 'pip-services3-commons-node';

// import { WorkflowStateV1 } from '../../../src/data/version1/WorkflowStateV1';
// import { WorkflowStateTypeV1 } from '../../../src/data/version1/WorkflowStateTypeV1';
// import { WorkflowStateStateV1 } from '../../../src/data/version1/WorkflowStateStateV1';
// import { WorkflowStatesMemoryPersistence } from '../../../src/persistence/WorkflowStatesMemoryPersistence';
// import { WorkflowStatesController } from '../../../src/logic/WorkflowStatesController';
// import { WorkflowStatesHttpServiceV1 } from '../../../src/services/version1/WorkflowStatesHttpServiceV1';

// let httpConfig = ConfigParams.fromTuples(
//     "connection.protocol", "http",
//     "connection.host", "localhost",
//     "connection.port", 3000
// );

// let STATE1: WorkflowStateV1 = {
//     id: '1',
//     customer_id: '1',
//     type: WorkflowStateTypeV1.Visa,
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
//     state: WorkflowStateStateV1.Ok
// };
// let STATE2: WorkflowStateV1 = {
//     id: '2',
//     customer_id: '1',
//     type: WorkflowStateTypeV1.Visa,
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
//     state: WorkflowStateStateV1.Expired
// };


// suite('WorkflowStatesHttpServiceV1', ()=> {    
//     let service: WorkflowStatesHttpServiceV1;
//     let rest: any;

//     suiteSetup((done) => {
//         let persistence = new WorkflowStatesMemoryPersistence();
//         let controller = new WorkflowStatesController();

//         service = new WorkflowStatesHttpServiceV1();
//         service.configure(httpConfig);

//         let references: References = References.fromTuples(
//             new Descriptor('pip-services-workflowstates', 'persistence', 'memory', 'default', '1.0'), persistence,
//             new Descriptor('pip-services-workflowstates', 'controller', 'default', 'default', '1.0'), controller,
//             new Descriptor('pip-services-workflowstates', 'service', 'http', 'default', '1.0'), service
//         );
//         controller.setReferences(references);
//         service.setReferences(references);

//         service.open(null, done);
//     });
    
//     suiteTeardown((done) => {
//         service.close(null, done);
//     });

//     setup(() => {
//         let url = 'http://localhost:3000';
//         rest = restify.createJsonClient({ url: url, version: '*' });
//     });
    
    
//     test('CRUD Operations', (done) => {
//         let workflowState1, workflowState2: WorkflowStateV1;

//         async.series([
//         // Create one workflow state
//             (callback) => {
//                 rest.post('/v1/workflow_states/create_state',
//                     {
//                         state: STATE1
//                     },
//                     (err, req, res, workflowState) => {
//                         assert.isNull(err);

//                         assert.isObject(workflowState);
//                         assert.equal(workflowState.number, STATE1.number);
//                         assert.equal(workflowState.expire_year, STATE1.expire_year);
//                         assert.equal(workflowState.customer_id, STATE1.customer_id);

//                         workflowState1 = workflowState;

//                         callback();
//                     }
//                 );
//             },
//         // Create another workflow state
//             (callback) => {
//                 rest.post('/v1/workflow_states/create_state', 
//                     {
//                         state: STATE2
//                     },
//                     (err, req, res, workflowState) => {
//                         assert.isNull(err);

//                         assert.isObject(workflowState);
//                         assert.equal(workflowState.number, STATE2.number);
//                         assert.equal(workflowState.expire_year, STATE2.expire_year);
//                         assert.equal(workflowState.customer_id, STATE2.customer_id);

//                         workflowState2 = workflowState;

//                         callback();
//                     }
//                 );
//             },
//         // Get all workflow states
//             (callback) => {
//                 rest.post('/v1/workflow_states/get_states',
//                     {},
//                     (err, req, res, page) => {
//                         assert.isNull(err);

//                         assert.isObject(page);
//                         assert.lengthOf(page.data, 2);

//                         callback();
//                     }
//                 );
//             },
//         // Update the workflow state
//             (callback) => {
//                 workflowState1.name = 'Updated State 1';

//                 rest.post('/v1/workflow_states/update_state',
//                     { 
//                         state: workflowState1
//                     },
//                     (err, req, res, workflowState) => {
//                         assert.isNull(err);

//                         assert.isObject(workflowState);
//                         assert.equal(workflowState.name, 'Updated State 1');
//                         assert.equal(workflowState.id, STATE1.id);

//                         workflowState1 = workflowState;

//                         callback();
//                     }
//                 );
//             },
//         // Delete workflow state
//             (callback) => {
//                 rest.post('/v1/workflow_states/delete_state_by_id',
//                     {
//                         state_id: workflowState1.id,
//                         customer_id: workflowState1.customer_id
//                     },
//                     (err, req, res, result) => {
//                         assert.isNull(err);

//                         //assert.isNull(result);

//                         callback();
//                     }
//                 );
//             },
//         // Try to get delete workflow state
//             (callback) => {
//                 rest.post('/v1/workflow_states/get_state_by_id',
//                     {
//                         state_id: workflowState1.id,
//                         customer_id: workflowState1.customer_id
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