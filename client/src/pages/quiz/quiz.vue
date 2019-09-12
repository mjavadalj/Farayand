<template>
  <div>
    <b-breadcrumb>
      <b-breadcrumb-item>راهنما</b-breadcrumb-item>
      <b-breadcrumb-item active>درس های ثبت نام شده</b-breadcrumb-item>
      <b-breadcrumb-item active>جلسات</b-breadcrumb-item>
    </b-breadcrumb>
    <div class="text-right">
      <p data-v-de302f26>
        <button
          data-v-de302f26
          id="show-success-message"
          type="button"
          class="btn btn-success lalezar"
        >جلساتی که قبلا انجام داده اید</button>
      </p>
    </div>
    <div id="registered" class="table-resposive" style="text-align:center;">
      <table id="dtBasicExample" align="center" class="table">
        <thead>
          <tr>
            <th class>عملیات</th>
            <th class>وضعیت</th>
            <th class>نمره</th>
            <th class>شانس مجدد</th>
            <th class>تعداد تلاش</th>
            <th class>تاریخ آزمون</th>
            <th class>عنوان</th>
            <th class>#</th>
          </tr>
        </thead>
        <tbody id="myTable">
          <tr v-for="(reg_session,index) in reg_sessions" :key="reg_session._id">
            <td>
              <i
                @click="reQuiz(reg_session,index)"
                class="fa fa-refresh action-icon"
                style="font-size: 1.5em;"
              />
            </td>
            <td>{{reg_session.passed}}</td>
            <td>{{reg_session.score}}</td>
            <td>{{reg_session.anotherChanceDate}}</td>
            <td>{{reg_session.tryCount}}</td>
            <td>{{reg_session.date}}</td>
            <td>{{reg_session.title}}</td>
            <td>{{index+1}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="sessions.length!=0" class="text-right">
      <p data-v-de302f26>
        <button
          data-v-de302f26
          id="show-error-message"
          type="button"
          class="btn btn-danger lalezar"
        >بقیه جلسات</button>
      </p>
    </div>
    <div v-if="sessions.length!=0" class="table-resposive" style="text-align:center;">
      <table id="dtBasicExample" align="center" class="table">
        <thead>
          <tr>
            <th class>وضعیت</th>
            <th class>شانس مجدد</th>
            <th class>مدت زمان آزمون</th>
            <th class>حداقل نمره قبولی</th>
            <th class>تعداد سوال</th>
            <th class>عنوان</th>
            <th class>#</th>
          </tr>
        </thead>
        <tbody id="myTable">
          <tr v-for="(session,index) in sessions" :key="session._id">
            <td>
              <i
                v-if="index==0"
                @click="addToRegSession(session)"
                class="fa fa-unlock action-icon"
                style="font-size: 1.5em;"
              />
              <i v-else @click="aa()" class="fa fa-lock action-icon" style="font-size: 1.5em;" />
            </td>
            <td>{{session.secondChance}}</td>
            <td>{{session.duration}}</td>
            <td>{{session.minScore}}</td>
            <td>5</td>
            <td>{{session.title}}</td>
            <td>{{index+1}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="text-center">
      <h3 class="display-3">شما در تمامی جلسات شرکت کردید</h3>
      <button
        @click="setCertificate()"
        type="button"
        class="btn btn-success lalezar"
      >دریافت گواهی این درس</button>
    </div>
  </div>
</template>
<script>
import { global } from "@/main.js";
import "imports-loader?$=jquery,this=>window!messenger/build/js/messenger";
import reg_lessonVue from "../lesson/reg_lesson.vue";
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
      reg_lesson: null,
      courseId: null,
      lessonId: null,
      sessions: null,
      reg_sessions: null
    };
  },
  methods: {
    aa(reg_session, index) {
      alert("ابتدا باید جلسات قبلی را انجام دهید");
    },
    reQuiz(reg_session, index) {
        var now=new Date()
        var chance=new Date(reg_session.anotherChanceDate)
        if (now < chance){
            return alert('هنوز مهلت آزمون مجدد نرسیده است')
        }
        if (reg_session.tryCount>=3){
            return alert('آزمون برای شما قفل شده است')
        }
        
    },
    addToRegSession(session) {
      Date.prototype.addDays = function(days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
      };
      var date = new Date();
      var newDate = date.addDays(parseInt(session.secondChance));
      this.axios
        .patch(`http://localhost:3000/api/user/session/register`, {
          userId: "5d766c948c992a0c38924e54",
          reg_lessonId: this.reg_lesson._id,
          sessionId: session._id,
          title: session.title,
          passed: false,
          anotherChanceDate: newDate
        })
        .then(res => {
          console.log(res.data);
        })
        .catch(err => {
          console.log(err);
        });
    },
    isRegistered(session) {
      const find = this.reg_sessions.find(item => {
        return item.sessionId == session._id;
      });
      console.log(find);
    },
    setCertificate() {
      const find = this.reg_sessions.find(reg => {
        return reg.passed == false;
      });
      if (find) {
        alert("باید در تمامی جلسات نمره قبولی را بدست بیاورید");
      }
    }
  },
  mounted() {
    if (global == undefined) {
      this.$router.push("/");
    }
    this.reg_lesson = global.lesson;
    this.reg_sessions = global.lesson.reg_sessions;
    this.courseId = global.lesson.courseId;
    this.lessonId = global.lesson.lessonId;
    console.log(this.reg_sessions);

    this.axios
      .post(`http://localhost:3000/api/session/showall`, {
        courseId: this.courseId,
        lessonId: this.lessonId
      })
      .then(res => {
        this.sessions = res.data.lessons.sessions;
        var index = [];
        this.reg_sessions.forEach(reg_session => {
          this.sessions.forEach((session, i) => {
            if (session._id == reg_session.sessionId) {
              index.unshift(i);
            }
          });
        });
        // this.sessions.splice(0,1)
        index.forEach(i => {
          this.sessions.splice(i, 1);
        });
        this.sessions = this.sessions.slice(
          0,
          this.reg_lesson.sessionLength - this.reg_sessions.length
        );
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>

<style>
tr:hover {
  background-color: rgb(236, 238, 245);
  cursor: pointer;
}
</style>
