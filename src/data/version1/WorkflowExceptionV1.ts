import { ApplicationException } from "pip-services3-commons-node";

export class WorkflowExceptionV1 extends ApplicationException {
   
    public constructor(message?: string) {
        super("", "", "", message);
    }
}

