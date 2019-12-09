import router from './router'
import store from './store'
import Sunflower from 'vue-sunflower'
import {getTokens, delTokens} from './rest/authenticationService';
import Error from '@/common/types/Error'
import qs from 'querystring'
let Load = null
let AUTH_STORAGE_KEY = 'GUAC_AUTH';
router.beforeEach(function (to, from, next) {
  // 移除所有echarts重绘事件
  Sunflower.EventBus.$off('rebuild');
  if (to.path === from.path || from.path === '/') {
    Load = Sunflower.Loading.service({text: 'loading...'})
  }
  if (to.path !== from.path && from.path !== '/') {
    Sunflower.LoadingBar.start()
  }
  let excludePaths = ['/error', '/404', '/login'];
  if (excludePaths.includes(to.path)) {
    next();
  } else {
      if (localStorage.getItem('GUAC_AUTH')) {
          store.commit('SET_TOKEN');
      }
      let parameters = {};
      let currentToken = store.getters.authenticationResult.authToken;
      if (currentToken) {
          parameters.token = currentToken;
      }
      getTokens(qs.stringify(parameters), {
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
          }
      }).then(({data}) => {
          // 从storge中获取基本信息
          let currentToken = store.getters.authenticationResult.authToken;
          if (data.authToken !== currentToken) {
              if (currentToken) {
                  localStorage.removeItem(AUTH_STORAGE_KEY);
                  store.commit('REMOVE_TOKEN');
                  delTokens(currentToken);
              }
              localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
              store.commit('SET_TOKEN');
          } else {
              localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
              store.commit('SET_TOKEN');
          }
          next();
      }).catch((error) => {
          let response = error.response;
          if (response.data.type === Error.Type.INVALID_CREDENTIALS) {
              // 如果提供的凭据无效，则请求凭据
              store.commit('guacInvalidCredentials', response.data);
              next('/login');
          } else if (response.data.type === Error.Type.INSUFFICIENT_CREDENTIALS) {
              // 如果提供的凭据不够，则请求更多凭据
              store.commit('guacInsufficientCredentials', response.data);
              next('/login');
          } else if (response.data.type === Error.Type.INTERNAL_ERROR) {
              this.$store.commit('setFatalError', response.data);
              next('/error');
          }
          // 身份验证失败
          throw error;
      });
  }
})

router.afterEach((to, from) => {
  if (to.path === from.path || from.path === '/') {
    setTimeout(function () { Load.close() }, 0)
  }
  if (to.path !== from.path && from.path !== '/') {
    Sunflower.LoadingBar.finish()
  }
})
