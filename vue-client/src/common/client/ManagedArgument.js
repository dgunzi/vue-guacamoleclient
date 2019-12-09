import Guacamole from 'guacamole-common-js'

/**
 * 提供ManagedClient使用的ManagedArgument类。
 * @param template
 * @constructor
 */

let ManagedArgument = function ManagedArgument(template) {
    // Use empty object by default
    template = template || {};

    /**
     * The name of the connection parameter.
     *
     * @type {String}
     */
    this.name = template.name;

    /**
     * The current value of the connection parameter.
     *
     * @type {String}
     */
    this.value = template.value;

    /**
     * A valid, open output stream which may be used to apply a new value
     * to the connection parameter.
     *
     * @type {Guacamole.OutputStream}
     */
    this.stream = template.stream;
};

/**
 * Requests editable access to a given connection parameter, returning a
 * promise which is resolved with a ManagedArgument instance that provides
 * such access if the parameter is indeed editable.
 *
 * @param {ManagedClient} managedClient
 *     The ManagedClient instance associated with the connection for which
 *     an editable version of the connection parameter is being retrieved.
 *
 * @param {String} name
 *     The name of the connection parameter.
 *
 * @param {String} value
 *     The current value of the connection parameter, as received from a
 *     prior, inbound "argv" stream.
 *
 * @returns {Promise.<ManagedArgument>}
 *     A promise which is resolved with the new ManagedArgument instance
 *     once the requested parameter has been verified as editable.
 */
ManagedArgument.getInstance = function getInstance(managedClient, name, value) {
    return new Promise((resolve, reject) => {
        // Create internal, fully-populated instance of ManagedArgument, to be
        // returned only once mutability of the associated connection parameter
        // has been verified
        var managedArgument = new ManagedArgument({
            name: name,
            value: value,
            stream: managedClient.client.createArgumentValueStream('text/plain', name)
        });

        // The connection parameter is editable only if a successful "ack" is
        // received
        managedArgument.stream.onack = function ackReceived(status) {
            if (status.isError()) {
                reject(status);
            } else {
                resolve(managedArgument);
            }
        };
    });
};

/**
 * Sets the given editable argument (connection parameter) to the given
 * value, updating the behavior of the associated connection in real-time.
 * If successful, the ManagedArgument provided cannot be used for future
 * calls to setValue() and must be replaced with a new instance. This
 * function only has an effect if the new parameter value is different from
 * the current value.
 *
 * @param {ManagedArgument} managedArgument
 *     The ManagedArgument instance associated with the connection
 *     parameter being modified.
 *
 * @param {String} value
 *     The new value to assign to the connection parameter.
 *
 * @returns {Boolean}
 *     true if the connection parameter was sent and the provided
 *     ManagedArgument instance may no longer be used for future setValue()
 *     calls, false if the connection parameter was NOT sent as it has not
 *     changed.
 */
ManagedArgument.setValue = function setValue(managedArgument, value) {
    // Stream new value only if value has changed
    if (value !== managedArgument.value) {
        var writer = new Guacamole.StringWriter(managedArgument.stream);
        writer.sendText(value);
        writer.sendEnd();

        // ManagedArgument instance is no longer usable
        return true;
    }

    // No parameter value change was attempted and the ManagedArgument
    // instance may be reused
    return false;
};

export default ManagedArgument;