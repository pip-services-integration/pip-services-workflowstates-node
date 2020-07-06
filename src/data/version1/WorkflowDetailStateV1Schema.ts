import { TypeCode } from "pip-services3-commons-node";
import { ObjectSchema } from "pip-services3-commons-node";
import { ArraySchema } from "pip-services3-commons-node";
import { MessageEnvelopeV1Schema } from "./MessageEnvelopeV1Schema";
import { ActivityDetailStateV1Schema } from "./ActivityDetailStateV1Schema";

export class WorkflowDetailStateV1Schema extends ObjectSchema {
    public WorkflowStatusV1Schema() {
        this.withOptionalProperty("id", TypeCode.String);
        this.withOptionalProperty("type", TypeCode.String);
        this.withOptionalProperty("initiator_id", TypeCode.String);
        this.withOptionalProperty("key", TypeCode.String);
        this.withOptionalProperty("status", TypeCode.String);
        this.withOptionalProperty("start_time", TypeCode.DateTime);
        this.withOptionalProperty("end_time", TypeCode.DateTime);
        this.withOptionalProperty("last_action_time", TypeCode.DateTime);
        this.withOptionalProperty("expiration_time", TypeCode.DateTime);
        this.withOptionalProperty("request", TypeCode.String);
        this.withOptionalProperty("comment", TypeCode.String);
        this.withOptionalProperty("compensation_time", TypeCode.DateTime);
        this.withOptionalProperty("compensation_queue_name", TypeCode.String);
        this.withOptionalProperty("compensation_message", new MessageEnvelopeV1Schema());
        this.withOptionalProperty("attempt_count", TypeCode.Long);
        this.withOptionalProperty("lock_token", TypeCode.String);
        this.withOptionalProperty("locked_until_time", TypeCode.DateTime);
        this.withOptionalProperty("activities", new ArraySchema(new ActivityDetailStateV1Schema()));
        this.withOptionalProperty("data", TypeCode.Map);
    }
}

