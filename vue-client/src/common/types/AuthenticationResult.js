let AuthenticationResult = function AuthenticationResult(template) {

    // Use empty object by default
    template = template || {};

    /**
     * The unique token generated for the user that authenticated.
     *
     * @type String
     */
    this.authToken = template.authToken;

    /**
     * The name which uniquely identifies the user that authenticated.
     *
     * @type String
     */
    this.username = template.username;

    /**
     * The unique identifier of the data source which authenticated the
     * user.
     *
     * @type String
     */
    this.dataSource = template.dataSource;

    /**
     * The identifiers of all data sources available to the user that
     * authenticated.
     *
     * @type String[]
     */
    this.availableDataSources = template.availableDataSources;

};

/**
 * The username reserved by the Guacamole extension API for users which have
 * authenticated anonymously.
 *
 * @type String
 */
AuthenticationResult.ANONYMOUS_USERNAME = '';

export default AuthenticationResult;