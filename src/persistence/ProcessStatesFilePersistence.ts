import { ConfigParams } from 'pip-services3-commons-node';
import { JsonFilePersister } from 'pip-services3-data-node';

import { ProcessStatesMemoryPersistence } from './ProcessStatesMemoryPersistence';
import { ProcessStateV1 } from '../data/version1/ProcessStateV1';

export class ProcessStatesFilePersistence extends ProcessStatesMemoryPersistence {
	protected _persister: JsonFilePersister<ProcessStateV1>;

    public constructor(path?: string) {
        super();

        this._persister = new JsonFilePersister<ProcessStateV1>(path);
        this._loader = this._persister;
        this._saver = this._persister;
    }

    public configure(config: ConfigParams): void {
        super.configure(config);
        this._persister.configure(config);
    }

}