"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const MessageV1Schema_1 = require("./MessageV1Schema");
class TaskStateV1Schema extends pip_services3_commons_node_1.ObjectSchema {
    constructor() {
        super();
        this.withRequiredProperty('type', pip_services3_commons_node_2.TypeCode.String);
        this.withOptionalProperty('status', pip_services3_commons_node_2.TypeCode.String);
        this.withOptionalProperty('start_time', pip_services3_commons_node_2.TypeCode.DateTime);
        this.withOptionalProperty('end_time', pip_services3_commons_node_2.TypeCode.DateTime);
        this.withOptionalProperty('queue_name', pip_services3_commons_node_2.TypeCode.String);
        this.withOptionalProperty('message', new MessageV1Schema_1.MessageV1Schema());
        this.withOptionalProperty('error_message', pip_services3_commons_node_2.TypeCode.String);
    }
}
exports.TaskStateV1Schema = TaskStateV1Schema;
//# sourceMappingURL=TaskStateV1Schema.js.map