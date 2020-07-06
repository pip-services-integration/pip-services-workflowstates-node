
export class WorkflowStatusConstants {
    public static WorkflowStatusController: string = "Integration.WorkflowStatus.WorkflowStatusController";
    public static CompensationController: string = "Integration.WorkflowStatus.CompensationController";
    public static NotificationController: string = "Integration.WorkflowStatus.NotificationController";
    public static ExpirationController: string = "Integration.WorkflowStatus.ExpirationController";
    public static DefaultTruncateIntervalInDays: number = 90;
    public static MaxOrphanActivitiesCount: number = 10;


    static QueuesHandling = class {
        public static QueuesSubstring: string = "queue";
        public static MessageQueuesSubstring: string = "message_queue";
        public static AccountKeySuffix: string = "account_key";
        public static AccountNameSuffix: string = "account_name";
        public static NameSuffix: string = "name";
        public static DeadNameSuffix: string = "dead_name";
        public static EnabledSuffix: string = "enabled";
        public static ProtocolSuffix: string = "protocol";
        public static IntegrationMicroservicesPrefix: string = "";
    }

    static Partition = class {
        public static Key: string = "partition_key";
        public static Prefix: string = "partition";
        public static Template: string = "{0}_{1}";
        public static Count: number = 10;
    }

    static CollectionNames = class {
        public static WorkflowsOpen: string = "workflows_open";
        public static WorkflowsClosed: string = "workflows_closed";
    }
}