<template>
  <div>
    <b-breadcrumb>
      <b-breadcrumb-item>راهنما</b-breadcrumb-item>
      <b-breadcrumb-item active>دوره {{course.title}}</b-breadcrumb-item>
      <b-breadcrumb-item active>درس ها</b-breadcrumb-item>
    </b-breadcrumb>
    <h1 class="display-3 text-right">{{course.title}}</h1>
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
            <th class>تعداد جلسه</th>
            <th class>عنوان</th>
            <th class>#</th>
          </tr>
        </thead>
        <tbody id="myTable">
          <tr v-for="(lesson,index) in lessons" :key="lesson._id" @click="push($event,lesson)">
            <td>
              <i
                @click="deleteLesson(lesson)"
                class="fa fa-remove action-icon"
                style="font-size: 1.5em;"
              />
              <i
                @click="editLesson(lesson,index)"
                class="fa fa-edit action-icon"
                style="font-size: 1.5em;"
              />
            </td>
            <td id="numeric-td">{{ new Date(lesson.date) | moment("jYYYY/jM/jD | HH:mm ")}}</td>
            <td id="numeric-td">{{lesson.sessionLength}}</td>
            <td>{{lesson.title}}</td>
            <td id="numeric-td">{{index+1}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div>
      <button id="fixedbutton" class="btn btn-primary" type="button" @click="addLesson()">
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
      lessons: null,
      courseId: null
    };
  },

  methods: {
    push(e, data) {
      if (e.target.nodeName == "I") {
        return;
      }
      global.courseId = this.courseId;
      global.lessonId = data._id;
      global.lesson=data
      global.course=this.course
      if (global.teacherId!=null) {
        this.$router.push({
          name: "tsession",
          params: {
            title: data.title
          }
        });
      } else {
        this.$router.push({
          name: "session",
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
    deleteLesson(lesson) {
      this.$swal
        .fire({
          title: "Are you sure?",
          text: "درس به همراه تمامی جلسه ها حذف می شود",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!"
        })
        .then(result => {
          if (result.value) {
            this.axios
              .patch(`http://localhost:3000/api/lesson/delete/`, {
                courseId: this.course._id,
                lessonId: lesson._id
              })
              .then(res => {
                let userIndex = this.lessons.indexOf(lesson);
                this.lessons.splice(userIndex, 1);
                this.$swal.fire({
                  type: "success",
                  title: "موفق",
                  text: "درس با موفقیت حذف شد"
                });
              })
              .catch(err => {
                console.log(err);
              });
          }
        });
    },
    async addLesson(title = "", content = "") {
      const { value: formValues2 } = await this.$swal.fire({
        html: `
          <div class="card">
          <div class="card-header">
            <strong>درس جدید</strong>
          </div>
          </br>
          <div class="form-group">
          <div class="">
            <label for="title">عنوان درس</label>
                  <input
                    value="${title}"
                    type="text"
                    id="title"
                    name="title"
                    placeholder="عنوان درس را وارد کنید"
                    class="form-control"
                  />
          </div>
          </br></br>
          <div>
            <label for="content">توضیحات راجع به درس</label>
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
              this.addLesson(title, content);
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
        .patch(`http://localhost:3000/api/lesson/add`, {
          courseId: this.courseId,
          lesson: {
            title: formValues2.title,
            content: formValues2.content
          }
        })
        .then(res => {
          this.$swal.fire({
            type: "success",
            title: "موفق",
            text: "درس با موفقیت ثبت شد"
          });
          console.log(res.data);
          this.lessons = res.data.lessons;
        })
        .catch(err => {
          console.log(err);
        });
    },
    async editLesson(lesson, index) {
      const { value: formValues2 } = await this.$swal.fire({
        html: `
          <div class="card">
          <div class="card-header">
            <strong>درس جدید</strong>
          </div>
          </br>
          <div class="form-group">
          <div class="">
            <label for="title">عنوان درس</label>
                  <input
                    value="${lesson.title}"
                    type="text"
                    id="title"
                    name="title"
                    placeholder="عنوان درس را وارد کنید"
                    class="form-control"
                  />
          </div>
          </br></br>
          <div>
            <label for="content">توضیحات راجع به درس</label>
            <textarea class="form-control text-center" rows="3" id="content"> ${lesson.content}</textarea>
          </div>      
          </div>`,
        focusConfirm: false,
        preConfirm: () => {
          var title = document.getElementById("title").value;
          var content = document.getElementById("content").value;
          var ok = false;
          if (title == "" || content == "") {
            setTimeout(() => {
              this.editLesson(lesson);
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
      this.axios
        .patch(`http://localhost:3000/api/lesson/edit`, {
          courseId: this.courseId,
          lessonId: lesson._id,
          title: formValues2.title,
          content: formValues2.content
        })
        .then(res => {
          this.$swal.fire({
            type: "success",
            title: "موفق",
            text: "درس با موفقیت ویرایش شد"
          });

          Object.keys(res.data.lessons[index]).forEach(item => {
            lesson[item] = res.data.lessons[index][item];
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  mounted() {
    // this.initCharts();
    if (global == undefined) {
      this.$router.push("/teacher");
    }
    this.courseId = global.courseId;
    this.axios
      .post(`http://localhost:3000/api/lesson/showall`, {
        courseId: this.courseId
      })
      .then(res => {
        console.log(res.data);
        
        this.lessons = res.data;
        this.course = global.course;
      })
      .catch(err => {
        console.log(err);
      });
  },
  created() {}
};
//TODO: router push role
</script>
<style>
tr:hover {
  background-color: rgb(236, 238, 245);
  cursor: pointer;
}

/* @import 'vue-good-table/dist/vue-good-table.css'; */
</style>