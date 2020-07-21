"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
const TaskStatusV1_1 = require("../data/version1/TaskStatusV1");
const TaskStateV1_1 = require("../data/version1/TaskStateV1");
const ProcessInvalidStateExceptionV1_1 = require("../data/version1/ProcessInvalidStateExceptionV1");
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
class TasksManager {
    static hasCompletedTasks(process) {
        return _.filter(process.tasks, a => a.State == TaskStatusV1_1.TaskStatusV1.Completed).length > 0;
    }
    static getExecutingTasks(process, callback) {
        var task = null;
        // Find running task
        if (process.tasks != null) {
            var items = _.filter(process.tasks, a => a.State == TaskStatusV1_1.TaskStatusV1.Executing);
            task = items.length > 0 ? items[0] : null;
        }
        // If task does exist raise error
        if (task == null)
            callback(new ProcessInvalidStateExceptionV1_1.ProcessInvalidStateExceptionV1("Executed task wasn't found in process " + process.id), null);
        callback(null, task);
    }
    static startTasks(process, taskType, queueName, message, callback) {
        if (taskType == null)
            if (callback)
                callback(new pip_services3_commons_node_1.ApplicationException("Tasks type cannot be null"));
        process.tasks = process.tasks || new Array();
        // Create a new one if it was not found
        var task = new TaskStateV1_1.TaskStateV1();
        task.type = taskType,
            task.status = TaskStatusV1_1.TaskStatusV1.Executing,
            task.start_time = new Date(),
            task.queue_name = queueName,
            task.message = message;
        process.tasks.push(task);
    }
    static failTasks(process, errorMessage) {
        process.tasks = process.tasks || new Array();
        // Mark previously running but uncompleted activities as failed
        for (var task of process.tasks) {
            if (task.status == TaskStatusV1_1.TaskStatusV1.Executing) {
                task.status = TaskStatusV1_1.TaskStatusV1.Failed;
                task.end_time = new Date();
                task.error_message = errorMessage || "Unexpected error";
            }
        }
    }
    static getErrorMessage(process) {
        for (var index = process.tasks.length - 1; index >= 0; index--) {
            var task = process.tasks[index];
            if (task.status == TaskStatusV1_1.TaskStatusV1.Failed)
                return task.error_message;
        }
        return null;
    }
    static rollbackTasks(process) {
        process.tasks = process.tasks || new Array();
        process.tasks = _.filter(process.tasks, a => a.State != TaskStatusV1_1.TaskStatusV1.Executing);
    }
    static completeTasks(process) {
        process.tasks = process.tasks || new Array();
        // Mark previously running but uncompleted activities as failed
        for (var task of process.tasks) {
            if (task.status == TaskStatusV1_1.TaskStatusV1.Executing) {
                task.status = TaskStatusV1_1.TaskStatusV1.Completed;
                task.end_time = new Date();
                task.error_message = null;
            }
        }
    }
}
exports.TasksManager = TasksManager;
//# sourceMappingURL=TasksManager.js.map