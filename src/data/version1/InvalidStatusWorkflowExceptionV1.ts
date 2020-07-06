import { WorkflowExceptionV1 } from "./WorkflowExceptionV1";

export class InvalidStatusWorkflowExceptionV1 extends WorkflowExceptionV1 {
    public constructor(message?: string) {
        if (message) {
            super(message);
        } else {
            super("Workflow is in invalid status");
        }
    }

}
