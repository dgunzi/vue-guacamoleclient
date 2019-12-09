import $axios from '@/plugins/ajax'
import store from '@/store'

let getEffectivePermissionsResourceURL = (dataSource, username) => {
    // Create base URL for data source
    let base = 'api/session/data/' + encodeURIComponent(dataSource);

    // If the username is that of the current user, do not rely on the
    // user actually existing (they may not). Access their permissions via
    // "self" rather than the collection of defined users.
    if (username === store.getters.authenticationResult.userName) {
        return base + '/self/effectivePermissions';
    }

    // Otherwise, the user must exist for their permissions to be
    // accessible. Use the collection of defined users.
    return base + '/users/' + encodeURIComponent(username) + '/effectivePermissions';
};

export const getEffectivePermissions = (dataSource, userID) => {
    let httpParameters = {
        token: store.getters.authenticationResult.authToken
    };
    let ary = [];
    dataSource.forEach((item) => {
        let newPromise = new Promise((resolve, reject) => {
            $axios.get(getEffectivePermissionsResourceURL(item, userID), httpParameters).then((response) => {
                resolve({
                    key: encodeURIComponent(item),
                    value: response.data
                });
            });
        });
        ary.push(newPromise);
    });
    return ary;
};