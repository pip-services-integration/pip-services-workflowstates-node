import { TypeCode } from "pip-services3-commons-node";
import { ObjectSchema } from "pip-services3-commons-node";

export class MessageEnvelopeV1Schema extends ObjectSchema {
    public MessageEnvelopeV1Schema() {
        this.withOptionalProperty("CorrelationId", TypeCode.String);
        this.withOptionalProperty("MessageId", TypeCode.String);
        this.withOptionalProperty("initiator_id", TypeCode.String);
        this.withOptionalProperty("MessageType", TypeCode.String);
        this.withOptionalProperty("SentTime", TypeCode.DateTime);
        this.withOptionalProperty("Message", TypeCode.String);
    }
}

