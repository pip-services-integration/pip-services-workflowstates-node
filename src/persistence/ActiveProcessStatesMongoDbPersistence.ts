import { ProcessStatesMongoDbPersistence } from './ProcessStatesMongoDbPersistence';

export class ActiveProcessStatesMongoDbPersistence extends ProcessStatesMongoDbPersistence {
    public constructor() {
        super('active_processes');
        super.ensureIndex({ type: 1, key: 1 });
        super.ensureIndex({ request_id: 1 });
    }
}