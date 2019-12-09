let service = {};

/**
 * Given an arbitrary identifier, returns the corresponding translation
 * table identifier. Translation table identifiers are uppercase strings,
 * word components separated by single underscores. For example, the
 * string "Swap red/blue" would become "SWAP_RED_BLUE".
 *
 * @param {String} identifier
 *     The identifier to transform into a translation table identifier.
 *
 * @returns {String}
 *     The translation table identifier.
 */
service.canonicalize = function canonicalize(identifier) {
    return identifier.replace(/[^a-zA-Z0-9]+/g, '_').toUpperCase();
};

export default service;