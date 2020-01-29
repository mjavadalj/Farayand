<template>
  <div>
    <b-breadcrumb>
      <b-breadcrumb-item>راهنما</b-breadcrumb-item>
      <b-breadcrumb-item active>دوره {{course.title}}</b-breadcrumb-item>
      <b-breadcrumb-item active>درس ها</b-breadcrumb-item>
    </b-breadcrumb>
    <!-- <h2 class="display-3 text-right">{{course.title}}</h2> -->
    <!-- <h4 style="font-family:samim" class="text-center just-text">{{course.title}}</h4> -->
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
            <th class>عنوان درس</th>
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
              <i
                @click="showModal(lesson)"
                class="fa fa-file action-icon"
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
    <div id="modaaal">
      <b-modal id="my-modal" ref="my-modal" scrollable hide-footer title>
        <div class="d-block text-center lalezar">
          <h3>فایل ها</h3>
        </div>
        <button @click="upload" type="button" class="btn btn-light">
          <i class="fa fa-upload">
            <span style="font-family:iranyekan-fn-lgt">بارگذاری فایل</span>
          </i>
        </button>
        <b-form-file
          v-model="uploadedFile"
          placeholder="Choose a file or drop it here..."
          drop-placeholder="Drop file here..."
        ></b-form-file>
        <!-- <div class="mt-3">Selected file: {{ file ? file.name : '' }}</div> -->
        <div
          id="table_data"
          class="table-resposive"
          style="text-align:center;max-height:500px; overflow: auto;margin-bottom:10px;"
        >
          <table id="dtBasicExample" align="center" class="table">
            <thead>
              <tr>
                <th class>عملیات</th>
                <th class>فرمت</th>
                <th class>نام</th>
                <th class>#</th>
              </tr>
            </thead>
            <tbody id="myTable2">
              <tr v-for="(file,index) in files" :key="file._id">
                <td>
                  <i
                    @click="removeFile(file,index)"
                    class="fa fa-remove action-icon"
                    style="font-size: 1.5em;"
                  />
                </td>
                <td>{{file.type}}</td>
                <td>
                  <a :href="file.name" target="_blank">{{file.name.split('.')[1]}}</a>
                </td>
                <td>{{index+1}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </b-modal>
    </div>
  </div>
</template>
<script>
import { global } from "@/main.js";
export default {
  data() {
    return {
      jwt:null,headers:null,
      course: null,
      lessons: null,
      courseId: null,
      selectedLesson: null,
      uploadedFile: null,
      files:null
    };
  },

  methods: {
    push(e, data) {
      if (e.target.nodeName == "I") {
        return;
      }
      global.courseId = this.courseId;
      global.lessonId = data._id;
      global.lesson = data;
      global.course = this.course;
      if (global.teacherId != null) {
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
          title: `حذف درس ${lesson.title}`,
          text: "درس به همراه تمامی جلسه ها حذف می شود",
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
              .patch(`http://localhost:3000/api/lesson/delete/`, {
                courseId: this.course._id,
                lessonId: lesson._id
              },this.headers)
              .then(res => {
                let userIndex = this.lessons.indexOf(lesson);
                this.lessons.splice(userIndex, 1);
                this.$swal.fire({
                  type: "success",
                  title: "موفق",
                  text: "درس با موفقیت حذف شد",
                  confirmButtonText: "قبول"
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
            <strong class="lalezar">درس جدید</strong>
          </div>
          </br>
          <div class="form-group">
          <div class="">
            <label class="iranyekan-bold" for="title">عنوان درس</label>
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
            <label class="iranyekan-bold" for="content">توضیحات راجع به درس</label>
            <textarea class="form-control text-center" rows="3" id="content"> ${content}</textarea>
          </div>      
          </div>`,
        focusConfirm: false,
        confirmButtonText: "ثبت",
        confirmButtonColor: "#3abf94",
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
        },this.headers)
        .then(res => {
          this.$swal.fire({
            type: "success",
            title: "موفق",
            text: "درس با موفقیت ثبت شد",
            confirmButtonText: "قبول"
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
            <strong class="lalezar">ویرایش درس</strong>
          </div>
          </br>
          <div class="form-group">
          <div class="">
            <label class="iranyekan-bold" for="title">عنوان درس</label>
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
            <label class="iranyekan-bold" for="content">توضیحات راجع به درس</label>
            <textarea class="form-control text-center" rows="3" id="content"> ${lesson.content}</textarea>
          </div>      
          </div>`,
        focusConfirm: false,
        confirmButtonText: "ویرایش",
        confirmButtonColor: "#3abf94",
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
        },this.headers)
        .then(res => {
          this.$swal.fire({
            type: "success",
            title: "موفق",
            text: "درس با موفقیت ویرایش شد",
            confirmButtonText: "قبول"
            // confirmButtonColor: "#3abf94",
          });

          Object.keys(res.data.lessons[index]).forEach(item => {
            lesson[item] = res.data.lessons[index][item];
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    showModal(lesson) {
      this.axios
        .post(`http://localhost:3000/api/lesson/showfiles`, {
          lessonId: lesson._id,
          courseId: this.courseId
        },this.headers)
        .then(res => {
          console.log(res.data);
          this.$refs["my-modal"].show();
          this.selectedLesson = lesson;
          this.files = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    hideModal() {
      this.$refs["my-modal"].hide();
    },
    toggleModal() {
      // We pass the ID of the button that we want to return focus to
      // when the modal has hidden
      this.$refs["my-modal"].toggle("#toggle-btn");
    },
    files(lesson, index) {
      console.log("aaaaaaaaaaaaa");

      // this.showModal(session);
    },
    removeFile(file, index) {
      this.axios
        .patch(`http://localhost:3000/api/lesson/deletefile/`, {
          courseId: this.course._id,
          lessonId: this.selectedLesson._id,
          fileId: file._id
        },this.headers)
        .then(res => {
          this.files.splice(index, 1);
        })
        .catch(err => {
          console.log(err);
        });
    },
    upload() {
      if (this.uploadedFile == null) {
        return;
      }
      var formatData = new FormData();
      formatData.append("lessonId", this.selectedLesson._id);
      formatData.append("courseId", this.courseId);
      formatData.append("file", this.uploadedFile);
      this.axios
        .post("http://localhost:3000/api/lesson/addfile", formatData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${this.$cookie.get("jwt")}`
            
          }
        })
        .then(result => {
          console.log(result);
          this.uploadedFile = null;
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
      },this.headers)
      .then(res => {
        console.log(res.data);

        this.lessons = res.data;
        this.course = global.course;
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