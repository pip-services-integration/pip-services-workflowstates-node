"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessStatesServiceFactory = void 0;
const pip_services3_components_node_1 = require("pip-services3-components-node");
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const ProcessStatesMongoDbPersistence_1 = require("../persistence/ProcessStatesMongoDbPersistence");
const ProcessStatesFilePersistence_1 = require("../persistence/ProcessStatesFilePersistence");
const ProcessStatesMemoryPersistence_1 = require("../persistence/ProcessStatesMemoryPersistence");
const ProcessStatesController_1 = require("../logic/ProcessStatesController");
const ProcessStatesHttpServiceV1_1 = require("../services/version1/ProcessStatesHttpServiceV1");
const ProcessCloseExpiredProcessor_1 = require("../logic/ProcessCloseExpiredProcessor");
const ProcessRecoveryProcessor_1 = require("../logic/ProcessRecoveryProcessor");
const ProcessTruncateProcessor_1 = require("../logic/ProcessTruncateProcessor");
class ProcessStatesServiceFactory extends pip_services3_components_node_1.Factory {
    constructor() {
        super();
        this.registerAsType(ProcessStatesServiceFactory.MemoryPersistenceDescriptor, ProcessStatesMemoryPersistence_1.ProcessStatesMemoryPersistence);
        this.registerAsType(ProcessStatesServiceFactory.FilePersistenceDescriptor, ProcessStatesFilePersistence_1.ProcessStatesFilePersistence);
        this.registerAsType(ProcessStatesServiceFactory.MongoDbPersistenceDescriptor, ProcessStatesMongoDbPersistence_1.ProcessStatesMongoDbPersistence);
        this.registerAsType(ProcessStatesServiceFactory.ControllerDescriptor, ProcessStatesController_1.ProcessStatesController);
        this.registerAsType(ProcessStatesServiceFactory.HttpServiceDescriptor, ProcessStatesHttpServiceV1_1.ProcessStatesHttpServiceV1);
        this.registerAsType(ProcessStatesServiceFactory.CloseExpiredProcessorDescriptor, ProcessCloseExpiredProcessor_1.ProcessCloseExpiredProcessor);
        this.registerAsType(ProcessStatesServiceFactory.RecoveryProcessorDescriptor, ProcessRecoveryProcessor_1.ProcessRecoveryProcessor);
        this.registerAsType(ProcessStatesServiceFactory.TruncateProcessorDescriptor, ProcessTruncateProcessor_1.ProcessTruncateProcessor);
    }
}
exports.ProcessStatesServiceFactory = ProcessStatesServiceFactory;
ProcessStatesServiceFactory.Descriptor = new pip_services3_commons_node_1.Descriptor("pip-services-processstates", "factory", "default", "default", "1.0");
ProcessStatesServiceFactory.MemoryPersistenceDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services-processstates", "persistence", "memory", "*", "1.0");
ProcessStatesServiceFactory.FilePersistenceDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services-processstates", "persistence", "file", "*", "1.0");
ProcessStatesServiceFactory.MongoDbPersistenceDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services-processstates", "persistence", "mongodb", "*", "1.0");
ProcessStatesServiceFactory.ControllerDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services-processstates", "controller", "default", "*", "1.0");
ProcessStatesServiceFactory.HttpServiceDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services-processstates", "service", "http", "*", "1.0");
ProcessStatesServiceFactory.CloseExpiredProcessorDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services-processstates", "processor", "expired", "*", "1.0");
ProcessStatesServiceFactory.RecoveryProcessorDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services-processstates", "processor", "recovery", "*", "1.0");
ProcessStatesServiceFactory.TruncateProcessorDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services-processstates", "processor", "truncate", "*", "1.0");
//# sourceMappingURL=ProcessStatesServiceFactory.js.map