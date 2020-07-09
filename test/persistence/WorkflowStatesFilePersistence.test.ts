// import { ConfigParams } from 'pip-services3-commons-node';

// import { WorkflowStatesFilePersistence } from '../../src/persistence/WorkflowStatesFilePersistence';
// import { WorkflowStatesPersistenceFixture } from './WorkflowStatesPersistenceFixture';

// suite('WorkflowStatesFilePersistence', ()=> {
//     let persistence: WorkflowStatesFilePersistence;
//     let fixture: WorkflowStatesPersistenceFixture;
    
//     setup((done) => {
//         persistence = new WorkflowStatesFilePersistence('./data/workflow_states.test.json');

//         fixture = new WorkflowStatesPersistenceFixture(persistence);

//         persistence.open(null, (err) => {
//             persistence.clear(null, done);
//         });
//     });
    
//     teardown((done) => {
//         persistence.close(null, done);
//     });
        
//     test('CRUD Operations', (done) => {
//         fixture.testCrudOperations(done);
//     });

//     test('Get with Filters', (done) => {
//         fixture.testGetWithFilter(done);
//     });

// });