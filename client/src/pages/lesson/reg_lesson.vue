<template>
  <div>
    <b-breadcrumb>
      <b-breadcrumb-item>راهنما</b-breadcrumb-item>
      <b-breadcrumb-item active>درس های ثبت نام شده</b-breadcrumb-item>
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
            <th class>وضعیت گواهی</th>
            <th class>تاریخ ثبت نام</th>
            <th class>جلسات انجام شده</th>
            <th class>جلسات این درس</th>
            <th class>استاد</th>
            <th class>عنوان درس</th>
            <th class>عنوان دوره</th>
            <th class>#</th>
          </tr>
        </thead>
        <tbody id="myTable">
          <tr
            v-for="(reg_lesson,index) in reg_lessons"
            :key="reg_lesson._id"
            @click="push($event,reg_lesson,index)"
          >
            <td>
              <i
                @click="deleteRegLesson(reg_lesson,index)"
                class="fa fa-remove action-icon"
                style="font-size: 1.5em;"
              />
            </td>
            <td>
              <button
                v-if="!reg_lesson.passed"
                data-v-17b74d76
                type="button"
                class="btn p-1 px-3 btn-xs btn-danger lalezar"
              >صادر نشده</button>
              <button
                v-if="reg_lesson.passed"
                data-v-17b74d76
                type="button"
                class="btn p-1 px-3 btn-xs btn-success lalezar"
              >صادر شده</button>
            </td>
            <td>{{reg_lesson.date}}</td>
            <td>{{reg_lesson.reg_sessions.length}}</td>
            <td>{{reg_lesson.sessionLength}}</td>
            <td>{{reg_lesson.teacherName}}</td>
            <td>{{reg_lesson.lessonTitle}}</td>
            <td>{{reg_lesson.courseTitle}}</td>
            <td>{{index+1}}</td>
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
      locationClasses: "messenger-fixed messenger-on-bottom messenger-on-right",
      reg_lessons: null
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
    push(e,reg_lesson,index) {
      if (e.target.nodeName=='I'){
        return
      }
      // global.courseId = course._id;
      global.lesson=reg_lesson
      global.index=index
      this.$router.push({
        name: "quiz"
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
    deleteRegLesson(reg_lesson,index){
      this.$swal
        .fire({
          title: "Are you sure?",
          text: "حذف درس",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!"
        })
        .then(result => {
          if (result.value) {
            var body={
              userId:"5d766c948c992a0c38924e54",
              reg_lessonId:reg_lesson._id
            }
            this.axios.patch("http://localhost:3000/api/user/reg/delete",body)
            .then(res=>{
              this.reg_lessons=res.data.reg_lessons
              
            })
            .catch(err=>{
              console.log(err);
              
            })
          }
        });
    }
  },
  mounted() {
    // this.initCharts();

    this.axios
      .post(`http://localhost:3000/api/user/reg/show`, {
        userId: "5d766c948c992a0c38924e54"
      })
      .then(res => {
        console.log("res.data");
        console.log(res.data);
        this.reg_lessons = res.data.reg_lessons;
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

<style>
tr:hover {
  background-color: rgb(236, 238, 245);
  cursor: pointer;
}
</style>
