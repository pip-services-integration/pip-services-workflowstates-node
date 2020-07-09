import { IStringIdentifiable } from 'pip-services3-commons-node';
import { MessageV1 } from './MessageV1';
import { ActivityStateV1 } from './ActivityStateV1';
export declare class WorkflowStateV1 implements IStringIdentifiable {
    id: string;
    type: string;
    initiator_id?: string;
    key?: string;
    status?: string;
    start_time?: Date;
    end_time?: Date;
    last_action_time?: Date;
    expiration_time?: Date;
    request?: string;
    comment?: string;
    compensation_time?: string;
    compensation_queue_name?: string;
    compensation_message?: MessageV1;
    compensation_timeout?: number;
    attempt_count?: number;
    lock_token?: string;
    locked_until_time?: Date;
    activities?: ActivityStateV1[];
    data?: any;
}
