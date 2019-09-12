<template>
  <div>
    <b-breadcrumb>
      <b-breadcrumb-item>راهنما</b-breadcrumb-item>
      <b-breadcrumb-item active>دوره {{course.title}}</b-breadcrumb-item>
      <b-breadcrumb-item active>درس {{lesson.title}}</b-breadcrumb-item>
      <b-breadcrumb-item active>جلسه ها</b-breadcrumb-item>
    </b-breadcrumb>
    <h1 class="display-3 text-right">{{lesson.title}}</h1>
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
        placeholder="Serach"
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
            <th class>عنوان</th>
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
            </td>
            <td>{{session.quizDate}}</td>
            <td>{{session.secondChance}}</td>
            <td>{{session.duration}}</td>
            <td>{{session.minScore}}</td>
            <td>{{session.questionLength}}</td>
            <td>{{session.title}}</td>
            <td>{{index+1}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div>
      <button id="fixedbutton" class="btn btn-primary" type="button" @click="addSession()">
        <i class="fa fa-plus" />
      </button>
    </div>
  </div>
</template>
<script>
import { global } from "@/main.js";
export default {
  data() {
    return {
      course: null,
      lesson: null,
      sessions: null,
      courseId: null
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
    async addSession(title = "", content = "") {
      const { value: formValues2 } = await this.$swal.fire({
        html: `
          <div class="card">
          <div class="card-header">
            <strong>جلسه جدید</strong>
          </div>
          </br>
          <div class="form-group">
          <div class="">
            <label for="title">عنوان جلسه</label>
                  <input
                    value="${title}"
                    type="text"
                    id="title"
                    name="title"
                    placeholder="عنوان جلسه را وارد کنید"
                    class="form-control"
                  />
          </div>
          </br></br>
          <div>
            <label for="content">توضیحات راجع به جلسه</label>
            <textarea class="form-control text-center" rows="3" id="content"> ${content}</textarea>
          </div>      
          </div>`,
        focusConfirm: false,
        preConfirm: () => {
          var title = document.getElementById("title").value;
          var content = document.getElementById("content").value;
          var ok = false;
          if (title == "" || content == "") {
            setTimeout(() => {
              this.addSession(title, content);
            }, 0);
          } else {
            ok = true;
          }
          return {
            ok,
            title,
            content
          };
        }
      });
      if (formValues2 == undefined || formValues2.ok == false) {
        return;
      }
      console.log(this.courseId);
      this.axios
        .patch(`http://localhost:3000/api/session/add`, {
          courseId: this.courseId,
          lessonId: this.lessonId,
          session: {
            title: formValues2.title,
            content: formValues2.content,
            secondChance: "20",
            duration: 20,
            minScore: 20
          }
        })
        .then(res => {
          this.$swal.fire({
            type: "success",
            title: "موفق",
            text: "جلسه با موفقیت ثبت شد"
          });
          console.log("res.data");
          console.log(res.data);
          this.sessions = res.data.lessons[0].sessions;
        })
        .catch(err => {
          console.log(err);
        });
    },
    deleteSession(session) {
      this.$swal
        .fire({
          title: "Are you sure?",
          text: "جلسه به همراه تمامی آزمون ها حذف می شود",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!"
        })
        .then(result => {
          if (result.value) {
            this.axios
              .patch(`http://localhost:3000/api/session/delete/`, {
                courseId: this.course._id,
                lessonId: this.lesson._id,
                sessionId: session._id
              })
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
            <strong>جلسه جدید</strong>
          </div>
          </br>
          <div class="form-group">
          <div class="">
            <label for="title">عنوان جلسه</label>
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
            <label for="content">توضیحات راجع به جلسه</label>
            <textarea class="form-control text-center" rows="3" id="content"> ${session.content}</textarea>
          </div> 
          </br>
          <div class="">
            <label for="title">مدت زمان آزمون </label>
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
            <label for="title">حداقل نمره قبولی در آزمون</label>
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
            <label for="title">شانس مجدد</label>
                  <input
                    value="${session.secondChance}"
                    type="number"
                    id="secondChance"
                    name="secondChance"
                    placeholder="چند روز پس از آزمون"
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
          var ok = false;
          if (
            title == "" ||
            content == "" ||
            duration == "" ||
            minScore == "" ||
            secondChance == ""
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
            minScore
          };
        }
      });
      if (formValues2 == undefined || formValues2.ok == false) {
        return;
      }
      this.axios
        .patch(`http://localhost:3000/api/session/edit`, {
          courseId: this.courseId,
          lessonId: this.lesson._id,
          sessionId: session._id,
          title: formValues2.title,
          content: formValues2.content,
          duration: formValues2.duration,
          minScore: formValues2.minScore,
          secondChance: formValues2.secondChance
        })
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

          Object.keys(lesson.sessions[index]).forEach(item => {
            session[item] = lesson.sessions[index][item];
            // session.item="54"
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  mounted() {
    if (global == undefined) {
      this.$router.push("/teacher/course");
    }
    console.log(global.lessonId);
    this.courseId = global.courseId;
    this.lessonId = global.lessonId;
    this.axios
      .post(`http://localhost:3000/api/session/showall`, {
        courseId: this.courseId,
        lessonId: this.lessonId
      })
      .then(res => {
        this.sessions = res.data;
        this.course = global.course;
        this.lesson = global.lesson;
      })
      .catch(err => {
        console.log(err);
      });
  },
  created() {}
};
</script>
<style>
tr:hover {
  background-color: rgb(236, 238, 245);
  cursor: pointer;
}

/* @import 'vue-good-table/dist/vue-good-table.css'; */
</style>
