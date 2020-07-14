
let _ = require('lodash');

import { TaskStatusV1 } from "../data/version1/TaskStatusV1";
import { TaskStateV1 } from "../data/version1/TaskStateV1";
import { ProcessStateV1 } from "../data/version1/ProcessStateV1";
import { ProcessInvalidStateExceptionV1 } from '../data/version1/ProcessInvalidStateExceptionV1';
import { MessageEnvelope } from 'pip-services3-messaging-node';
import { MessageV1 } from "../data/version1/MessageV1";
import { ApplicationException } from "pip-services3-commons-node";

export class ActivityManager {
    public static hasCompletedActivities(process: ProcessStateV1): boolean {
        return _.filter(process.tasks,
            a => a.State == TaskStatusV1.Completed
        ).length > 0;
    }

    public static getExecutingActivity(process: ProcessStateV1, callback:(err:any, task:TaskStateV1)=>void):void  {

        var task: TaskStateV1 = null;
        // Find running task
        if (process.tasks != null) {
            var items = _.filter(process.tasks,
                a => a.State == TaskStatusV1.Executing
            )
            task = items.length > 0 ? items[0] : null;
        }

        // If task does exist raise error
        if (task == null)
            callback(new ProcessInvalidStateExceptionV1("Executed task wasn't found in process " + process.id), null);
        callback(null, task);
    }

    public static startActivity(process: ProcessStateV1, taskType: string, queueName: string, message: MessageEnvelope, callback?: (err: any) => void): void {
        if (taskType == null)
            if (callback)
                callback(new ApplicationException("Activity type cannot be null"));

        process.tasks = process.tasks ?? new Array<TaskStateV1>();

        // Create a new one if it was not found
        var task = new TaskStateV1();

        task.type = taskType,
            task.status = TaskStatusV1.Executing,
            task.start_time = new Date(),
            task.queue_name = queueName,
            task.message = this.convertMessage(message);

        process.tasks.push(task);
    }

    public static failActivities(process: ProcessStateV1, errorMessage: string) {
        process.tasks = process.tasks ?? new Array<TaskStateV1>();

        // Mark previously running but uncompleted activities as failed
        for (var task of process.tasks) {
            if (task.status == TaskStatusV1.Executing) {
                task.status = TaskStatusV1.Failed;
                task.end_time = new Date();
                task.error_message = errorMessage ?? "Unexpected error";
            }
        }
    }

    public static getErrorMessage(process: ProcessStateV1): string {
        for (var index = process.tasks.length - 1; index >= 0; index--) {
            var task = process.tasks[index];
            if (task.status == TaskStatusV1.Failed)
                return task.error_message;
        }

        return null;
    }
    public static rollbackActivities(process: ProcessStateV1) {
        process.tasks = process.tasks ?? new Array<TaskStateV1>();

        process.tasks = _.filter(process.tasks,
            a => a.State != TaskStatusV1.Executing
        );
    }

    public static completeActivity(process: ProcessStateV1) {
        process.tasks = process.tasks ?? new Array<TaskStateV1>();

        // Mark previously running but uncompleted activities as failed
        for (var task of process.tasks) {
            if (task.status == TaskStatusV1.Executing) {
                task.status = TaskStatusV1.Completed;
                task.end_time = new Date();
                task.error_message = null;
            }
        }
    }

    private static convertMessage(msg: MessageEnvelope): MessageV1 {
        var item = new MessageV1();
        item.correlation_id = msg.correlation_id;
        item.message = msg.getMessageAsString();
        item.message_id = msg.message_id;
        item.message_type = msg.message_type;
        item.sent_time = msg.sent_time;
        return item;
    }
}

