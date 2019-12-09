var service = {};

/**
 * Makes a request to the REST API to get a single active connection,
 * returning a promise that provides the corresponding
 * @link{ActiveConnection} if successful.
 *
 * @param {String} dataSource
 *     The identifier of the data source to retrieve the active connection
 *     from.
 *
 * @param {String} id
 *     The identifier of the active connection.
 *
 * @returns {Promise.<ActiveConnection>}
 *     A promise which will resolve with a @link{ActiveConnection} upon
 *     success.
 */
service.getActiveConnection = function getActiveConnection(dataSource, id) {
/*

    // Build HTTP parameters set
    var httpParameters = {
        token : authenticationService.getCurrentToken()
    };

    // Retrieve active connection
    return requestService({
        method  : 'GET',
        url     : 'api/session/data/' + encodeURIComponent(dataSource) + '/activeConnections/' + encodeURIComponent(id),
        params  : httpParameters
    });
*/

};

/**
 * Makes a request to the REST API to get the list of active tunnels,
 * returning a promise that provides a map of @link{ActiveConnection}
 * objects if successful.
 *
 * @param {String[]} [permissionTypes]
 *     The set of permissions to filter with. A user must have one or more
 *     of these permissions for an active connection to appear in the
 *     result.  If null, no filtering will be performed. Valid values are
 *     listed within PermissionSet.ObjectType.
 *
 * @returns {Promise.<Object.<String, ActiveConnection>>}
 *     A promise which will resolve with a map of @link{ActiveConnection}
 *     objects, where each key is the identifier of the corresponding
 *     active connection.
 */
service.getActiveConnections = function getActiveConnections(dataSource, permissionTypes) {
/*

    // Build HTTP parameters set
    var httpParameters = {
        token : authenticationService.getCurrentToken()
    };

    // Add permission filter if specified
    if (permissionTypes)
        httpParameters.permission = permissionTypes;

    // Retrieve tunnels
    return requestService({
        method  : 'GET',
        url     : 'api/session/data/' + encodeURIComponent(dataSource) + '/activeConnections',
        params  : httpParameters
    });
*/

};

/**
 * Makes a request to the REST API to delete the active connections having
 * the given identifiers, effectively disconnecting them, returning a
 * promise that can be used for processing the results of the call.
 *
 * @param {String[]} identifiers
 *     The identifiers of the active connections to delete.
 *
 * @returns {Promise}
 *     A promise for the HTTP call which will succeed if and only if the
 *     delete operation is successful.
 */
service.deleteActiveConnections = function deleteActiveConnections(dataSource, identifiers) {
/*

    // Build HTTP parameters set
    var httpParameters = {
        token : authenticationService.getCurrentToken()
    };

    // Convert provided array of identifiers to a patch
    var activeConnectionPatch = [];
    identifiers.forEach(function addActiveConnectionPatch(identifier) {
        activeConnectionPatch.push({
            op   : 'remove',
            path : '/' + identifier
        });
    });

    // Perform active connection deletion via PATCH
    return requestService({
        method  : 'PATCH',
        url     : 'api/session/data/' + encodeURIComponent(dataSource) + '/activeConnections',
        params  : httpParameters,
        data    : activeConnectionPatch
    });
*/

};

/**
 * Makes a request to the REST API to generate credentials which have
 * access strictly to the given active connection, using the restrictions
 * defined by the given sharing profile, returning a promise that provides
 * the resulting @link{UserCredentials} object if successful.
 *
 * @param {String} id
 *     The identifier of the active connection being shared.
 *
 * @param {String} sharingProfile
 *     The identifier of the sharing profile dictating the
 *     semantics/restrictions which apply to the shared session.
 *
 * @returns {Promise.<UserCredentials>}
 *     A promise which will resolve with a @link{UserCredentials} object
 *     upon success.
 */
service.getSharingCredentials = function getSharingCredentials(dataSource, id, sharingProfile) {
/*

    // Build HTTP parameters set
    var httpParameters = {
        token : authenticationService.getCurrentToken()
    };

    // Generate sharing credentials
    return requestService({
        method  : 'GET',
        url     : 'api/session/data/' + encodeURIComponent(dataSource)
            + '/activeConnections/' + encodeURIComponent(id)
            + '/sharingCredentials/' + encodeURIComponent(sharingProfile),
        params  : httpParameters
    });
*/

};

export default service;