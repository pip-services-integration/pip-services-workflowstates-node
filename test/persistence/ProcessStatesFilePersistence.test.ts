import { ConfigParams } from 'pip-services3-commons-node';

import { ProcessStatesFilePersistence } from '../../src/persistence/ProcessStatesFilePersistence';
import { ProcessStatesPersistenceFixture } from './ProcessStatesPersistenceFixture';

suite('ProcessStatesFilePersistence', ()=> {
    let persistence: ProcessStatesFilePersistence;
    let fixture: ProcessStatesPersistenceFixture;
    
    setup((done) => {
        persistence = new ProcessStatesFilePersistence('./data/process_states.test.json');

        fixture = new ProcessStatesPersistenceFixture(persistence);

        persistence.open(null, (err) => {
            persistence.clear(null, done);
        });
    });
    
    teardown((done) => {
        persistence.close(null, done);
    });
        
    test('CRUD Operations', (done) => {
        fixture.testCrudOperations(done);
    });

    test('Get with Filters', (done) => {
        fixture.testGetWithFilter(done);
    });

    test('Get Active', (done) => {
        fixture.testGetActiveProcess(done);
    });

    test('Truncate', (done) => {
        fixture.testTruncateProcesses(done);
    });

});