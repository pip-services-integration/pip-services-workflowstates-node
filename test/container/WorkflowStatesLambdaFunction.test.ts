// let _ = require('lodash');
// let async = require('async');
// let assert = require('chai').assert;

// import { Descriptor } from 'pip-services3-commons-node';
// import { ConfigParams } from 'pip-services3-commons-node';
// import { References } from 'pip-services3-commons-node';
// import { ConsoleLogger } from 'pip-services3-components-node';

// import { WorkflowStateV1 } from '../../src/data/version1/WorkflowStateV1';
// import { WorkflowStateTypeV1 } from '../../src/data/version1/WorkflowStateTypeV1';
// import { WorkflowStateStateV1 } from '../../src/data/version1/WorkflowStateStateV1';
// import { WorkflowStatesMemoryPersistence } from '../../src/persistence/WorkflowStatesMemoryPersistence';
// import { WorkflowStatesController } from '../../src/logic/WorkflowStatesController';
// import { WorkflowStatesLambdaFunction } from '../../src/container/WorkflowStatesLambdaFunction';

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

// suite('WorkflowStatesLambdaFunction', ()=> {
//     let lambda: WorkflowStatesLambdaFunction;

//     suiteSetup((done) => {
//         let config = ConfigParams.fromTuples(
//             'logger.descriptor', 'pip-services:logger:console:default:1.0',
//             'persistence.descriptor', 'pip-services-workflowstates:persistence:memory:default:1.0',
//             'controller.descriptor', 'pip-services-workflowstates:controller:default:default:1.0'
//         );

//         lambda = new WorkflowStatesLambdaFunction();
//         lambda.configure(config);
//         lambda.open(null, done);
//     });
    
//     suiteTeardown((done) => {
//         lambda.close(null, done);
//     });
    
//     test('CRUD Operations', (done) => {
//         var workflowState1, workflowState2: WorkflowStateV1;

//         async.series([
//         // Create one workflow state
//             (callback) => {
//                 lambda.act(
//                     {
//                         role: 'workflow_states',
//                         cmd: 'create_state',
//                         state: STATE1
//                     },
//                     (err, workflowState) => {
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
//                 lambda.act(
//                     {
//                         role: 'workflow_states',
//                         cmd: 'create_state',
//                         state: STATE2
//                     },
//                     (err, workflowState) => {
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
//                 lambda.act(
//                     {
//                         role: 'workflow_states',
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
//         // Update the workflow state
//             (callback) => {
//                 workflowState1.name = 'Updated State 1';

//                 lambda.act(
//                     {
//                         role: 'workflow_states',
//                         cmd: 'update_state',
//                         state: workflowState1
//                     },
//                     (err, workflowState) => {
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
//                 lambda.act(
//                     {
//                         role: 'workflow_states',
//                         cmd: 'delete_state_by_id',
//                         state_id: workflowState1.id,
//                         customer_id: workflowState1.customer_id
//                     },
//                     (err) => {
//                         assert.isNull(err);

//                         callback();
//                     }
//                 );
//             },
//         // Try to get delete workflow state
//             (callback) => {
//                 lambda.act(
//                     {
//                         role: 'workflow_states',
//                         cmd: 'get_state_by_id',
//                         state_id: workflowState1.id,
//                         customer_id: workflowState1.customer_id
//                     },
//                     (err, workflowState) => {
//                         assert.isNull(err);

//                         assert.isNull(workflowState || null);

//                         callback();
//                     }
//                 );
//             }
//         ], done);
//     });
// });