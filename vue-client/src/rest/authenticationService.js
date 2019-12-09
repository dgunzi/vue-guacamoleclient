import $axios from '@/plugins/ajax'
import eventBus from '@/plugins/eventBus'

export const getTokens = (param, config) => { return $axios.post(`api/tokens`, param, config) };

export const delTokens = (token) => {
    eventBus.$emit('guacLogout')
    return $axios.delete(`api/tokens/${token}`);
};