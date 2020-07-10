import { CompositeProcessStatesPersistence } from './CompositeProcessStatesPersistence';
import { ProcessStatesMongoDbPersistence } from './ProcessStatesMongoDbPersistence';
import { ActiveProcessStatesMongoDbPersistence } from './ActiveProcessStatesMongoDbPersistence';

export class CompositeProcessStatesMongoDbPersistence extends CompositeProcessStatesPersistence {
    public constructor() {
        super(
            new ActiveProcessStatesMongoDbPersistence(),
            new ProcessStatesMongoDbPersistence()
        );
    }
}