import $axios from '@/plugins/ajax'
import store from '@/store'

export const getActiveConnections = (dataSource, permissionTypes) => {
    let httpParameters = {
        token: store.getters.authenticationResult.authToken
    };
    // Add permission filter if specified
    if (permissionTypes) {
        httpParameters.permission = permissionTypes;
    }
    let ary = [];
    dataSource.forEach((item) => {
        let newPromise = new Promise((resolve, reject) => {
            $axios.get(`api/session/data/${encodeURIComponent(item)}/activeConnections`, httpParameters)
                .then((response) => {
                    resolve({
                        key: encodeURIComponent(item),
                        value: response.data
                    });
                });
        })
        ary.push(newPromise);
    });
    return ary;
};