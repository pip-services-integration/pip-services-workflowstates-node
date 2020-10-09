"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActiveProcessStatesMongoDbPersistence = void 0;
const ProcessStatesMongoDbPersistence_1 = require("./ProcessStatesMongoDbPersistence");
class ActiveProcessStatesMongoDbPersistence extends ProcessStatesMongoDbPersistence_1.ProcessStatesMongoDbPersistence {
    constructor() {
        super('active_processes');
        super.ensureIndex({ type: 1, key: 1 });
        super.ensureIndex({ request_id: 1 });
    }
}
exports.ActiveProcessStatesMongoDbPersistence = ActiveProcessStatesMongoDbPersistence;
//# sourceMappingURL=ActiveProcessStatesMongoDbPersistence.js.map