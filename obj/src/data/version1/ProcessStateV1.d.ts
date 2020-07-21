import { IStringIdentifiable } from 'pip-services3-commons-node';
import { MessageV1 } from './MessageV1';
import { TaskStateV1 } from './TaskStateV1';
export declare class ProcessStateV1 implements IStringIdentifiable {
    id: string;
    type: string;
    request_id?: string;
    key?: string;
    status?: string;
    start_time?: Date;
    end_time?: Date;
    last_action_time?: Date;
    expiration_time?: Date;
    request?: string;
    comment?: string;
    recovery_time?: Date;
    recovery_queue_name?: string;
    recovery_message?: MessageV1;
    recovery_timeout?: number;
    recovery_attempts?: number;
    lock_token?: string;
    locked_until_time?: Date;
    tasks?: TaskStateV1[];
    data?: any;
}
