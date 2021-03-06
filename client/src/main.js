// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import "expose-loader?jQuery!jquery"; // eslint-disable-line
import "expose-loader?$!jquery"; // eslint-disable-line
import Vue from "vue";
import BootstrapVue from "bootstrap-vue";
import * as VueGoogleMaps from "vue2-google-maps";
import VueTouch from "vue-touch";
import Trend from "vuetrend";
import axios from "axios";
import VueAxios from "vue-axios";
import store from "./store";
import router from "./Routes";
import App from "./App";
import VueSweetalert2 from "vue-sweetalert2";
import VueJWT from 'vuejs-jwt'
import moment from 'moment-jalaali'
import VueHtml2Canvas from 'vue-html2canvas';

Vue.use(VueHtml2Canvas);
Vue.use(moment)
Vue.use(VueJWT)
Vue.use(require('vue-cookie'));
Vue.use(require('vue-moment-jalaali'));
Vue.use(VueSweetalert2);
Vue.use(VueAxios, axios);
Vue.use(BootstrapVue);
Vue.use(VueTouch);
Vue.use(Trend);

Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyB7OXmzfQYua_1LEhRdqsoYzyJOPh9hGLg"
  }
});

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  store,
  router,
  render: h => h(App)
});
export const global = new Vue({
  data: {
    courseId: null,
    lessonId: null,
    teacherId: null,
    sessionId: null,
    course: null,
    lesson: null,
    session: null,
    teacher: null,
    index: null,
    interval: null,
    reg_lesson:null,
    user:null
  }
});