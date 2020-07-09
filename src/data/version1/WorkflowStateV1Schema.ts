import { ObjectSchema } from 'pip-services3-commons-node';
import { ArraySchema } from 'pip-services3-commons-node';
import { TypeCode } from 'pip-services3-commons-node';

import { MessageV1Schema } from './MessageV1Schema';
import { ActivityStateV1Schema } from './ActivityStateV1Schema';

export class WorkflowStateV1Schema extends ObjectSchema {
    public constructor() {
        super();
        this.withOptionalProperty("id", TypeCode.String);
        this.withRequiredProperty("type", TypeCode.String);
        this.withOptionalProperty("initiator_id", TypeCode.String);
        this.withOptionalProperty("key", TypeCode.String);
        this.withOptionalProperty("state", TypeCode.String);
        this.withOptionalProperty("start_time", TypeCode.DateTime);
        this.withOptionalProperty("end_time", TypeCode.DateTime);
        this.withOptionalProperty("last_action_time", TypeCode.DateTime);
        this.withOptionalProperty("expiration_time", TypeCode.DateTime);
        this.withOptionalProperty("request", TypeCode.String);
        this.withOptionalProperty("comment", TypeCode.String);
        this.withOptionalProperty("compensation_time", TypeCode.DateTime);
        this.withOptionalProperty("compensation_queue_name", TypeCode.String);
        this.withOptionalProperty("compensation_message", new MessageV1Schema());
        this.withOptionalProperty("compensation_timeout", TypeCode.Integer);
        this.withOptionalProperty("attempt_count", TypeCode.Long);
        this.withOptionalProperty("lock_token", TypeCode.String);
        this.withOptionalProperty("locked_until_time", TypeCode.DateTime);
        this.withOptionalProperty("activities", new ArraySchema(new ActivityStateV1Schema()));
        this.withOptionalProperty("data", null);
}
}
