/**
 * Created by YOU on 2017/7/18.
 */
import Vue from 'vue'
import Vuex from 'vuex'
// import $axios from '@/plugins/ajax'

Vue.use(Vuex)
let store = new Vuex.Store({
  state: {
      pageTitle: 'APP.NAME',
      bodyClassName: '',
      loginHelpText: null,
      acceptedCredentials: {},
      expectedCredentials: null,
      fatalError: null,
      authenticationResult: {}
  },
  getters: {
      expectedCredentials: state => state.expectedCredentials,
      loginHelpText: state => state.loginHelpText,
      authenticationResult: state => state.authenticationResult,
      fatalError: state => state.loginHelpText
  },
  mutations: {
    SET_TOKEN (state) {
      let authObj = JSON.parse(localStorage.getItem('GUAC_AUTH'));
      state.authenticationResult = {
          authToken: authObj.authToken,
          userName: authObj.username,
          dataSource: authObj.dataSource,
          availableDataSources: authObj.availableDataSources
      };
    },
    REMOVE_TOKEN(state) {
        state.authenticationResult = {};
    },
    setFatalError(state, error) {
        state.fatalError = error;
    },
    guacInvalidCredentials(state, error) {
        state.pageTitle = 'APP.NAME';
        state.bodyClassName = '';
        state.loginHelpText = null;
        state.acceptedCredentials = {};
        state.expectedCredentials = error.expected;
        state.fatalError = null;
    },
    guacInsufficientCredentials(state, error) {
        state.pageTitle = 'APP.NAME';
        state.bodyClassName = '';
        state.loginHelpText = error.translatableMessage;
        state.acceptedCredentials = {};
        state.expectedCredentials = error.expected;
        state.fatalError = null;
    }
  },
  actions: {
  },
  modules: {
  },
  strict: process.env.NODE_ENV !== 'production'
})

export default store
