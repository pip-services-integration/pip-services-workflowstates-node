import { TypeCode } from "pip-services3-commons-node";
import { ObjectSchema } from "pip-services3-commons-node";

export class MessageEnvelopeV1Schema extends ObjectSchema {
    public MessageEnvelopeV1Schema() {
        this.withOptionalProperty("correlation_id", TypeCode.String);
        this.withOptionalProperty("message_id", TypeCode.String);
        this.withOptionalProperty("request_id", TypeCode.String);
        this.withOptionalProperty("message_type", TypeCode.String);
        this.withOptionalProperty("sent_time", TypeCode.DateTime);
        this.withOptionalProperty("message", TypeCode.String);
    }
}

