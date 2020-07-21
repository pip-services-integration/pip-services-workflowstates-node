export declare class MessageV1 {
    /** The unique business transaction id that is used to trace calls across components. */
    correlation_id: string;
    /** The message's auto-generated ID. */
    message_id: string;
    /** String value that defines the stored message's type. */
    message_type: string;
    /** The time at which the message was sent. */
    sent_time: Date;
    /** The stored message. */
    message: string;
}
