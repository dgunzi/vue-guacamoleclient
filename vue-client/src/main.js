import Vue from 'vue'
import App from './App'

import Sunflower from 'vue-sunflower'
import router from './router'
import store from './store'
import i18n from './i18n'
import './permission'
import ListItem from './common/components/ListItem'

Vue.config.productionTip = false;

Vue.use(Sunflower)
Vue.component('list-item', ListItem);
i18n.locale = 'zh'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  i18n,
  router,
  store,
  template: '<App/>',
  components: {App}
})