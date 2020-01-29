<template>
  <div id="canvas">
    <b-breadcrumb>
      <b-breadcrumb-item>راهنما</b-breadcrumb-item>
      <b-breadcrumb-item active>درس های ثبت نام شده</b-breadcrumb-item>
    </b-breadcrumb>
    <div class="input-group mb-3">
      <div class="input-group-prepend">
        <span class="input-group-text" id="basic-addon1">
          <i class="fa fa-search" />
        </span>
      </div>
      <input
        style="text-align:center;"
        type="text"
        id="myInput"
        class="form-control"
        placeholder="جستجو"
        aria-label="Search"
        aria-describedby="basic-addon1"
        v-on:keyup="search"
      />
    </div>
    <div class="table-resposive" style="text-align:center;">
      <table id="dtBasicExample" align="center" class="table">
        <thead>
          <tr>
            <th class>عملیات</th>
            <th class>وضعیت گواهی</th>
            <th class>تاریخ</th>
            <th class>جلسات انجام شده</th>
            <th class>جلسات این درس</th>
            <th class>استاد</th>
            <th class>عنوان درس</th>
            <th class>عنوان دوره</th>
            <th class>#</th>
          </tr>
        </thead>
        <tbody id="myTable">
          <tr
            v-for="(reg_lesson,index) in reg_lessons"
            :key="reg_lesson._id"
            @click="push($event,reg_lesson,index)"
          >
            <td>
              <i
                @click="deleteRegLesson(reg_lesson,index)"
                class="fa fa-remove action-icon"
                style="font-size: 1.5em;"
              />
            </td>
            <td>
              <button
                v-if="!reg_lesson.passed"
                data-v-17b74d76
                type="button"
                class="btn p-1 px-3 btn-xs btn-danger lalezar"
              >صادر نشده</button>
              <button
                v-if="reg_lesson.passed"
                @click="downloadCertificate(reg_lesson)"
                data-v-17b74d76
                type="button"
                class="btn p-1 px-3 btn-xs btn-success lalezar"
              >صادر شده</button>
            </td>
            <td id="numeric-td">{{new Date(reg_lesson.date) | moment("jYYYY/jM/jD | HH:mm ")}}</td>
            <td id="numeric-td">{{reg_lesson.reg_sessions.length}}</td>
            <td id="numeric-td">{{reg_lesson.sessionLength}}</td>
            <td>{{reg_lesson.teacherName}}</td>
            <td>{{reg_lesson.lessonTitle}}</td>
            <td>{{reg_lesson.courseTitle}}</td>
            <td>{{index+1}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div id="modaaal">
      <b-modal id="my-modal" ref="my-modal" scrollable hide-footer title>
        <div></div>
      </b-modal>
    </div>
  </div>
</template>
<script>
import { global } from "@/main.js";
import "imports-loader?$=jquery,this=>window!messenger/build/js/messenger";
const { Messenger } = window;
import jsPDF from "jspdf";
import pdf from "vue-pdf";
import html2canvas from "html2canvas";
export default {
  data() {
    return {
      jwt: null,
      headers: null,
      locationClasses: "messenger-fixed messenger-on-bottom messenger-on-right",
      reg_lessons: null,
      user: {},
      src:
        "http://localhost:3000/files/5df31e3a854c9f3a2c981afe.2-D%20digital%20filter%20-%20MATLAB%20filter2.pdf",
      numPages: [2, 3]
    };
  },
  methods: {
    addSuccessNotification() {
      Messenger().post({
        extraClasses: this.locationClasses,
        message: "Showing success message was successful!",
        type: "success",
        showCloseButton: true
      });
      return false;
    },
    push(e, reg_lesson, index) {
      if (e.target.nodeName == "I" || e.target.nodeName == "BUTTON") {
        return;
      }
      // global.courseId = course._id;
      global.lesson = reg_lesson;
      global.index = index;
      this.$router.push({
        name: "studentQuiz"
      });
    },
    search(e) {
      var value = $("#myInput")
        .val()
        .toLowerCase();
      $("#myTable tr").filter(function() {
        $(this).toggle(
          $(this)
            .text()
            .toLowerCase()
            .indexOf(value) > -1
        );
      });
    },
    deleteRegLesson(reg_lesson, index) {
      this.$swal
        .fire({
          title: `${reg_lesson.lessonTitle}`,
          text: "حذف درس",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          cancelButtonText: "لغو",
          confirmButtonText: "حذف"
        })
        .then(result => {
          if (result.value) {
            var body = {
              userId: this.user.userId,
              reg_lessonId: reg_lesson._id
            };
            this.axios
              .patch(
                "http://localhost:3000/api/user/reg/delete",
                body,
                this.headers
              )
              .then(res => {
                this.reg_lessons = res.data.reg_lessons;
              })
              .catch(err => {
                console.log(err);
              });
          }
        });
    },
    downloadCertificate(reg_lesson) {
      if (reg_lesson.passed) {
        global.reg_lesson = reg_lesson;
        this.$router.push({
          name: "cert"
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
    console.log(this.user);

    this.axios
      .post(
        `http://localhost:3000/api/user/reg/show`,
        {
          userId: this.user.userId
        },
        this.headers
      )
      .then(res => {
        console.log("res.data");
        console.log(res.data);
        this.reg_lessons = res.data.reg_lessons;
      })
      .catch(err => {
        console.log(err);
      });
    // this.initializationMessengerCode();
  },
  components: {
    pdf
  }
};
</script>

<style>
.modal-dialog {
  max-width: 500px !important;
}
</style>
