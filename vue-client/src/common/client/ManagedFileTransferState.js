import Guacamole from 'guacamole-common-js'
/**
 * Object which represents the state of a Guacamole stream, including any
 * error conditions.
 *
 * @constructor
 * @param {ManagedFileTransferState|Object} [template={}]
 *     The object whose properties should be copied within the new
 *     ManagedFileTransferState.
 */
var ManagedFileTransferState = function ManagedFileTransferState(template) {
    // Use empty object by default
    template = template || {};

    /**
     * The current stream state. Valid values are described by
     * ManagedFileTransferState.StreamState.
     *
     * @type String
     * @default ManagedFileTransferState.StreamState.IDLE
     */
    this.streamState = template.streamState || ManagedFileTransferState.StreamState.IDLE;

    /**
     * The status code of the current error condition, if streamState
     * is ERROR. For all other streamState values, this will be
     * @link{Guacamole.Status.Code.SUCCESS}.
     *
     * @type Number
     * @default Guacamole.Status.Code.SUCCESS
     */
    this.statusCode = template.statusCode || Guacamole.Status.Code.SUCCESS;
};

/**
 * Valid stream state strings. Each state string is associated with a
 * specific state of a Guacamole stream.
 */
ManagedFileTransferState.StreamState = {

    /**
     * The stream has not yet been opened.
     *
     * @type String
     */
    IDLE: 'IDLE',

    /**
     * The stream has been successfully established. Data can be sent or
     * received.
     *
     * @type String
     */
    OPEN: 'OPEN',

    /**
     * The stream has terminated successfully. No errors are indicated.
     *
     * @type String
     */
    CLOSED: 'CLOSED',

    /**
     * The stream has terminated due to an error. The associated error code
     * is stored in statusCode.
     *
     * @type String
     */
    ERROR: 'ERROR'

};

/**
 * Sets the current transfer state and, if given, the associated status
 * code. If an error is already represented, this function has no effect.
 *
 * @param {ManagedFileTransferState} transferState
 *     The ManagedFileTransferState to update.
 *
 * @param {String} streamState
 *     The stream state to assign to the given ManagedFileTransferState, as
 *     listed within ManagedFileTransferState.StreamState.
 *
 * @param {Number} [statusCode]
 *     The status code to assign to the given ManagedFileTransferState, if
 *     any, as listed within Guacamole.Status.Code. If no status code is
 *     specified, the status code of the ManagedFileTransferState is not
 *     touched.
 */
ManagedFileTransferState.setStreamState = function setStreamState(transferState, streamState, statusCode) {
    // Do not set state after an error is registered
    if (transferState.streamState === ManagedFileTransferState.StreamState.ERROR) { return; }

    // Update stream state
    transferState.streamState = streamState;

    // Set status code, if given
    if (statusCode) { transferState.statusCode = statusCode; }
};

export default ManagedFileTransferState;