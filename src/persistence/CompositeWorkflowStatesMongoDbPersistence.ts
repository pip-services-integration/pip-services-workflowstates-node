import { CompositeWorkflowStatesPersistence } from './CompositeWorkflowStatesPersistence';
import { WorkflowStatesMongoDbPersistence } from './WorkflowStatesMongoDbPersistence';
import { OpenWorkflowStatesMongoDbPersistence } from './OpenWorkflowStatesMongoDbPersistence';

export class CompositeWorkflowStatesMongoDbPersistence extends CompositeWorkflowStatesPersistence {
    public constructor() {
        super(
            new OpenWorkflowStatesMongoDbPersistence(),
            new WorkflowStatesMongoDbPersistence()
        );
    }
}