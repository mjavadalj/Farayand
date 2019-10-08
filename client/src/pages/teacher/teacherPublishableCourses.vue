<template>
  <div>
    <b-breadcrumb>
      <b-breadcrumb-item>راهنما</b-breadcrumb-item>
      <b-breadcrumb-item active>دوره ها</b-breadcrumb-item>
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
            <th class>وضعیت ثبت نام</th>
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
              <button
                v-if="checkRegistration(course)!=undefined"
                data-v-17b74d76
                type="button"
                class="btn p-1 px-3 btn-xs btn-success lalezar"
              >ثبت نام شده</button>
              <button
                v-else-if="course['ok']==undefined"
                @click="courseRegister(course)"
                data-v-17b74d76
                type="button"
                class="btn p-1 px-3 btn-xs btn-warning lalezar"
              >برای ثبت نام کلیک کنید</button>
            </td>
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
            this.maxInPage}&limit=${this.maxInPage}&r=!a&exception=teachers`
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
            this.maxInPage}&limit=${this.maxInPage}&r=!a&exception=teachers`
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
            this.maxInPage}&limit=${this.maxInPage}&r=!a&exception=teachers`
        )
        .then(res => {
          this.courses = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    checkRegistration(course) {
      //5d983723f0fd300f6068a9ee
      var find = course.user.find(obj => {
        return obj._id == this.user.id
      });
      if (find) {
        this.isReg[course._id] = true;
      }
      return find;
    },
    courseRegister(course) {
      this.axios
        .patch(`http://localhost:3000/api/course/user/add`, {
          courseId: course._id,
          teacherId: this.user.id
        })
        .then(res => {
          console.log("res.data");
          console.log(res.data);
          console.log(course);
          course["ok"] = true;
          Object.keys(course).forEach(item => {
            if (item != "user" && item != "creator") {
              //  course[item] = res.data[item];
            }
          });
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
    }
  },
  mounted() {
    this.user.id = this.$cookie.get('id');
    //TODO: if not cookie redirect login
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
          this.maxInPage}&limit=${this.maxInPage}&r=!a&exception=teachers`
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
