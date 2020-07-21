import { MessageV1 } from './MessageV1';
export declare class TaskStateV1 {
    type: string;
    status?: string;
    start_time?: Date;
    end_time?: Date;
    queue_name?: string;
    message?: MessageV1;
    error_message?: string;
}
