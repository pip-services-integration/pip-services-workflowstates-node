import { InvalidStateException } from 'pip-services3-commons-node';

export class ProcessExceptionV1 extends InvalidStateException {
	
	/**
	 * Creates an error instance and assigns its values.
	 * 
     * @param correlationId    (optional) a unique transaction id to trace execution through call chain.
     * @param code              (optional) a unique error code. Default: "UNKNOWN"
     * @param message           (optional) a human-readable description of the error.
	 */
	public constructor(correlationId: string = null, code: string = null, message: string = null) {
		super(correlationId, code, message);
	}
}