let Error = function Error(template) {
    // Use empty object by default
    template = template || {};

    /**
     * A human-readable message describing the error that occurred.
     *
     * @type String
     */
    this.message = template.message;

    /**
     * A message which can be translated using the translation service,
     * consisting of a translation key and optional set of substitution
     * variables.
     *
     * @type TranslatableMessage
     */
    this.translatableMessage = template.translatableMessage;

    /**
     * The Guacamole protocol status code associated with the error that
     * occurred. This is only valid for errors of type STREAM_ERROR.
     *
     * @type Number
     */
    this.statusCode = template.statusCode;

    /**
     * The type string defining which values this parameter may contain,
     * as well as what properties are applicable. Valid types are listed
     * within Error.Type.
     *
     * @type String
     * @default Error.Type.INTERNAL_ERROR
     */
    this.type = template.type || Error.Type.INTERNAL_ERROR;

    /**
     * Any parameters which were expected in the original request, or are
     * now expected as a result of the original request, if any. If no
     * such information is available, this will be null.
     *
     * @type Field[]
     */
    this.expected = template.expected;
};

/**
 * All valid field types.
 */
Error.Type = {

    /**
     * The requested operation could not be performed because the request
     * itself was malformed.
     *
     * @type String
     */
    BAD_REQUEST: 'BAD_REQUEST',

    /**
     * The credentials provided were invalid.
     *
     * @type String
     */
    INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',

    /**
     * The credentials provided were not necessarily invalid, but were not
     * sufficient to determine validity.
     *
     * @type String
     */
    INSUFFICIENT_CREDENTIALS: 'INSUFFICIENT_CREDENTIALS',

    /**
     * An internal server error has occurred.
     *
     * @type String
     */
    INTERNAL_ERROR: 'INTERNAL_ERROR',

    /**
     * An object related to the request does not exist.
     *
     * @type String
     */
    NOT_FOUND: 'NOT_FOUND',

    /**
     * Permission was denied to perform the requested operation.
     *
     * @type String
     */
    PERMISSION_DENIED: 'PERMISSION_DENIED',

    /**
     * An error occurred within an intercepted stream, terminating that
     * stream. The Guacamole protocol status code of that error will be
     * stored within statusCode.
     *
     * @type String
     */
    STREAM_ERROR: 'STREAM_ERROR'

};

export default Error;