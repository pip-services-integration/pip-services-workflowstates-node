import { ConfigParams } from 'pip-services3-commons-node';
import { JsonFilePersister } from 'pip-services3-data-node';
import { ProcessStatesMemoryPersistence } from './ProcessStatesMemoryPersistence';
import { ProcessStateV1 } from '../data/version1/ProcessStateV1';
export declare class ProcessStatesFilePersistence extends ProcessStatesMemoryPersistence {
    protected _persister: JsonFilePersister<ProcessStateV1>;
    constructor(path?: string);
    configure(config: ConfigParams): void;
}
