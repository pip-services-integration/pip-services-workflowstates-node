import { ConfigParams } from 'pip-services3-commons-node';
import { JsonFilePersister } from 'pip-services3-data-node';

import { WorkflowStatesMemoryPersistence } from './WorkflowStatesMemoryPersistence';
import { WorkflowStateV1 } from '../data/version1/WorkflowStateV1';

export class WorkflowStatesFilePersistence extends WorkflowStatesMemoryPersistence {
	protected _persister: JsonFilePersister<WorkflowStateV1>;

    public constructor(path?: string) {
        super();

        this._persister = new JsonFilePersister<WorkflowStateV1>(path);
        this._loader = this._persister;
        this._saver = this._persister;
    }

    public configure(config: ConfigParams): void {
        super.configure(config);
        this._persister.configure(config);
    }

}