import $axios from '@/plugins/ajax'
import store from '@/store'

export const getUser = (dataSource, userName) => {
    let httpParameters = {
        token: store.getters.authenticationResult.authToken
    };
    return $axios.get(`api/session/data/${encodeURIComponent(dataSource)}/users/${encodeURIComponent(userName)}`, httpParameters)
};