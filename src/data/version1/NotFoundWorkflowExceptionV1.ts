import { WorkflowExceptionV1 } from "./WorkflowExceptionV1";

export class NotFoundWorkflowExceptionV1 extends WorkflowExceptionV1 {
    public constructor(message: string) {
        super(message)
    }

}

