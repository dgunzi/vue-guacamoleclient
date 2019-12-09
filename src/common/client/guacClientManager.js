import sessionStorageFactory from '../store/sessionStorageFactory'
import ManagedClient from './ManagedClient'

let service = {};

/**
 * Getter/setter which retrieves or sets the map of all active managed
 * clients. Each key is the ID of the connection used by that client.
 *
 * @type Function
 */
let storedManagedClients = sessionStorageFactory.create({}, function destroyClientStorage() {
    // Disconnect all clients when storage is destroyed
    service.clear();
});

/**
 * Returns a map of all active managed clients. Each key is the ID of the
 * connection used by that client.
 *
 * @returns {Object.<String, ManagedClient>}
 *     A map of all active managed clients.
 */
service.getManagedClients = function getManagedClients() {
    return storedManagedClients();
};

/**
 * Removes the existing ManagedClient associated with the connection having
 * the given ID, if any. If no such a ManagedClient already exists, this
 * function has no effect.
 *
 * @param {String} id
 *     The ID of the connection whose ManagedClient should be removed.
 *
 * @returns {Boolean}
 *     true if an existing client was removed, false otherwise.
 */
service.removeManagedClient = function removeManagedClient(id) {
    var managedClients = storedManagedClients();

    // Remove client if it exists
    if (id in managedClients) {
        // Disconnect and remove
        managedClients[id].client.disconnect();
        delete managedClients[id];

        // A client was removed
        return true;
    }

    // No client was removed
    return false;
};

/**
 * Creates a new ManagedClient associated with the connection having the
 * given ID. If such a ManagedClient already exists, it is disconnected and
 * replaced.
 *
 * @param {String} id
 *     The ID of the connection whose ManagedClient should be retrieved.
 *
 * @param {String} [connectionParameters]
 *     Any additional HTTP parameters to pass while connecting. This
 *     parameter only has an effect if a new connection is established as
 *     a result of this function call.
 *
 * @returns {ManagedClient}
 *     The ManagedClient associated with the connection having the given
 *     ID.
 */
service.replaceManagedClient = function replaceManagedClient(id, connectionParameters) {
    // Disconnect any existing client
    service.removeManagedClient(id);

    // Set new client
    storedManagedClients()[id] = ManagedClient.getInstance(id, connectionParameters);
    return storedManagedClients()[id];
};

/**
 * Returns the ManagedClient associated with the connection having the
 * given ID. If no such ManagedClient exists, a new ManagedClient is
 * created.
 *
 * @param {String} id
 *     The ID of the connection whose ManagedClient should be retrieved.
 *
 * @param {String} [connectionParameters]
 *     Any additional HTTP parameters to pass while connecting. This
 *     parameter only has an effect if a new connection is established as
 *     a result of this function call.
 *
 * @returns {ManagedClient}
 *     The ManagedClient associated with the connection having the given
 *     ID.
 */
service.getManagedClient = function getManagedClient(id, connectionParameters) {
    var managedClients = storedManagedClients();

    // Create new managed client if it doesn't already exist
    if (!(id in managedClients)) {
        managedClients[id] = ManagedClient.getInstance(id, connectionParameters);
    }

    // Return existing client
    return managedClients[id];
};

/**
 * Disconnects and removes all currently-connected clients.
 */
service.clear = function clear() {
    var managedClients = storedManagedClients();

    // Disconnect each managed client
    for (var id in managedClients) {
        managedClients[id].client.disconnect();
    }
    // Clear managed clients
    storedManagedClients({});
};

// Disconnect all clients when window is unloaded
window.addEventListener('unload', service.clear);

export default service;