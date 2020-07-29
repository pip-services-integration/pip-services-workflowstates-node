import { IReferences } from 'pip-services3-commons-node';
import { ProcessContainer } from 'pip-services3-container-node';

import { ProcessStatesServiceFactory } from '../build/ProcessStatesServiceFactory';
import { DefaultRpcFactory } from 'pip-services3-rpc-node';

export class ProcessStatesProcess extends ProcessContainer {

    public constructor() {
        super("process_states", "Process states microservice");
        this._factories.add(new ProcessStatesServiceFactory);
        this._factories.add(new DefaultRpcFactory);
    }

}
