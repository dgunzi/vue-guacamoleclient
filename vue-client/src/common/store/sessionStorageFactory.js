import store from '@/store'
import {cloneDeep, isUndefined} from 'lodash'
import eventBus from '../../plugins/eventBus'
let service = {};

/**
 * Creates session-local storage that uses the provided default value or
 * getter to obtain new values as necessary. Beware that if the default is
 * an object, the resulting getter provide deep copies for new values.
 * 创建会话本地存储，该存储使用提供的默认值或getter来根据需要获取新值。注意，如果默认值是对象，则生成的getter将为新值提供深度副本。
 * @param {Function|*} [template]
 *     The default value for new users, or a getter which returns a newly-
 *     created default value.
 *
 * @param {Function} [destructor]
 *     Function which will be called just before the stored value is
 *     destroyed on logout, if a value is stored.
 *
 * @returns {Function}
 *     A getter/setter which returns or sets the current value of the new
 *     session-local storage. Newly-set values will only persist of the
 *     user is actually logged in.
 */
service.create = function create(template, destructor) {
    /**
     * Whether new values may be stored and retrieved.
     *
     * @type Boolean
     */
    let enabled = !!store.getters.authenticationResult.authToken;

    /**
     * Getter which returns the default value for this storage.
     *
     * @type Function
     */
    let getter;

    // If getter provided, use that
    if (typeof template === 'function') {
        getter = template;
    } else { // Otherwise, always create a deep copy
        getter = function getCopy() {
            return cloneDeep(template);
        };
    }

    /**
     * The current value of this storage, or undefined if not yet set.
     */
    let value;

    // Reset value and allow storage when the user is logged in
    eventBus.$on('guacLogin', () => {
        enabled = true;
        value = undefined;
    });

    // Reset value and disallow storage when the user is logged out
    eventBus.$on('guacLogout', () => {
        // Call destructor before storage is teared down
        if (!isUndefined(value) && destructor) { destructor(value); }

        // Destroy storage
        enabled = false;
        value = undefined;
    });

    // Return getter/setter for value
    return function sessionLocalGetterSetter(newValue) {
        // Only actually store/retrieve values if enabled
        if (enabled) {
            // Set value if provided
            if (!isUndefined(newValue)) { value = newValue; }

            // Obtain new value if unset
            if (isUndefined(value)) { value = getter(); }

            // Return current value
            return value;
        }

        // Otherwise, just pretend to store/retrieve
        return !isUndefined(newValue) ? newValue : getter();
    };
};

export default service;