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
// import VueSwal from "vue-swal";
import VueSweetalert2 from "vue-sweetalert2";
Vue.use(VueSweetalert2);
// Vue.use(VueSwal);
Vue.use(VueAxios, axios);
// import Vuetify from 'vuetify/lib'
Vue.use(BootstrapVue);
// Vue.use(Vuetify);
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
    sessionId:null,
    course:null,
    lesson:null,
    session:null,
    teacher:null,
  }
});
