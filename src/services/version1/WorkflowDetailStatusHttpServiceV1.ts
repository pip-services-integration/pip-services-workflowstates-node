import { CommandableHttpService } from "pip-services3-rpc-node";
import { Descriptor } from "pip-services3-commons-node";

export class WorkflowDetailStatusHttpServiceV1 extends CommandableHttpService {
    public constructor() {
        super("v1/workflow_status");
        this._dependencyResolver.put("controller", new Descriptor("pip-integration-workflow-status", "controller", "default", "*", "1.0"));
    }
}

