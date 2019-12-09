let ConnectionGroup = {};

ConnectionGroup.ROOT_IDENTIFIER = 'ROOT';

/**
 * All valid connection group types.
 */
ConnectionGroup.Type = {

    /**
     * The type string associated with balancing connection groups.
     *
     * @type String
     */
    BALANCING: 'BALANCING',

    /**
     * The type string associated with organizational connection groups.
     *
     * @type String
     */
    ORGANIZATIONAL: 'ORGANIZATIONAL'

};

export default ConnectionGroup;