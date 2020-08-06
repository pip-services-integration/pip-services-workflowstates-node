import { ObjectSchema } from 'pip-services3-commons-node';
import { ArraySchema } from 'pip-services3-commons-node';
import { TypeCode } from 'pip-services3-commons-node';

import { MessageV1Schema } from './MessageV1Schema';
import { TaskStateV1Schema } from './TaskStateV1Schema';

export class ProcessStateV1Schema extends ObjectSchema {
    public constructor() {
        super();
        this.withOptionalProperty("id", TypeCode.String);
        this.withRequiredProperty("type", TypeCode.String);
        this.withOptionalProperty("request_id", TypeCode.String);
        this.withOptionalProperty("key", TypeCode.String);
        this.withOptionalProperty("status", TypeCode.String);
        this.withOptionalProperty("start_time", TypeCode.DateTime);
        this.withOptionalProperty("end_time", TypeCode.DateTime);
        this.withOptionalProperty("last_action_time", TypeCode.DateTime);
        this.withOptionalProperty("expiration_time", TypeCode.DateTime);
        this.withOptionalProperty("request", TypeCode.String);
        this.withOptionalProperty("comment", TypeCode.String);
        this.withOptionalProperty("recovery_time", TypeCode.DateTime);
        this.withOptionalProperty("recovery_queue_name", TypeCode.String);
        this.withOptionalProperty("recovery_message", new MessageV1Schema());
        this.withOptionalProperty("recovery_timeout", TypeCode.Integer);
        this.withOptionalProperty("recovery_attempts", TypeCode.Long);
        this.withOptionalProperty("lock_token", TypeCode.String);
        this.withOptionalProperty("locked_until_time", TypeCode.DateTime);
        this.withOptionalProperty("tasks", new ArraySchema(new TaskStateV1Schema()));
        this.withOptionalProperty("data", null);
}
}
