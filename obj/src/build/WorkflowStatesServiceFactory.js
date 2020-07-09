// import { Factory } from 'pip-services3-components-node';
// import { Descriptor } from 'pip-services3-commons-node';
// import { WorkflowStatesMongoDbPersistence } from '../persistence/WorkflowStatesMongoDbPersistence';
// import { WorkflowStatesFilePersistence } from '../persistence/WorkflowStatesFilePersistence';
// import { WorkflowStatesMemoryPersistence } from '../persistence/WorkflowStatesMemoryPersistence';
// import { WorkflowStatesController } from '../logic/WorkflowStatesController';
// import { WorkflowStatesHttpServiceV1 } from '../services/version1/WorkflowStatesHttpServiceV1';
// export class WorkflowStatesServiceFactory extends Factory {
// 	public static Descriptor = new Descriptor("pip-services-workflowstates", "factory", "default", "default", "1.0");
// 	public static MemoryPersistenceDescriptor = new Descriptor("pip-services-workflowstates", "persistence", "memory", "*", "1.0");
// 	public static FilePersistenceDescriptor = new Descriptor("pip-services-workflowstates", "persistence", "file", "*", "1.0");
// 	public static MongoDbPersistenceDescriptor = new Descriptor("pip-services-workflowstates", "persistence", "mongodb", "*", "1.0");
// 	public static ControllerDescriptor = new Descriptor("pip-services-workflowstates", "controller", "default", "*", "1.0");
// 	public static HttpServiceDescriptor = new Descriptor("pip-services-workflowstates", "service", "http", "*", "1.0");
// 	constructor() {
// 		super();
// 		this.registerAsType(WorkflowStatesServiceFactory.MemoryPersistenceDescriptor, WorkflowStatesMemoryPersistence);
// 		this.registerAsType(WorkflowStatesServiceFactory.FilePersistenceDescriptor, WorkflowStatesFilePersistence);
// 		this.registerAsType(WorkflowStatesServiceFactory.MongoDbPersistenceDescriptor, WorkflowStatesMongoDbPersistence);
// 		this.registerAsType(WorkflowStatesServiceFactory.ControllerDescriptor, WorkflowStatesController);
// 		this.registerAsType(WorkflowStatesServiceFactory.HttpServiceDescriptor, WorkflowStatesHttpServiceV1);
// 	}
// }
//# sourceMappingURL=WorkflowStatesServiceFactory.js.map