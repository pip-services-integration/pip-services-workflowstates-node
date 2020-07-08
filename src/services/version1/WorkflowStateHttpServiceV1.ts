import { CommandableHttpService } from "pip-services3-rpc-node";
import { Descriptor } from "pip-services3-commons-node";

export class WorkflowStateHttpServiceV1 extends CommandableHttpService {
    public constructor() {
        super("v1/workflow_states");
        this._dependencyResolver.put("controller", new Descriptor("pip-services-workflowstates", "controller", "default", "*", "1.0"));
    }
}

