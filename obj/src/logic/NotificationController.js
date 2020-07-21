// import { IReferenceable, IReferences } from "pip-services3-commons-node";
// import { ProcessStateV1 } from "../data/version1/ProcessStateV1";
// import { TasksStateV1 } from '../data/version1/TasksStateV1';
// export class NotificationController extends IReferenceable {
//     private readonly static _notificationTimeout: number = 7 * 24 * 60 * 60 * 1000;
//     private _notifications: INotificationClient;
//     public controller(notifications: INotificationClient) {
//         this._notifications = notifications;
//     }
//     public setReferences(references: IReferences): void {
//         this._notifications = this._notifications
//             ?? references.getOneRequired<INotificationClient>(KnownDescriptor.Notification);
//     }
//     private  getArea(status: ProcessStateV1):string {
//         var pos = status.type.indexOf('.');
//         if (pos <= 0) return null;
//         return status.type.substring(0, pos);
//     }
//     private Notification.Version1.Notification createNotification( status:ProcessStateV1) {
//         // Send notification
//         var notification = new Notification.Version1.Notification()
//             notification.area = this.getArea(status);
//             notification.component = status.type;
//             notification.create_time = new Date();
//             notification.expiration_time = new Date(Date.now() + NotificationController._notificationTimeout);
//             notification.objectType = status.type;
//             notification.objectId = status.id;
//             notification.objectKey = status.key;
//         return notification;
//     }
//     public async Task NotifyFailedWorkflowAsync( status:ProcessStateV1) {
//         var task = TasksManager.GetExecutingTasks(status, false) ?? new TasksStateV1();
//         // Send notification
//         var notification = CreateNotification(status);
//         notification.Type = "WorkflowFailed";
//         notification.Title = "Failed " + status.Type + " " + status.Id;
//         notification.Description = task != null && task.ErrorMessage != null
//             ? task.ErrorMessage : "Please review and take actions";
//         notification.Severity = NotificationSeverity.Important;
//         await this._notifications.CreateAsync(status.id, notification);
//     }
//     public async Task NotifyWorkflowRequestAsync( status:ProcessStateV1,  request:string) {
//         var task = TasksManager.GetExecutingTasks(status, false) ?? new TasksStateV1();
//         // Send notification
//         var notification = CreateNotification(status);
//         notification.Type = "WorkflowRequest";
//         notification.Title = "Request from " + status.Type + " " + status.Id;
//         notification.Description = request ?? "Please review and take actions";
//         notification.Severity = NotificationSeverity.Important;
//         await _notifications.CreateAsync(status.Id, notification);
//     }
//     public async Task CloseNotificationsAsync(ProcessStateV1 status) {
//         var filter = FilterParams.FromTuples(
//             "Area", GetArea(status),
//             "Component", status.Type,
//             "ObjectType", status.Type,
//             "ObjectId", status.Id,
//             "ObjectKey", status.Key
//         );
//         await _notifications.CloseAsync(status.Id, filter);
//     }
// }
//# sourceMappingURL=NotificationController.js.map