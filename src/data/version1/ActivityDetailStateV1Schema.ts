import { TypeCode } from "pip-services3-commons-node";
import { ObjectSchema } from "pip-services3-commons-node";
import { MessageEnvelopeV1Schema } from "./MessageEnvelopeV1Schema";

export class ActivityDetailStateV1Schema extends ObjectSchema {
    public ActivityStatusV1Schema() {
        this.withOptionalProperty("type", TypeCode.String);
        this.withOptionalProperty("status", TypeCode.String);
        this.withOptionalProperty("start_time", TypeCode.DateTime);
        this.withOptionalProperty("end_time", TypeCode.DateTime);
        this.withOptionalProperty("queue_name", TypeCode.String);
        this.withOptionalProperty("message", new MessageEnvelopeV1Schema());
        this.withOptionalProperty("error_message", TypeCode.String);
    }
}

