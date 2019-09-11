<template>
  <div>
    <b-breadcrumb>
      <b-breadcrumb-item>صفحه مدیریت</b-breadcrumb-item>
      <b-breadcrumb-item active>دوره ها</b-breadcrumb-item>
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
            <th class>وضعیت</th>
            <th class>تاریخ</th>
            <th class>تعداد دروس</th>
            <th class>استاد</th>
            <th class>عنوان</th>
            <th class>#</th>
          </tr>
        </thead>
        <tbody id="myTable">
          <tr v-for="(course,index) in courses" :key="course._id" @click="push($event,course)">
            <td>
              <i
                @click="deleteCourse(course)"
                class="fa fa-remove action-icon"
                style="font-size: 1.5em;"
              />
              <i
                @click="editCourse(course,index)"
                class="fa fa-edit action-icon"
                style="font-size: 1.5em;"
              />
              <i
                v-if="course.publishable"
                @click="publish(course)"
                class="fa fa-check action-icon"
                style="font-size: 1.5em;"
              />
              <i
                v-else
                @click="publish(course)"
                class="fa fa-ban action-icon"
                style="font-size: 1.5em;"
              />
            </td>
            <td>
              <button
                v-if="!course.publishable"
                data-v-17b74d76
                type="button"
                class="btn p-1 px-3 btn-xs btn-danger lalezar"
              >عدم انتشار</button>
              <button
                v-if="course.publishable"
                data-v-17b74d76
                type="button"
                class="btn p-1 px-3 btn-xs btn-success lalezar"
              >منتشر شده</button>
            </td>
            <td>{{course.date}}</td>
            <td>5</td>
            <td>{{teacher.name}}</td>
            <td>{{course.title}}</td>
            <td>{{index+1}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div>
      <button id="fixedbutton" class="btn btn-primary" type="button" @click="addCourse()">
        <i class="fa fa-plus" />
      </button>
    </div>
  </div>
</template>
<script>
import { global } from "@/main.js";
import "imports-loader?$=jquery,this=>window!messenger/build/js/messenger";
const { Messenger } = window;
/* eslint-disable */
function initializationMessengerCode() {
  (function() {
    let $,
      FlatMessage,
      spinner_template,
      __hasProp = {}.hasOwnProperty,
      __extends = function(child, parent) {
        for (const key in parent) {
          if (__hasProp.call(parent, key)) child[key] = parent[key];
        }

        function ctor() {
          this.constructor = child;
        }

        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      };

    $ = jQuery;

    spinner_template =
      '<div class="messenger-spinner">\n    <span class="messenger-spinner-side messenger-spinner-side-left">\n        <span class="messenger-spinner-fill"></span>\n    </span>\n    <span class="messenger-spinner-side messenger-spinner-side-right">\n        <span class="messenger-spinner-fill"></span>\n    </span>\n</div>';

    FlatMessage = (function(_super) {
      __extends(FlatMessage, _super);

      function FlatMessage() {
        return FlatMessage.__super__.constructor.apply(this, arguments);
      }

      FlatMessage.prototype.template = function(opts) {
        let $message;
        $message = FlatMessage.__super__.template.apply(this, arguments);
        $message.append($(spinner_template));
        return $message;
      };

      return FlatMessage;
    })(Messenger.Message);

    Messenger.themes.air = {
      Message: FlatMessage
    };
  }.call(window));
}
/* eslint-enable */
export default {
  data() {
    return {
      teacher: null,
      locationClasses: "messenger-fixed messenger-on-bottom messenger-on-right",
      courses: null
    };
  },
  methods: {
    async publish(course) {
      var flag = false;
      if (!course.publishable) {
        flag = true;
      }
      this.axios
        .patch(`http://localhost:3000/api/course/edit`, {
          courseId: course._id,
          publishable: flag
        })
        .then(res => {
          course.publishable = flag;
          this.$swal.fire({
            type: "success",
            title: "موفق",
            text: "دوره با موفقیت ویرایش شد"
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    addSuccessNotification() {
      Messenger().post({
        extraClasses: this.locationClasses,
        message: "Showing success message was successful!",
        type: "success",
        showCloseButton: true
      });
      return false;
    },
    push(e, course) {
      if (e.target.nodeName == "I") {
        return;
      }
      global.courseId = course._id;
      global.teacherId = this.teacher._id;

      this.$router.push({
        name: "tlesson",
        params: {
          title: course.title
        }
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
      console.log(value);
    },
    async addCourse(title = "", content = "") {
      if (!this.teacher.confirmed) {
        alert("اکانت شما غیرفعال است");
        return;
      }
      const { value: formValues2 } = await this.$swal.fire({
        html: `
          <div class="card">
          <div class="card-header">
            <strong>دوره جدید</strong>
          </div>
          </br>
          <div class="form-group">
          <div class="">
            <label for="title">عنوان دوره</label>
                  <input
                    value="${title}"
                    type="text"
                    id="title"
                    name="title"
                    placeholder="عنوان دوره را وارد کنید"
                    class="form-control"
                  />
          </div>
          </br></br>
          <div>
            <label for="content">توضیحات راجع به دوره</label>
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
              this.addCourse(title, content);
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
        .post(`http://localhost:3000/api/course/add`, {
          user: this.teacher._id,
          title: formValues2.title,
          content: formValues2.content
        })
        .then(res => {
          this.$swal.fire({
            type: "success",
            title: "موفق",
            text: "دوره با موفقیت ثبت شد"
          });
          console.log(res.data);
          this.courses.unshift(res.data);
        })
        .catch(err => {
          console.log(err);
        });
    },
    deleteCourse(course) {
      this.$swal
        .fire({
          title: "Are you sure?",
          text: "دوره به همراه تمامی درس ها حذف می شوند",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!"
        })
        .then(result => {
          if (result.value) {
            this.axios
              .post(`http://localhost:3000/api/course/delete/`, {
                courseId: course._id
              })
              .then(res => {
                let userIndex = this.courses.indexOf(course);
                this.courses.splice(userIndex, 1);
                this.$swal.fire({
                  type: "success",
                  title: "موفق",
                  text: "دوره با موفقیت حذف شد"
                });
              })
              .catch(err => {
                console.log(err);
              });
          }
        });
    },
    async editCourse(course, index) {
      const { value: formValues } = await this.$swal.fire({
        html: `<div class="card">
          <div class="card-header">
            <strong>دوره جدید</strong>
          </div>
          </br>
          <div class="form-group">
          <div class="">
            <label for="title">عنوان دوره</label>
                  <input
                    value="${course.title}"
                    type="text"
                    id="title"
                    name="title"
                    placeholder="عنوان دوره را وارد کنید"
                    class="form-control"
                  />
          </div>
          </br></br>
          <div>
            <label for="content">توضیحات راجع به دوره</label>
            <textarea class="form-control text-center" rows="3" id="content"> ${course.content}</textarea>
          </div>      
          </div>`,
        // '<input id="swal-input6" class="swal2-input" placeholder = "جنسیت>',
        focusConfirm: false,
        preConfirm: () => {
          var title = document.getElementById("title").value;
          var content = document.getElementById("content").value;
          var ok = false;
          if (title == "" || content == "") {
            setTimeout(() => {
              this.editCourse(course);
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
      if (formValues == undefined || formValues.ok == false) {
        return;
      }
      // TODO: university ezafe she
      this.axios
        .patch(`http://localhost:3000/api/course/edit`, {
          courseId: course._id,
          content: formValues.content,
          title: formValues.title
        })
        .then(res => {
          Object.keys(res.data).forEach(item => {
            course[item] = res.data[item];
          });
          this.$swal.fire({
            type: "success",
            title: "موفق",
            text: "دوره با موفقیت ویرایش شد"
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  mounted() {
    // this.initCharts();
    //emadi
    //5d77a5193908ca10e8a7877a
    //khodadi
    //5d74028057b2c842046986c7
    this.axios
      .post(`http://localhost:3000/api/user/course/showall`, {
        teacherId: "5d77a5193908ca10e8a7877a"
      })
      .then(res => {
        console.log("res.data");
        console.log(res.data);
        this.courses = res.data;
      })
      .catch(err => {
        console.log(err);
      });
    this.axios
      .post(`http://localhost:3000/api/user/show`, {
        userId: "5d77a5193908ca10e8a7877a"
      })
      .then(res => {
        this.teacher = res.data;
      })
      .catch(err => {
        console.log(err);
      });
  },
  created() {
    // this.initializationMessengerCode();
  }
};
</script>

<style src="./Notifications.scss" lang="scss" scoped>
tr:hover {
  background-color: rgb(236, 238, 245);
  cursor: pointer;
}
input {
  text-align: center;
}
#fixedbutton {
  position: fixed;
  bottom: 10px;
  right: 10px;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  /* display: none; <- Crashes Chrome on hover */
  -webkit-appearance: none;
  margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
}

input[type="number"] {
  -moz-appearance: textfield; /* Firefox */
}
.action-icon {
  margin-right: 5px;
}
</style>
