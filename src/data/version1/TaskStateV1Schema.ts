import { ObjectSchema } from 'pip-services3-commons-node';
import { ArraySchema } from 'pip-services3-commons-node';
import { TypeCode } from 'pip-services3-commons-node';

import { MessageV1Schema } from './MessageV1Schema';

export class TaskStateV1Schema extends ObjectSchema {
    public constructor() {
        super();
        this.withRequiredProperty('type', TypeCode.String);
        this.withOptionalProperty('status', TypeCode.String);
        this.withOptionalProperty('start_time', TypeCode.DateTime);
        this.withOptionalProperty('end_time', TypeCode.DateTime);
        this.withOptionalProperty('queue_name', TypeCode.String);
        this.withOptionalProperty('message', new MessageV1Schema());
        this.withOptionalProperty('error_message', TypeCode.String);
    }
}
