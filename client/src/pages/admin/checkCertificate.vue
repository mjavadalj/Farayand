<template>
  <div>
    <b-breadcrumb>
      <b-breadcrumb-item>راهنما</b-breadcrumb-item>
      <b-breadcrumb-item active>استعلام گواهی دانشجویان و اساتید</b-breadcrumb-item>
    </b-breadcrumb>
    <div class="input-group mb-3">
      <div class="input-group-prepend">
        <span @click="showCertificates" class="input-group-text curs" id="basic-addon1">
          <i class="fa fa-search" />
        </span>
      </div>
      <input
        style="text-align:center;"
        type="text"
        id="myInput"
        class="form-control"
        placeholder="کد ملی دانشجو یا استاد مورد نظر را وارد کنید"
        aria-label="Search"
        aria-describedby="basic-addon1"
        v-model="nationalcode"
        v-on:keyup.enter="showCertificates"
      />
    </div>
    <div class="table-resposive" style="text-align:center;">
      <table id="dtBasicExample" align="center" class="table">
        <thead>
          <tr>
            <th class>تاریخ صدور گواهی</th>
            <th class>نمره</th>
            <th class>عنوان درس</th>
            <th class>عنوان دوره</th>
            <th class>نام</th>
            <th class>#</th>
          </tr>
        </thead>
        <tbody id="myTable">
          <tr v-for="(certificate,index) in certificates" :key="certificate._id">
            
            <td id="numeric-td">{{new Date(certificate.date) | moment("jYYYY/jM/jD | HH:mm ")}}</td>
            <td>{{certificate.finalScore}}</td>
            <td>{{certificate.lessonTitle}}</td>
            <td>{{certificate.courseTitle}}</td>
            <td>{{certificate.name}}</td>
            <td>{{index+1}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import { global } from "@/main.js";
import "imports-loader?$=jquery,this=>window!messenger/build/js/messenger";
const { Messenger } = window;
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
export default {
  data() {
    return {
      jwt: null,
      headers: null,
      reg_lessons: null,
      user: {},
      certificates: null,
      nationalcode: null
    };
  },
  methods: {
    showCertificates() {
      //TOOD: handle this
      if (this.nationalcode) {
        this.axios
          .post(`http://localhost:3000/api/user/reg/show/certificates`, {
            nationalcode: this.nationalcode
          },this.headers)
          .then(res => {
            if (res.data.length == 0) {
              return alert("برای این کد ملی هیچ گواهی صادر نشده است");
            }
            this.certificates = res.data;
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  },
  mounted() {
    // this.initCharts();
  },
  created() {
    this.user = JSON.parse(this.$cookie.get("authorization"));
    this.headers = {
      headers: {
        Authorization: `Bearer ${this.$cookie.get("jwt")}`
      }
    };
  }
};
</script>

<style>
.curs:hover {
  cursor: pointer;
}
</style>
