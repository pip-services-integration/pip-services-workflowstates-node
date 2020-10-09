"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompositeProcessStatesMongoDbPersistence = void 0;
const CompositeProcessStatesPersistence_1 = require("./CompositeProcessStatesPersistence");
const ProcessStatesMongoDbPersistence_1 = require("./ProcessStatesMongoDbPersistence");
const ActiveProcessStatesMongoDbPersistence_1 = require("./ActiveProcessStatesMongoDbPersistence");
class CompositeProcessStatesMongoDbPersistence extends CompositeProcessStatesPersistence_1.CompositeProcessStatesPersistence {
    constructor() {
        super(new ActiveProcessStatesMongoDbPersistence_1.ActiveProcessStatesMongoDbPersistence(), new ProcessStatesMongoDbPersistence_1.ProcessStatesMongoDbPersistence());
    }
}
exports.CompositeProcessStatesMongoDbPersistence = CompositeProcessStatesMongoDbPersistence;
//# sourceMappingURL=CompositeProcessStatesMongoDbPersistence.js.map