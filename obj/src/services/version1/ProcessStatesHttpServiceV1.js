"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessStatesHttpServiceV1 = void 0;
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_rpc_node_1 = require("pip-services3-rpc-node");
class ProcessStatesHttpServiceV1 extends pip_services3_rpc_node_1.CommandableHttpService {
    constructor() {
        super('v1/process_states');
        this._dependencyResolver.put('controller', new pip_services3_commons_node_1.Descriptor('pip-services-processstates', 'controller', 'default', '*', '1.0'));
    }
}
exports.ProcessStatesHttpServiceV1 = ProcessStatesHttpServiceV1;
//# sourceMappingURL=ProcessStatesHttpServiceV1.js.map