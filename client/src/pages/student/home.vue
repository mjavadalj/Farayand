<template>
  <div>
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
    <div
      id="table_data"
      class="table-resposive"
      style="text-align:center;max-height:500px; overflow: auto;margin-bottom:10px;"
    >
      <table id="dtBasicExample" align="center" class="table">
        <thead>
          <tr>
            <th class>نام</th>
            <th class>#</th>
          </tr>
        </thead>
        <tbody id="myTable">
          <tr v-for="(teacher,index) in teachers" :key="teacher._id" @click="showCourses(teacher)">
            <td>{{teacher.name}}</td>
            <td id="numeric-td">{{index+1}}</td>
          </tr>
          
        </tbody>
      </table>
    </div>
    <div id="modaaal">
      <b-modal id="my-modal" ref="my-modal" scrollable hide-footer title>
        <div class="d-block text-center xtx-b">
          <span>
            <h3>دوره مورد نظر را انتخاب کنید</h3>
          </span>
        </div>
        <div
          id="table_data"
          class="table-resposive"
          style="text-align:center;max-height:500px; overflow: auto;margin-bottom:10px;"
        >
          <table id="dtBasicExample" align="center" class="table">
            <thead>
              <tr>
                <th class>نام</th>
                <th class>#</th>
              </tr>
            </thead>
            <tbody id="myTable2">
              <tr v-for="(course,index) in courses" :key="course._id" @click="showLessons(course)">
                <td>{{course.title}}</td>
                <td>{{index+1}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </b-modal>
    </div>
    <div id="modaaal2">
      <b-modal id="my-modal2" ref="my-modal2" scrollable hide-footer title>
        <div class="d-block text-center xtx-b">
          <span>
            <h3>درس مورد نظر را انتخاب کنید</h3>
          </span>
        </div>
        <div
          id="table_data"
          class="table-resposive"
          style="text-align:center;max-height:500px; overflow: auto;margin-bottom:10px;"
        >
          <table id="dtBasicExample" align="center" class="table">
            <thead>
              <tr>
                <th class>نام</th>
                <th class>#</th>
              </tr>
            </thead>
            <tbody id="myTable2">
              <tr
                v-for="(lesson,index) in lessons"
                :key="lesson._id"
                @click="lessonRegister(lesson)"
              >
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
/* eslint-enable *//* eslint-disable */
export default {
  data() {
    return {
      teacherSelected: null,
      courseSelected: null,
      courses: {},
      lessons: {},
      user: null,
      teachers: null,
      locationClasses: "messenger-fixed messenger-on-bottom messenger-on-right",
      courses: null,
      userData: null
    };
  },
  methods: {
    showCourses(teacher) {
      this.axios
        .post(`http://localhost:3000/api/user/course/showall`, {
          user: teacher._id
        })
        .then(res => {
          this.courses = res.data;
          this.teacherSelected = teacher;
          this.$refs["my-modal"].show();
        })
        .catch(err => {
          console.log(err);
        });
    },
    showLessons(course) {
      this.axios
        .post(`http://localhost:3000/api/lesson/showall`, {
          courseId: course._id
        })
        .then(res => {
          this.$refs["my-modal"].hide();
          this.lessons = res.data;
          this.courseSelected = course;
          this.$refs["my-modal2"].show();
        })
        .catch(err => {
          console.log(err);
        });
    },
    lessonRegister(lesson) {
      this.$refs["my-modal2"].hide();
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
              userId: this.userData._id,
              courseTitle: this.courseSelected.title,
              lessonTitle: lesson.title,
              teacherName: this.teacherSelected.name,
              sessionLength: lesson.sessionLength,
              lessonId: lesson._id,
              courseId: this.courseSelected._id,
              teacherId: this.teacherSelected._id
            };
            this.axios
              .patch(`http://localhost:3000/api/user/lesson/register`, body)
              .then(res => {
                if (res.data == null) {
                  this.$swal.fire({
                    type: "warning",
                    title: "!",
                    text: " شما قبلا  در این درس ثبت نام کردید"
                  });
                  return;
                }
                this.$swal.fire({
                  type: "success",
                  title: "موفق",
                  text: " شما با موفقیت در این درس ثبت نام کردید"
                });
              })
              .catch(err => {
                console.log(err);
              });
          }
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
    search(e, temp = null) {
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
    }
  },
  mounted() {},

  async created() {
    this.user = JSON.parse(this.$cookie.get("authorization"));
    this.axios
      .post(`http://localhost:3000/api/user/show`, {
        userId: this.user.userId
      })
      .then(res => {
        this.userData = res.data;
      })
      .catch(err => {
        console.log(err);
      });

    try {
      await this.axios
        .get(`http://localhost:3000/api/user/teacher/showall`)
        .then(res => {
          console.log(res.data);

          this.teachers = res.data;
          // var temp = {};
          // this.teachers.forEach(teacher => {
          //   this.axios
          //     .post(`http://localhost:3000/api/user/course/showall`, {
          //       teacherId: teacher._id
          //     })
          //     .then(res => {
          //       temp[teacher._id] = res.data;
          //       this.courses = temp;
          //     })
          //     .catch(err => {
          //       console.log(err);
          //     });
          // });
        })
        .catch(err => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
    $("button").click(function() {
      $("button").removeClass("active");
      $(this).addClass("active");
    });
  }
};
</script>
<style>
.b-card:hover {
  cursor: pointer;
}
</style>