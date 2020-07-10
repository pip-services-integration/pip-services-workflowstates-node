// import { ConfigParams } from 'pip-services3-commons-node';

// import { ProcessStatesMemoryPersistence } from '../../src/persistence/ProcessStatesMemoryPersistence';
// import { ProcessStatesPersistenceFixture } from './ProcessStatesPersistenceFixture';

// suite('ProcessStatesMemoryPersistence', ()=> {
//     let persistence: ProcessStatesMemoryPersistence;
//     let fixture: ProcessStatesPersistenceFixture;
    
//     setup((done) => {
//         persistence = new ProcessStatesMemoryPersistence();
//         persistence.configure(new ConfigParams());
        
//         fixture = new ProcessStatesPersistenceFixture(persistence);
        
//         persistence.active(null, done);
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