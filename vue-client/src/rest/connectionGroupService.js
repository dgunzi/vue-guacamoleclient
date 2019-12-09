import $axios from '@/plugins/ajax'
import ConnectionGroup from '@/common/types/ConnectionGroup'
import store from '@/store'

export const getConnectionGroupTree = (dataSource, connectionGroupID, permissionTypes) => {
    let httpParameters = {
        token: store.getters.authenticationResult.authToken
    };
    if (permissionTypes) {
        httpParameters.permission = permissionTypes;
    }
    connectionGroupID = connectionGroupID || ConnectionGroup.ROOT_IDENTIFIER;
    let ary = [];
    dataSource.forEach((item) => {
        let newPromise = new Promise((resolve, reject) => {
            $axios.get(`api/session/data/${encodeURIComponent(item)}/connectionGroups/${encodeURIComponent(connectionGroupID)}/tree`, httpParameters)
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