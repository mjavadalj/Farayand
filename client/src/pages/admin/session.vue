<template>
  <div>
    <b-breadcrumb>
      <b-breadcrumb-item>راهنما</b-breadcrumb-item>
      <b-breadcrumb-item active>دوره {{course.title}}</b-breadcrumb-item>
      <b-breadcrumb-item active>درس {{lesson.title}}</b-breadcrumb-item>
      <b-breadcrumb-item active>جلسه ها</b-breadcrumb-item>
    </b-breadcrumb>
    <!-- <h3 class="display-3 text-right">{{lesson.title}}</h3> -->
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
            <th class>تاریخ</th>
            <th class>شانس مجدد</th>
            <th class>مدت زمان آزمون</th>
            <th class>حداقل نمره قبولی</th>
            <th class>تعداد سوال</th>
            <!-- <th class>سوال دانشجو</th> -->
            <th class>عنوان جلسه</th>
            <th class>#</th>
          </tr>
        </thead>
        <tbody id="myTable">
          <tr v-for="(session,index) in sessions" :key="session._id" @click="push($event,session)">
            <td>
              <i
                @click="deleteSession(session)"
                class="fa fa-remove action-icon"
                style="font-size: 1.5em;"
              />
              <i
                @click="editSession(session,index)"
                class="fa fa-edit action-icon"
                style="font-size: 1.5em;"
              />
              <i
                @click="download(session)"
                class="fa fa-download action-icon"
                style="font-size: 1.5em;"
              />
            </td>
            <td id="numeric-td">{{new Date(session.quizDate) | moment("jYYYY/jM/jD | HH:mm ")}}</td>
            <td id="numeric-td">{{session.secondChance}}</td>
            <td id="numeric-td">{{session.duration}}</td>
            <td id="numeric-td">{{session.minScore}}</td>
            <td id="numeric-td">{{session.questionLength}}</td>
            <!-- <td>{{session.userQCount}}</td> -->
            <td>{{session.title}}</td>
            <td id="numeric-td">{{index+1}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div>
      <button id="fixedbutton" class="btn btn-primary" type="button" @click="addSession()">
        <i class="fa fa-plus" />
      </button>

      <div id="modaaal">
        <b-modal id="my-modal" ref="my-modal" scrollable hide-footer title>
          <div>
            <pdf v-for="i in numPages" :key="i" :src="src" :page="i"></pdf>
          </div>
        </b-modal>
      </div>
    </div>
  </div>
</template>
<script>
import { global } from "@/main.js";
import pdf from "vue-pdf";
export default {
  data() {
    return {
      jwt: null,
      headers: null,
      course: null,
      lesson: null,
      sessions: null,
      courseId: null,
      files: null,
      uploadedFile: null,
      selectedSession: null,
      src: "",
      numPages: []
    };
  },

  methods: {
    push(e, data) {
      if (e.target.nodeName == "I") {
        return;
      }
      global.sessionId = data._id;
      global.course = this.course;
      global.lesson = this.lesson;
      global.session = data;
      if (global.teacherId != null) {
        this.$router.push({
          name: "tquestion",
          params: {
            title: data.title
          }
        });
      } else {
        this.$router.push({
          name: "question",
          params: {
            title: data.title
          }
        });
      }
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
      console.log(value);
    },
    async addSession(
      title = "",
      content = "",
      duration = "",
      secondChance = "",
      minScore = "",
      userQCount = "",
      starting_page = "",
      ending_page = ""
    ) {
      const { value: formValues2 } = await this.$swal.fire({
        html: `
                        <div class="card">
                        <div class="card-header">
                          <strong class="lalezar" >جلسه جدید</strong>
                        </div>
                        </br>
                        <div class="form-group">
                        <div class="">
                          <label class="lalezar" for="title">عنوان جلسه</label>
                                <input
                                  value="${title}"
                                  type="text"
                                  id="title"
                                  name="title"
                                  placeholder="عنوان جلسه را وارد کنید"
                                  class="form-control"
                                />
                        </div>
                        </br>
                        <div>
                          <label class="lalezar"  for="content">توضیحات راجع به جلسه</label>
                          <textarea class="form-control text-center" rows="3" id="content"> ${content}</textarea>
                      </div> 
                      </br>
                      <div class="">
                        <label class="lalezar"  for="title">مدت زمان آزمون </label>
                              <input
                                value="${duration}"
                                type="number"
                                id="duration"
                                name="duration"
                                placeholder="مدت زمان آزمون را مشخص کنید"
                                class="form-control"
                              />
                      </div>
                      </br>
                      <div class="">
                        <label class="lalezar"  for="title">حداقل نمره قبولی در آزمون</label>
                              <input
                                value="${minScore}"
                                type="number"
                                id="minScore"
                                name="minScore"
                                placeholder="حداقل نمره قبولی را به درصد وارد کنید"
                                class="form-control"
                              />
                      </div> 
                      </br>
                      <div class="">
                        <label class="lalezar"  for="title">شانس مجدد</label>
                              <input
                                value="${secondChance}"
                                type="number"
                                id="secondChance"
                                name="secondChance"
                                placeholder="چند روز پس از آزمون"
                                class="form-control"
                              />
                      </div>
                      <div class="">
                        <label class="lalezar"  for="title"> سوال دانشجو</label>
                              <input
                                value="${userQCount}"
                                type="number"
                                id="userQCount"
                                name="userQCount"
                                placeholder="تعداد سوالاتی که برای دانشجو نمایش داده می شود"
                                class="form-control"
                              />
                      </div>
                      <div class="">
                        <label class="lalezar"  for="title"> صفحه شروع</label>
                              <input
                                value="${starting_page}"
                                type="number"
                                id="starting_page"
                                name="starting_page"
                                placeholder="صفحه شروع"
                                class="form-control"
                              />
                      </div> 
                      <div class="">
                        <label class="lalezar"  for="title"> صفحه پایان</label>
                              <input
                                value="${ending_page}"
                                type="number"
                                id="ending_page"
                                name="ending_page"
                                placeholder="صفحه پایان"
                                class="form-control"
                              />
                      </div>        
                      </div>`,
        focusConfirm: false,
        preConfirm: () => {
          var title = document.getElementById("title").value;
          var content = document.getElementById("content").value;
          var duration = document.getElementById("duration").value;
          var minScore = document.getElementById("minScore").value;
          var secondChance = document.getElementById("secondChance").value;
          var userQCount = document.getElementById("userQCount").value;
          var starting_page = document.getElementById("starting_page").value;
          var ending_page = document.getElementById("ending_page").value;
          var ok = false;
          if (
            title == "" ||
            content == "" ||
            duration == "" ||
            minScore == "" ||
            secondChance == "" ||
            userQCount == "" ||
            starting_page == "" ||
            ending_page == "" ||
            parseInt(starting_page) > parseInt(ending_page)
          ) {
            setTimeout(() => {
              this.addSession(
                title,
                content,
                duration,
                secondChance,
                minScore,
                userQCount,
                starting_page,
                ending_page
              );
            }, 0);
          } else {
            ok = true;
          }
          return {
            ok,
            title,
            content,
            secondChance,
            duration,
            minScore,
            userQCount,
            starting_page,
            ending_page
          };
        }
      });
      if (formValues2 == undefined || formValues2.ok == false) {
        return;
      }
      console.log(this.courseId);
      var session = {
        title: formValues2.title,
        content: formValues2.content,
        secondChance: formValues2.secondChance,
        duration: parseInt(formValues2.duration),
        minScore: parseInt(formValues2.minScore),
        userQCount: parseInt(formValues2.userQCount),
        starting_page: parseInt(formValues2.starting_page),
        ending_page: parseInt(formValues2.ending_page)
      };
      this.axios
        .patch(
          `http://localhost:3000/api/session/add`,
          {
            courseId: this.courseId,
            lessonId: this.lessonId,
            session
          },
          this.headers
        )
        .then(res => {
          this.$swal.fire({
            type: "success",
            title: "موفق",
            text: "جلسه با موفقیت ثبت شد"
          });
          console.log("res.data");
          console.log(res.data);
          session["date"] = new Date(Date.now());
          console.log(session);
          console.log(this.sessions);

          this.sessions.push(session);
        })
        .catch(err => {
          console.log(err);
        });
    },
    deleteSession(session) {
      this.$swal
        .fire({
          title: `حذف جلسه ${session.title}`,
          text: "جلسه به همراه تمامی آزمون ها حذف می شود",
          type: "warning",
          showCancelButton: true,
          cancelButtonText: "بازگشت",
          cancelButtonColor: "#3085d6",
          confirmButtonColor: "#d33",
          confirmButtonText: "حذف"
        })
        .then(result => {
          if (result.value) {
            this.axios
              .patch(
                `http://localhost:3000/api/session/delete/`,
                {
                  courseId: this.course._id,
                  lessonId: this.lesson._id,
                  sessionId: session._id
                },
                this.headers
              )
              .then(res => {
                let userIndex = this.sessions.indexOf(session);
                this.sessions.splice(userIndex, 1);
                this.$swal.fire({
                  type: "success",
                  title: "موفق",
                  text: "جلسه با موفقیت حذف شد"
                });
              })
              .catch(err => {
                console.log(err);
              });
          }
        });
    },
    async editSession(session, index) {
      const { value: formValues2 } = await this.$swal.fire({
        html: `
          <div class="card">
          <div class="card-header">
            <strong class="lalezar" >جلسه جدید</strong>
          </div>
          </br>
          <div class="form-group">
          <div class="">
            <label class="lalezar" for="title">عنوان جلسه</label>
                  <input
                    value="${session.title}"
                    type="text"
                    id="title"
                    name="title"
                    placeholder="عنوان جلسه را وارد کنید"
                    class="form-control"
                  />
          </div>
          </br>
          <div>
            <label class="lalezar"  for="content">توضیحات راجع به جلسه</label>
            <textarea class="form-control text-center" rows="3" id="content"> ${session.content}</textarea>
          </div> 
          </br>
          <div class="">
            <label class="lalezar"  for="title">مدت زمان آزمون </label>
                  <input
                    value="${session.duration}"
                    type="number"
                    id="duration"
                    name="duration"
                    placeholder="مدت زمان آزمون را مشخص کنید"
                    class="form-control"
                  />
          </div>
          </br>
          <div class="">
            <label class="lalezar"  for="title">حداقل نمره قبولی در آزمون</label>
                  <input
                    value="${session.minScore}"
                    type="number"
                    id="minScore"
                    name="minScore"
                    placeholder="حداقل نمره قبولی را به درصد وارد کنید"
                    class="form-control"
                  />
          </div> 
          </br>
          <div class="">
            <label class="lalezar"  for="title">شانس مجدد</label>
                  <input
                    value="${session.secondChance}"
                    type="number"
                    id="secondChance"
                    name="secondChance"
                    placeholder="چند روز پس از آزمون"
                    class="form-control"
                  />
          </div>
          <div class="">
            <label class="lalezar"  for="title"> دانشجو </label>
                  <input
                    value="${session.userQCount}"
                    type="number"
                    id="userQCount"
                    name="userQCount"
                    placeholder="تعداد سوالاتی که برای دانشجو نمایش داده می شود"
                    class="form-control"
                  />
          </div> 
          <div class="">
            <label class="lalezar"  for="title">صفحه شروع</label>
                  <input
                    value="${session.starting_page}"
                    type="number"
                    id="starting_page"
                    name="starting_page"
                    placeholder="صفحه شروع"
                    class="form-control"
                  />
          </div> 
          <div class="">
            <label class="lalezar"  for="title">صفحه پایان </label>
                  <input
                    value="${session.ending_page}"
                    type="number"
                    id="ending_page"
                    name="ending_page"
                    placeholder="صفحه پایان"
                    class="form-control"
                  />
          </div>       
          </div>`,
        focusConfirm: false,
        preConfirm: () => {
          var title = document.getElementById("title").value;
          var content = document.getElementById("content").value;
          var duration = document.getElementById("duration").value;
          var minScore = document.getElementById("minScore").value;
          var secondChance = document.getElementById("secondChance").value;
          var userQCount = document.getElementById("userQCount").value;
          var starting_page = document.getElementById("starting_page").value;
          var ending_page = document.getElementById("ending_page").value;
          var ok = false;
          if (
            title == "" ||
            content == "" ||
            duration == "" ||
            minScore == "" ||
            secondChance == "" ||
            userQCount == "" ||
            starting_page == "" ||
            ending_page == "" ||
            parseInt(starting_page) > parseInt(ending_page)
          ) {
            setTimeout(() => {
              this.editSession(session);
            }, 0);
          } else {
            ok = true;
          }
          return {
            ok,
            title,
            content,
            secondChance,
            duration,
            minScore,
            userQCount,
            starting_page,
            ending_page
          };
        }
      });
      if (formValues2 == undefined || formValues2.ok == false) {
        return;
      }
      this.axios
        .patch(
          `http://localhost:3000/api/session/edit`,
          {
            courseId: this.courseId,
            lessonId: this.lesson._id,
            sessionId: session._id,
            title: formValues2.title,
            content: formValues2.content,
            duration: formValues2.duration,
            minScore: formValues2.minScore,
            userQCount: formValues2.userQCount,
            secondChance: formValues2.secondChance,
            starting_page: formValues2.starting_page,
            ending_page: formValues2.ending_page
          },
          this.headers
        )
        .then(res => {
          this.$swal.fire({
            type: "success",
            title: "موفق",
            text: "جلسه با موفقیت ویرایش شد"
          });
          var lesson = res.data.lessons.find(obj => {
            return obj._id == this.lessonId;
          });
          // console.log(session);
          // console.log(lesson.sessions[index]);

          Object.keys(formValues2).forEach(item => {
            if (session[item]) {
              session[item] = formValues2[item];
            }
            // session.item="54"
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    download(session) {
      if (session.files.length == 0) {
        return;
      }
      this.src = session.files[0].name;
      this.numPages = [];
      for (
        let index = session.starting_page;
        index <= session.ending_page;
        index++
      ) {
        this.numPages.push(index);
      }
      // console.log(this.numPages);

      this.$refs["my-modal"].show();
    }
  },
  mounted() {
    if (global == undefined) {
      this.$router.push("/teacher/course");
    }
    this.courseId = global.courseId;
    this.lessonId = global.lessonId;
    this.axios
      .post(
        `http://localhost:3000/api/session/showall`,
        {
          courseId: this.courseId,
          lessonId: this.lessonId
        },
        this.headers
      )
      .then(res => {
        this.sessions = res.data;
        console.log(res.data);
        this.course = global.course;
        this.lesson = global.lesson;
      })
      .catch(err => {
        console.log(err);
      });
  },
  created() {
    this.headers = {
      headers: {
        Authorization: `Bearer ${this.$cookie.get("jwt")}`
      }
    };
  },
  components: {
    pdf
  }
};
</script>
<style>
tr:hover {
  background-color: rgb(236, 238, 245);
  cursor: pointer;
}

/* @import 'vue-good-table/dist/vue-good-table.css'; */
</style>
