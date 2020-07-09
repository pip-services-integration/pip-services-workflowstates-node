import { MessageV1 } from './MessageV1';
export declare class ActivityStateV1 {
    type: string;
    status?: string;
    state_time?: Date;
    end_time?: Date;
    queue_name?: string;
    message?: MessageV1;
    error_message?: string;
}
