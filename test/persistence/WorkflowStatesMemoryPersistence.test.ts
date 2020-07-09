// import { ConfigParams } from 'pip-services3-commons-node';

// import { WorkflowStatesMemoryPersistence } from '../../src/persistence/WorkflowStatesMemoryPersistence';
// import { WorkflowStatesPersistenceFixture } from './WorkflowStatesPersistenceFixture';

// suite('WorkflowStatesMemoryPersistence', ()=> {
//     let persistence: WorkflowStatesMemoryPersistence;
//     let fixture: WorkflowStatesPersistenceFixture;
    
//     setup((done) => {
//         persistence = new WorkflowStatesMemoryPersistence();
//         persistence.configure(new ConfigParams());
        
//         fixture = new WorkflowStatesPersistenceFixture(persistence);
        
//         persistence.open(null, done);
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