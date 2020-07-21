"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const MessageV1Schema_1 = require("./MessageV1Schema");
const TaskStateV1Schema_1 = require("./TaskStateV1Schema");
class ProcessStateV1Schema extends pip_services3_commons_node_1.ObjectSchema {
    constructor() {
        super();
        this.withOptionalProperty("id", pip_services3_commons_node_3.TypeCode.String);
        this.withRequiredProperty("type", pip_services3_commons_node_3.TypeCode.String);
        this.withOptionalProperty("request_id", pip_services3_commons_node_3.TypeCode.String);
        this.withOptionalProperty("key", pip_services3_commons_node_3.TypeCode.String);
        this.withOptionalProperty("state", pip_services3_commons_node_3.TypeCode.String);
        this.withOptionalProperty("start_time", pip_services3_commons_node_3.TypeCode.DateTime);
        this.withOptionalProperty("end_time", pip_services3_commons_node_3.TypeCode.DateTime);
        this.withOptionalProperty("last_action_time", pip_services3_commons_node_3.TypeCode.DateTime);
        this.withOptionalProperty("expiration_time", pip_services3_commons_node_3.TypeCode.DateTime);
        this.withOptionalProperty("request", pip_services3_commons_node_3.TypeCode.String);
        this.withOptionalProperty("comment", pip_services3_commons_node_3.TypeCode.String);
        this.withOptionalProperty("recovery_time", pip_services3_commons_node_3.TypeCode.DateTime);
        this.withOptionalProperty("recovery_queue_name", pip_services3_commons_node_3.TypeCode.String);
        this.withOptionalProperty("recovery_message", new MessageV1Schema_1.MessageV1Schema());
        this.withOptionalProperty("recovery_timeout", pip_services3_commons_node_3.TypeCode.Integer);
        this.withOptionalProperty("recovery_attempts", pip_services3_commons_node_3.TypeCode.Long);
        this.withOptionalProperty("lock_token", pip_services3_commons_node_3.TypeCode.String);
        this.withOptionalProperty("locked_until_time", pip_services3_commons_node_3.TypeCode.DateTime);
        this.withOptionalProperty("tasks", new pip_services3_commons_node_2.ArraySchema(new TaskStateV1Schema_1.TaskStateV1Schema()));
        this.withOptionalProperty("data", null);
    }
}
exports.ProcessStateV1Schema = ProcessStateV1Schema;
//# sourceMappingURL=ProcessStateV1Schema.js.map