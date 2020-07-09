export class MessageV1 {
    /** The unique business transaction id that is used to trace calls across components. */
    public correlation_id: string;
    /** The message's auto-generated ID. */
    public message_id: string;
    /** String value that defines the stored message's type. */
    public message_type: string;
    /** The time at which the message was sent. */
    public sent_time: Date;
    /** The stored message. */
    public message: string;
}