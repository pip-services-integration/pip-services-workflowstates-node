// import { Factory } from 'pip-services3-components-node';
// import { Descriptor } from 'pip-services3-commons-node';
// import { ProcessStatesMongoDbPersistence } from '../persistence/ProcessStatesMongoDbPersistence';
// import { ProcessStatesFilePersistence } from '../persistence/ProcessStatesFilePersistence';
// import { ProcessStatesMemoryPersistence } from '../persistence/ProcessStatesMemoryPersistence';
// import { ProcessStatesController } from '../logic/ProcessStatesController';
// import { ProcessStatesHttpServiceV1 } from '../services/version1/ProcessStatesHttpServiceV1';
// export class ProcessStatesServiceFactory extends Factory {
// 	public static Descriptor = new Descriptor("pip-services-processstates", "factory", "default", "default", "1.0");
// 	public static MemoryPersistenceDescriptor = new Descriptor("pip-services-processstates", "persistence", "memory", "*", "1.0");
// 	public static FilePersistenceDescriptor = new Descriptor("pip-services-processstates", "persistence", "file", "*", "1.0");
// 	public static MongoDbPersistenceDescriptor = new Descriptor("pip-services-processstates", "persistence", "mongodb", "*", "1.0");
// 	public static ControllerDescriptor = new Descriptor("pip-services-processstates", "controller", "default", "*", "1.0");
// 	public static HttpServiceDescriptor = new Descriptor("pip-services-processstates", "service", "http", "*", "1.0");
// 	constructor() {
// 		super();
// 		this.registerAsType(ProcessStatesServiceFactory.MemoryPersistenceDescriptor, ProcessStatesMemoryPersistence);
// 		this.registerAsType(ProcessStatesServiceFactory.FilePersistenceDescriptor, ProcessStatesFilePersistence);
// 		this.registerAsType(ProcessStatesServiceFactory.MongoDbPersistenceDescriptor, ProcessStatesMongoDbPersistence);
// 		this.registerAsType(ProcessStatesServiceFactory.ControllerDescriptor, ProcessStatesController);
// 		this.registerAsType(ProcessStatesServiceFactory.HttpServiceDescriptor, ProcessStatesHttpServiceV1);
// 	}
// }
//# sourceMappingURL=ProcessStatesServiceFactory.js.map