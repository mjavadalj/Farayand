<template>
  <div>
    <b-breadcrumb>
      <b-breadcrumb-item>راهنما</b-breadcrumb-item>
      <b-breadcrumb-item active>انتخاب درس</b-breadcrumb-item>
    </b-breadcrumb>
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
            <th class>تاریخ</th>
            <th class>تعداد درس</th>
            <th class>استاد</th>
            <th class>عنوان</th>
            <th class>#</th>
          </tr>
        </thead>
        <tbody id="myTable">
          <tr v-for="(course,index) in courses" :key="course._id" @click="showModal($event,course)">
            <td id="numeric-td">{{ new Date(course.date) | moment("jYYYY/jM/jD | HH:mm ")}}</td>
            <td id="numeric-td">{{course.lessons.length}}</td>
            <td>{{course.creator.name}}</td>
            <td>{{course.title}}</td>
            <td id="numeric-td">{{index+(page*maxInPage)+1}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="!searchMode">
      <nav aria-label="Page navigation example ">
        <ul class="pagination">
          <li class="page-item pagination-sm" @click="prev()">
            <a class="page-link">صفحه قبل</a>
          </li>
          <li
            class="page-item pagination-sm"
            v-for="index in calculateCourseCount()"
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
    <div id="modaaal">
      <b-modal id="my-modal" ref="my-modal" hide-footer title>
        <div class="d-block text-center lalezar">
          <h3>درس را انتخاب کنید</h3>
        </div>
        <div
          id="table_data"
          class="table-resposive"
          style="text-align:center;max-height:500px; overflow: auto;margin-bottom:10px;"
        >
          <table id="dtBasicExample" align="center" class="table">
            <thead>
              <tr>
                <th class>تاریخ</th>
                <th class>تعداد جلسه</th>
                <th class>عنوان</th>
                <th class>#</th>
              </tr>
            </thead>
            <tbody id="myTable2">
              <tr
                v-for="(lesson,index) in lessons"
                :key="lesson._id"
                @click="lessonRegister(lesson)"
              >
                <td id="numeric-td">{{ new Date(lesson.date) | moment("jYYYY/jM/jD | HH:mm ")}}</td>
                <td>{{lesson.sessionLength}}</td>
                <td>{{lesson.title}}</td>
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
      locationClasses: "messenger-fixed messenger-on-bottom messenger-on-right",
      courses: null,
      courseCount: 0,
      page: 0,
      maxInPage: 10,
      isReg: {},
      searchInput: "",
      searchMode: false,
      temp: null,
      lessons: null,
      courseSelected: null,
      user: {}
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
      //   if (e.target.nodeName == "I") {
      //     return;
      //   }
      //   global.courseId = course._id;
      //   global.course = course;
      //   this.$router.push({
      //     name: "lesson",
      //     params: {
      //       title: course.title
      //     }
      //   });
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
    calculateCourseCount() {
      return Math.ceil(this.courseCount / this.maxInPage);
    },
    prev() {
      if (this.page <= 0) {
        return;
      }
      this.page--;
      this.axios
        .post(
          `http://localhost:3000/api/course/showall?skip=${this.page *
            this.maxInPage}&limit=${this.maxInPage}&r=!a&exception=students`
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
      this.axios
        .post(
          `http://localhost:3000/api/course/showall?skip=${this.page *
            this.maxInPage}&limit=${this.maxInPage}&r=!a&exception=students`
        )
        .then(res => {
          this.courses = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    jumpTo(page) {
      this.page = page;
      this.axios
        .post(
          `http://localhost:3000/api/course/showall?skip=${this.page *
            this.maxInPage}&limit=${this.maxInPage}&r=!a&exception=students`
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
      this.axios
        .get(
          `http://localhost:3000/api/course/find?title=${this.searchInput}&r=!a`
        )
        .then(res => {
          this.searchMode = true;
          if (this.temp == null) {
            this.temp = this.courses;
          }
          this.courses = res.data;
          // this.$refs["my-modal"].show();
          // this.searchInput = "";
        })
        .catch(err => {
          console.log(err);
        });
    },
    back() {
      this.courses = this.temp;
      this.searchMode = false;
      this.searchInput = "";
    },
    showModal(e, course) {
      this.axios
        .post(`http://localhost:3000/api/lesson/showall`, {
          courseId: course._id
        })
        .then(res => {
          this.courseSelected = course;
          this.lessons = res.data;
          this.$refs["my-modal"].show();
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
    lessonRegister(lesson) {
      this.$swal
        .fire({
          title: "Are you sure?",
          text: "می خواهید در این درس ثبت نام کنید؟",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!"
        })
        .then(result => {
          if (result.value) {
            var body = {
              userId: this.user.id,
              courseTitle: this.courseSelected.title,
              lessonTitle: lesson.title,
              teacherName: this.courseSelected.creator.name,
              sessionLength: lesson.sessionLength,
              lessonId: lesson._id,
              courseId: this.courseSelected._id,
              teacherId: this.courseSelected.creator._id
            };
            this.axios
              .patch(`http://localhost:3000/api/user/lesson/register`, body)
              .then(res => {
                console.log(res.data);
                if (res.data == null) {
                  this.$swal.fire({
                    type: "warning",
                    title: "!",
                    text: " شما قبلا  در این درس ثبت نام کردید"
                  });
                  this.hideModal();
                  return;
                }
                this.$swal.fire({
                  type: "success",
                  title: "موفق",
                  text: " شما با موفقیت در این درس ثبت نام کردید"
                });
                this.hideModal();
              })
              .catch(err => {
                console.log(err);
              });
          }
        });
    }
  },
  mounted() {
    this.user.id = this.$cookie.get('id');
    //TODO: if not cookie redirect login// this.initCharts();
    this.axios
      .get(`http://localhost:3000/api/course/count?r=!a`)
      .then(res => {
        this.courseCount = res.data;
      })
      .catch(err => {
        console.log(err);
      });
    this.axios
      .post(
        `http://localhost:3000/api/course/showall?skip=${this.page *
          this.maxInPage}&limit=${this.maxInPage}&r=!a&exception=students`
      )
      .then(res => {
        // console.log("res.data");
        // console.log(res.data);
        this.courses = res.data;
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
#paging {
  // position: fixed;
  // bottom: 0px;
  // right: 0px;
  // margin:5px;
}
</style>
