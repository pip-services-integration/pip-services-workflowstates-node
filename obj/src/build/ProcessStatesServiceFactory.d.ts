import { Factory } from 'pip-services3-components-node';
import { Descriptor } from 'pip-services3-commons-node';
export declare class ProcessStatesServiceFactory extends Factory {
    static Descriptor: Descriptor;
    static MemoryPersistenceDescriptor: Descriptor;
    static FilePersistenceDescriptor: Descriptor;
    static MongoDbPersistenceDescriptor: Descriptor;
    static ControllerDescriptor: Descriptor;
    static HttpServiceDescriptor: Descriptor;
    static CloseExpiredProcessorDescriptor: Descriptor;
    static RecoveryProcessorDescriptor: Descriptor;
    static TruncateProcessorDescriptor: Descriptor;
    constructor();
}
