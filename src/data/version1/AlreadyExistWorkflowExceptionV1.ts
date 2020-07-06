import { WorkflowExceptionV1 } from "./WorkflowExceptionV1";

export class AlreadyExistWorkflowExceptionV1 extends WorkflowExceptionV1 {
    public constructor(message?: string) {
        super(message);
    }
}

