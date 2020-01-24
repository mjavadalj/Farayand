<template>
  <div>
    <b-breadcrumb>
      <b-breadcrumb-item>راهنما</b-breadcrumb-item>
      <b-breadcrumb-item active>دوره ها</b-breadcrumb-item>
    </b-breadcrumb>

    <div style="margin-bottom:5px;" class="text-center">
      <button
        id="teacher"
        style="margin:2px;font-family:lalezar"
        class="btn btn-outline-secondary"
        type="button"
        @click="limitation('teachers')"
      >دوره های اساتید</button>
      <button
        id="student"
        style="margin:2px;font-family:lalezar"
        class="btn btn-outline-secondary"
        type="button"
        @click="limitation('students')"
      >دوره های دانشجویان</button>
      <button
        id="all"
        style="margin:2px;font-family:lalezar"
        class="btn btn-outline-secondary"
        type="button"
        @click="limitation('all')"
      >دوره های بدون محدودیت</button>
      <button
        id="none"
        style="margin:2px;font-family:lalezar"
        class="btn btn-outline-secondary active"
        type="button"
        @click="limitation()"
      >همه</button>
    </div>
    <div class="input-group mb-3">
      <div style="cursor: pointer;" class="input-group-prepend" @click="searchCourses">
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
        v-model="searchInput"
        v-on:keyup="search"
      />
    </div>
    <div class="table-resposive" style="text-align:center;">
      <table id="dtBasicExample" align="center" class="table">
        <thead>
          <tr>
            <th class>عملیات</th>
            <th class>وضعیت انتشار</th>
            <th class>محدودیت</th>
            <th class>تاریخ</th>
            <th class>تعداد درس</th>
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
            <td>{{convert(course.limitation)}}</td>
            <td id="numeric-td">{{new Date(course.date) | moment("jYYYY/jM/jD | HH:mm ")}}</td>
            <td id="numeric-td">{{course.lessons.length}}</td>
            <td>{{course.creator.name}}</td>
            <td>{{course.title}}</td>
            <td id="numeric-td">{{index+(page*maxInPage)+1}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div>
      <button id="fixedbutton" class="btn btn-primary" type="button" @click="addCourse()">
        <i class="fa fa-plus" />
      </button>
    </div>
    <div v-if="!searchMode">
      <nav aria-label="Page navigation example ">
        <ul class="pagination">
          <li class="page-item pagination-sm" @click="prev()">
            <a class="page-link">صفحه قبل</a>
          </li>
          <li
            class="page-item pagination-sm"
            v-for="index in Math.ceil(this.courseCount / this.maxInPage)"
            :key="index"
            @click="jumpTo(index-1)"
          >
            <a class="page-link">{{index}}</a>
          </li>
          <li class="page-item pagination-sm" @click="next()">
            <a class="page-link">صفحه بعد</a>
          </li>
        </ul>
      </nav>
    </div>
    <div v-else>
      <button class="btn btn-danger" type="button" @click="back()">
        <i class="fa fa-minus" />
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
} /* eslint-disable */
/* eslint-enable */ export default {
  data() {
    return {
      jwt: null,
      headers: null,
      locationClasses: "messenger-fixed messenger-on-bottom messenger-on-right",
      courses: null,
      courseCount: 0,
      page: 0,
      maxInPage: 10,
      searchInput: "",
      searchedCourses: null,
      searchMode: false,
      temp: null,
      limit: "",
      adminUser: null
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
    push(e, course) {
      if (e.target.nodeName == "I") {
        return;
      }
      global.courseId = course._id;
      global.course = course;
      this.$router.push({
        name: "lesson",
        params: {
          title: course.title
        }
      });
    },
    search(e) {
      // var value = $("#myInput")
      //   .val()
      //   .toLowerCase();
      // $("#myTable tr").filter(function() {
      //   $(this).toggle(
      //     $(this)
      //       .text()
      //       .toLowerCase()
      //       .indexOf(value) > -1
      //   );
      // });
    },
    async addCourse(title = "", content = "") {
      const { value: formValues2 } = await this.$swal.fire({
        html: `
        <div class="col-X-6">
          <div class="card">
          <div class="card-header">
            <strong class="lalezar">دوره جدید</strong>
          </div>
          </br>
          <div class="form-group">
          <div class="">
            <label class="iranyekan-bold" for="title">عنوان دوره</label>
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
            <label class="iranyekan-bold" for="content">توضیحات راجع به دوره</label>
            <textarea  class="form-control text-center" rows="3" id="content"> ${content}</textarea>
               <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1">
                    <label class="form-check-label lalezar" for="inlineRadio1">فقط برای دانشجویان</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2">
                    <label class="form-check-label lalezar" for="inlineRadio2">فقط برای اساتید</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="option3">
                    <label class="form-check-label lalezar" for="inlineRadio3">بدون محدودیت</label>
                  </div>
          </div>   
          </div>   
          </div>`,
        focusConfirm: false,
        confirmButtonText: "ثبت",
        confirmButtonColor: "#3abf94",
        preConfirm: () => {
          var title = document.getElementById("title").value;
          var content = document.getElementById("content").value;
          var limitation = "";
          if ($("#inlineRadio1").is(":checked")) {
            limitation = "students";
          } else if ($("#inlineRadio2").is(":checked")) {
            limitation = "teachers";
          } else if ($("#inlineRadio3").is(":checked")) {
            limitation = "all";
          }
          var ok = false;
          if (title == "" || content == "" || limitation == "") {
            setTimeout(() => {
              this.addCourse(title, content);
            }, 0);
          } else {
            ok = true;
          }
          return {
            ok,
            title,
            content,
            limitation
          };
        }
      });
      if (formValues2 == undefined || formValues2.ok == false) {
        return;
      }
      this.axios
        .post(
          `http://localhost:3000/api/course/add`,
          {
            // creator: this.adminUser.userId,
            title: formValues2.title,
            content: formValues2.content,
            limitation: formValues2.limitation
          },
          this.headers
        )
        .then(res => {
          this.$swal.fire({
            type: "success",
            title: "موفق",
            text: "دوره با موفقیت ثبت شد"
          });
          this.courses.unshift(res.data);
        })
        .catch(err => {
          console.log(err);
        });
    },
    deleteCourse(course) {
      this.$swal
        .fire({
          title: `حذف دوره ${course.title}`,
          text: "دوره به همراه تمامی درس ها حذف می شود",
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
              .post(
                `http://localhost:3000/api/course/delete/`,
                {
                  courseId: course._id
                },
                this.headers
              )
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
            <strong class="lalezar">ویرایش دوره</strong>
          </div>
          </br>
          <div class="form-group">
          <div class="">
            <label class="iranyekan-bold" for="title">عنوان دوره</label>
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
            <label class="iranyekan-bold" for="content">توضیحات راجع به دوره</label>
            <textarea class="form-control text-center" rows="3" id="content"> ${course.content}</textarea>
            <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1">
                    <label class="form-check-label lalezar" for="inlineRadio1">فقط برای دانشجویان</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2">
                    <label class="form-check-label lalezar" for="inlineRadio2">فقط برای اساتید</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="option3">
                    <label class="form-check-label lalezar" for="inlineRadio3">بدون محدودیت</label>
                  </div>
          </div>      
          </div>`,
        // '<input id="swal-input6" class="swal2-input" placeholder = "جنسیت>',
        focusConfirm: false,
        confirmButtonText: "ویرایش",
        confirmButtonColor: "#3abf94",
        preConfirm: () => {
          var title = document.getElementById("title").value;
          var content = document.getElementById("content").value;
          var limitation = "";
          if ($("#inlineRadio1").is(":checked")) {
            limitation = "students";
          } else if ($("#inlineRadio2").is(":checked")) {
            limitation = "teachers";
          } else if ($("#inlineRadio3").is(":checked")) {
            limitation = "all";
          }
          var ok = false;
          if (title == "" || content == "" || limitation == "") {
            setTimeout(() => {
              this.editCourse(course);
            }, 0);
          } else {
            ok = true;
          }
          return {
            ok,
            title,
            content,
            limitation
          };
        }
      });
      if (formValues == undefined || formValues.ok == false) {
        return;
      }
      // TODO: university ezafe she
      this.axios
        .patch(
          `http://localhost:3000/api/course/edit`,
          {
            courseId: course._id,
            content: formValues.content,
            title: formValues.title,
            limitation: formValues.limitation
          },
          this.headers
        )
        .then(res => {
          Object.keys(formValues).forEach(item => {
            if (course[item] != undefined) {
              course[item] = formValues[item];
            }
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
    },
    async publish(course) {
      var flag = false;
      if (!course.publishable) {
        flag = true;
      }
      this.axios
        .patch(
          `http://localhost:3000/api/course/edit`,
          {
            courseId: course._id,
            publishable: flag
          },
          this.headers
        )
        .then(res => {
          course.publishable = flag;
          this.$swal.fire({
            type: "success",
            title: "موفق",
            text: "دوره با موفقیت ویرایش شد",
            confirmButtonText: "قبول"
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    calculateCourseCount() {
      return Math.ceil(this.courseCount / this.maxInPage);
    },
    prev() {
      if (this.page <= 0) {
        return;
      }
      this.page--;
      var query = `skip=${this.page * this.maxInPage}&limit=${this.maxInPage}`;
      if (this.limit != "") {
        query += `&select=${this.limit}`;
      }
      this.axios
        .post(
          `http://localhost:3000/api/course/showall?${query}`,
          {},
          this.headers
        )
        .then(res => {
          this.courses = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    next() {
      if (this.page >= this.calculateCourseCount() - 1) {
        return;
      }
      this.page++;
      var query = `skip=${this.page * this.maxInPage}&limit=${this.maxInPage}`;
      if (this.limit != "") {
        query += `&select=${this.limit}`;
      }
      this.axios
        .post(`http://localhost:3000/api/course/showall?${query}`)
        .then(res => {
          this.courses = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    jumpTo(page) {
      this.page = page;
      var query = `skip=${this.page * this.maxInPage}&limit=${this.maxInPage}`;
      if (this.limit != "") {
        query += `&select=${this.limit}`;
      }
      this.axios
        .post(
          `http://localhost:3000/api/course/showall?${query}`,
          {},
          this.headers
        )
        .then(res => {
          this.courses = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    searchCourses() {
      if (this.searchInput == "") {
        return alert("چیزی برای جستجو وجود ندارد");
      }
      var query = "";
      if (this.limit != "") {
        query = `&select=${this.limit}`;
      }
      this.axios
        .get(
          `http://localhost:3000/api/course/find?title=${this.searchInput}${query}`,
          this.headers
        )
        .then(res => {
          this.searchMode = true;
          if (this.temp == null) {
            this.temp = this.courses;
          }
          this.searchedCourses = res.data;
          this.courses = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    back() {
      this.courses = this.temp;
      this.searchMode = false;
      this.searchInput = "";
      this.limitation(this.limit, true);
    },
    convert(x) {
      if (x == "students") {
        return "فقط برای دانشجویان";
      }
      if (x == "teachers") {
        return "فقط برای اساتید";
      }
      return "بدون محدودیت";
    },
    limitation(limit = "", f = false) {
      if (this.limit == limit && !f) {
        return;
      }
      this.limit = limit;
      if (this.searchMode) {
        return this.searchCourses();
      }
      // this.searchMode=false
      // this.searchInput=''

      this.page = 0;
      var query = "";
      if (this.limit != "") {
        query = `select=${limit}`;
      }

      this.axios
        .get(`http://localhost:3000/api/course/count?${query}`, this.headers)
        .then(res => {
          this.courseCount = res.data;
        })
        .catch(err => {
          console.log(err);
        });
      this.axios
        .post(
          `http://localhost:3000/api/course/showall?skip=${this.page *
            this.maxInPage}&limit=${this.maxInPage}&${query}`,
          {},
          this.headers
        )
        .then(res => {
          this.courses = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    clicked() {}
  },
  mounted() {},
  created() {
    this.adminUser = JSON.parse(this.$cookie.get("authorization"));
    this.headers = {
      headers: {
        Authorization: `Bearer ${this.$cookie.get("jwt")}`
      }
    };
    this.axios
      .get(`http://localhost:3000/api/course/count`, this.headers)
      .then(res => {
        this.courseCount = res.data;
      })
      .catch(err => {
        console.log(err);
      });
    this.axios
      .post(
        `http://localhost:3000/api/course/showall?skip=${this.page *
          this.maxInPage}&limit=${this.maxInPage}`,
        {},
        this.headers
      )
      .then(res => {
        this.courses = res.data;
        $("button")
          .not("#fixedbutton")
          .click(function() {
            $("button")
              .not("#fixedbutton")
              .removeClass("active");
            $(this).addClass("active");
          });
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>

<style src="./Notifications.scss" lang="scss" scoped>
tr:hover {
  background-color: rgb(236, 238, 245);
  cursor: pointer;
}
#paging {
  // position: fixed;
  // bottom: 0px;
  // right: 0px;
  // margin:5px;
}
</style>
