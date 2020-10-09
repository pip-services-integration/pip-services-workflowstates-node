"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessStatesFilePersistence = void 0;
const pip_services3_data_node_1 = require("pip-services3-data-node");
const ProcessStatesMemoryPersistence_1 = require("./ProcessStatesMemoryPersistence");
class ProcessStatesFilePersistence extends ProcessStatesMemoryPersistence_1.ProcessStatesMemoryPersistence {
    constructor(path) {
        super();
        this._persister = new pip_services3_data_node_1.JsonFilePersister(path);
        this._loader = this._persister;
        this._saver = this._persister;
    }
    configure(config) {
        super.configure(config);
        this._persister.configure(config);
    }
}
exports.ProcessStatesFilePersistence = ProcessStatesFilePersistence;
//# sourceMappingURL=ProcessStatesFilePersistence.js.map