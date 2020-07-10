import { WorkflowStatesMongoDbPersistence } from './WorkflowStatesMongoDbPersistence';

export class OpenWorkflowStatesMongoDbPersistence extends WorkflowStatesMongoDbPersistence {
    public constructor() {
        super('open_workflows');
        super.ensureIndex({ type: 1, key: 1 });
        super.ensureIndex({ initiator_id: 1 });
    }
}