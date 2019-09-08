import Vue from 'vue';
import Vuex from 'vuex';

import layout from './layout';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    layout,
  },
  state: {
    test: [{ name: "sa22dfsad" }, { name: "sadfsad" }, { name: "sadfsad" }, { name: "sadfsad" },]
  }
});
