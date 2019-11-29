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
            <th class>تعداد درس</th>
            <th class>استاد</th>
            <th class>عنوان</th>
            <th class>#</th>
          </tr>
        </thead>
        <tbody id="myTable">
          <tr v-for="(course,index) in courses" :key="course._id">
            <td>
              <button
                @click="deleteCourse(course,index)"
                data-v-17b74d76
                type="button"
                class="btn p-1 px-3 btn-xs btn-warning lalezar"
              >حذف</button>
            </td>
            <td id="numeric-td">{{ new Date(course.date) | moment("jYYYY/jM/jD | HH:mm ")}}</td>
            <td id="numeric-td">{{course.lessonLength}}</td>
            <td>{{course.creator[0]}}</td>
            <td>{{course.title}}</td>
            <td id="numeric-td">{{index+1}}</td>
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
      courses: null,
      user: null
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
    // push(e, course) {
    //   if (e.target.nodeName == "I") {
    //     return;
    //   }
    //   global.courseId = course._id;
    //   global.teacherId = this.teacher._id;
    //   global.course = course;
    //   this.$router.push({
    //     name: "tlesson",
    //     params: {
    //       title: course.title
    //     }
    //   });
    // },
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
    deleteCourse(course, index) {
      this.$swal
        .fire({
          title: "Are you sure?",
          text: "از این دوره خارج می شوید",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!"
        })
        .then(result => {
          if (result.value) {
            this.axios
              .patch(`http://localhost:3000/api/course/user/delete`, {
                courseId: course._id,
                teacherId: this.user.userId
              })
              .then(res => {
                this.courses.splice(index, 1);
              })
              .catch(err => {
                console.log(err);
              });
          }
        });
    }
  },
  mounted() {},
  created() {
    for (var i = 1; i < 1000; i++)
        window.clearInterval(i);
    this.user = JSON.parse(this.$cookie.get("authorization"));
    //TODO: if not cookie redirect login
    this.axios
      .post(`http://localhost:3000/api/user/course/showall`, {
        user: this.user.userId
      })
      .then(res => {
        console.log("res.data");
        console.log(res.data);
        this.courses = res.data;
      })
      .catch(err => {
        console.log(err);
      });
    //TODO: delete below
    this.axios
      .post(`http://localhost:3000/api/user/show`, {
        userId: this.adminUser.userId
      })
      .then(res => {
        this.teacher = res.data;
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
