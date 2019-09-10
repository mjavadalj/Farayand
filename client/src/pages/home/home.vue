<template>
  <div>
    <div class="text-center">
      <div id="teachers">
        <button
          @click="showCourses(teacher)"
          v-for="teacher in teachers"
          :key="teacher._id"
          style="margin-left:2px;"
          type="button"
          class="btn btn-outline-primary"
        >{{teacher.name}}</button>
      </div>
      <br />
      <div v-if="courseOpen">
        <button
          @click="showLesson(course)"
          v-for="course in courses"
          :key="course._id"
          style="margin:2px 2px 2px 2px;"
          type="button"
          class="btn btn-outline-secondary"
        >{{course.title}}</button>
      </div>
      <br />
      <div v-if="lessonOpen">
        <button
          v-for="lesson in lessons"
          :key="lesson._id"
          style="margin:2px 2px 2px 2px;"
          type="button"
          class="btn btn-outline-info"
        >{{lesson.title}}</button>
      </div>
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
      teacherSelected: null,
      courseSelected: null,
      courseOpen: false,
      lessonOpen: false,
      loadedCourses: {},
      loadedLessons: {},
      courses: {},
      lessons: {},
      user: null,
      teachers: null,
      locationClasses: "messenger-fixed messenger-on-bottom messenger-on-right",
      courses: null
    };
  },
  methods: {
    showCourses(teacher) {
      if (
        this.teacherSelected != null &&
        this.teacherSelected._id == teacher._id
      ) {
        this.lessonOpen = false;
        return;
      }
      if (this.loadedCourses[teacher._id] != undefined) {
        this.courses = this.loadedCourses[teacher._id];
        this.teacherSelected = teacher;
        this.courseOpen = true;
        this.lessonOpen = false;
        return;
      }
      this.axios
        .post(`http://localhost:3000/api/user/course/showall`, {
          teacherId: teacher._id
        })
        .then(res => {
          console.log("course load");
          this.courses = res.data;
          this.courseOpen = true;
          this.lessonOpen = false;
          this.loadedCourses[teacher._id] = res.data;
          this.teacherSelected = teacher;
        })
        .catch(err => {
          console.log(err);
        });
    },
    showLesson(course) {
      if (
        this.courseSelected != null &&
        this.courseSelected._id == course._id
      ) {
        return;
      }
      if (this.loadedLessons[course._id] != undefined) {
        this.lessons = this.loadedLessons[course._id];
        this.courseSelected = course;
        this.lessonOpen = true;
        return;
      }
      this.axios
        .post(`http://localhost:3000/api/lesson/showall`, {
          courseId: course._id
        })
        .then(res => {
          console.log("lesson load");

          this.lessons = res.data.lessons;
          this.loadedLessons[course._id] = res.data.lessons;
          this.courseSelected = course;
          this.lessonOpen = true;
        })
        .catch(err => {
          console.log(err);
        });
    },
    al(x) {
      alert(x.target.nodeName);
    }
  },
  mounted() {},

  async created() {
    // this.initializationMessengerCode();
    // this.initCharts();
    //emadi
    //5d77a5193908ca10e8a7877a
    //khodadi
    //5d74028057b2c842046986c7
    //amir
    //5d766c948c992a0c38924e54
    this.axios
      .post(`http://localhost:3000/api/user/show`, {
        userId: "5d766c948c992a0c38924e54"
      })
      .then(res => {
        this.user = res.data;
      })
      .catch(err => {
        console.log(err);
      });

    try {
      await this.axios
        .get(`http://localhost:3000/api/user/teacher/showall`)
        .then(res => {
          this.teachers = res.data;
          var temp = {};
          this.teachers.forEach(teacher => {
            this.axios
              .post(`http://localhost:3000/api/user/course/showall`, {
                teacherId: teacher._id
              })
              .then(res => {
                temp[teacher._id] = res.data;
                this.courses = temp;
              })
              .catch(err => {
                console.log(err);
              });
          });
        })
        .catch(err => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  }
};
</script>
<style>
.b-card:hover {
  cursor: pointer;
}
</style>