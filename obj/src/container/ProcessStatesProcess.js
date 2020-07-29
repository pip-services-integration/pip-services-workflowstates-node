"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_container_node_1 = require("pip-services3-container-node");
const ProcessStatesServiceFactory_1 = require("../build/ProcessStatesServiceFactory");
const pip_services3_rpc_node_1 = require("pip-services3-rpc-node");
class ProcessStatesProcess extends pip_services3_container_node_1.ProcessContainer {
    constructor() {
        super("process_states", "Process states microservice");
        this._factories.add(new ProcessStatesServiceFactory_1.ProcessStatesServiceFactory);
        this._factories.add(new pip_services3_rpc_node_1.DefaultRpcFactory);
    }
}
exports.ProcessStatesProcess = ProcessStatesProcess;
//# sourceMappingURL=ProcessStatesProcess.js.map