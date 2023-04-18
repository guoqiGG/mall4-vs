import Vue from 'vue'
import Vuex from 'vuex'
import common from './modules/common'
import user from './modules/user'
import prod from './modules/prod'
import webConfig from './modules/webConfig'
import router from './modules/router'
import lang from './modules/lang'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    common,
    user,
    prod,
    router,
    webConfig,
    lang
  },
  mutations: {

  },
  strict: process.env.NODE_ENV !== 'production'
})
