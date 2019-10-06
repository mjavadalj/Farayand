<template>
  <div>
    <div v-if="!isQuiz">
      <b-breadcrumb>
        <b-breadcrumb-item>راهنما</b-breadcrumb-item>
        <b-breadcrumb-item active>{{reg_lesson.lessonTitle}}</b-breadcrumb-item>
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
              <th class>دریافت فایل آموزشی</th>
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
              <td>
                <button
                  v-if="!reg_session.passed"
                  data-v-17b74d76
                  type="button"
                  class="btn p-1 px-3 btn-xs btn-danger lalezar"
                >رد</button>
                <button
                  v-if="reg_session.passed"
                  data-v-17b74d76
                  type="button"
                  class="btn p-1 px-3 btn-xs btn-success lalezar"
                >قبول</button>
              </td>
              <td>
                <button>x</button>
              </td>
              <td id="numeric-td">{{reg_session.score}}</td>
              <td id="numeric-td">{{reg_session.anotherChanceDate}}</td>
              <td id="numeric-td">{{reg_session.tryCount}}</td>
              <td id="numeric-td">{{ new Date(reg_session.date) | moment("jYYYY/jM/jD")}}</td>
              <td>{{reg_session.title}}</td>
              <td id="numeric-td">{{index+1}}</td>
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
              <th class>دریافت فایل آموزشی</th>
              <th class>شانس مجدد</th>
              <th class>مدت زمان آزمون</th>
              <th class>حداقل نمره قبولی</th>
              <th class>تعداد سوال</th>
              <th class>عنوان</th>
              <th class>#</th>
            </tr>
          </thead>
          <tbody id="myTable">
            <tr
              v-for="(session,index) in sessions"
              :key="session._id"
              @click="addToRegSession($event,session,index)"
            >
              <td>
                <i v-if="index==0" class="fa fa-unlock action-icon" style="font-size: 1.5em;" />
                <i v-else @click="aa()" class="fa fa-lock action-icon" style="font-size: 1.5em;" />
              </td>
              <td>
                <button @click="setQuizTime(index,session)">x</button>
              </td>
              <td id="numeric-td">پس از {{session.secondChance}} روز</td>
              <td id="numeric-td">{{duration(session.duration)}}</td>
              <td id="numeric-td">{{session.minScore}}</td>
              <td id="numeric-td">{{session.questionLength}}</td>
              <td>{{session.title}}</td>
              <td id="numeric-td">{{index+1}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else-if="!reg_lesson.passed" class="text-center">
        <h3 class="display-3">شما در تمامی جلسات شرکت کردید</h3>
        <button
          @click="setCertificate()"
          type="button"
          class="btn btn-success lalezar"
        >دریافت گواهی این درس</button>
      </div>
      <div v-else-if="reg_lesson.passed">
        <h5 class="lalezar text-center">گواهی این درس برای شما صادر شده است</h5>
      </div>
    </div>
    <div v-else>
      <div
        v-for="(question,index) in questions"
        :key="question._id"
        class="list-group text-center lalezar"
        style="border:1px solid;margin:2px 2px 2px 2px;"
      >
        <ul class="list-group list-group-flush">
          <li class="list-group-item">{{index+1}} سوال شماره</li>
          <li class="list-group-item">
            <span>{{question.text}}</span>
          </li>
          <li class="list-group-item">
            <input
              type="radio"
              class="form-check-input"
              v-bind:id="'option_1'"
              :name="question._id"
            />
            <span>{{question.option_1.text}}</span>
          </li>
          <li class="list-group-item">
            <input
              type="radio"
              class="form-check-input"
              v-bind:id="'option_2'"
              :name="question._id"
            />
            <span>{{question.option_2.text}}</span>
          </li>
          <li class="list-group-item">
            <input
              type="radio"
              class="form-check-input"
              v-bind:id="'option_3'"
              :name="question._id"
            />
            <span>{{question.option_3.text}}</span>
          </li>
          <li class="list-group-item">
            <input
              type="radio"
              class="form-check-input"
              v-bind:id="'option_4'"
              :name="question._id"
            />
            <span>{{question.option_4.text}}</span>
          </li>
        </ul>
      </div>

      <div class="fixed-top text-right">
        <button class="btn btn-danger" style="z-index:5;" type="button">
          <span class="lalezar" id="countdown">00:00</span>
        </button>
        <button
          class="btn btn-success text-center"
          style="z-index:4;"
          type="button"
          @click="endQuiz(selectedRegSession,selectedSession)"
        >
          <span class="lalezar">خاتمه امتحان</span>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { global } from "@/main.js";
import "imports-loader?$=jquery,this=>window!messenger/build/js/messenger";
// import reg_lessonVue from "../lesson/reg_lesson.vue";
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
      intervalTimer: null,
      deletedSessions: {},
      selectedRegSession: null,
      selectedSession: null,
      questions: null,
      isQuiz: false,
      locationClasses: "messenger-fixed messenger-on-bottom messenger-on-right",
      reg_lesson: null,
      courseId: null,
      lessonId: null,
      sessions: null,
      reg_sessions: null,
      lock: true
    };
  },
  methods: {
    aa(reg_session, index) {
      alert("ابتدا باید جلسات قبلی را انجام دهید");
      this.check();
    },
    reQuiz(reg_session, index) {
      var now = new Date();
      var chance = new Date(reg_session.anotherChanceDate);
      // reg_session.passed
      if (false) {
        return alert("شما در این آزمون پذیرفته شده اید");
      } else if (now > chance) {
        return alert("بعدا");
      } else if (true) {
        this.showQuestions(
          reg_session,
          this.deletedSessions[reg_session.sessionId]
        );
      }
    },
    addToRegSession(e, session, index) {
      if (e.target.nodeName == "BUTTON") {
        return;
      }
      if (
        localStorage.getItem(session._id) &&
        new Date() < new Date(localStorage.getItem(session._id))
      ) {
        var now = new Date();
        var date = new Date(localStorage.getItem(session._id));
        var diffMs = date - now;
        var minutes = Math.floor(diffMs / 1000 / 60);
        var seconds = Math.floor((diffMs / 1000) % 60);
        return alert(
          `پس از ${minutes} دقیقه و ${seconds} ثانیه می توانید آزمون دهید`
        );
      } else if (localStorage.getItem(session._id) == null) {
        return alert("ابتدا فایل آموزشی را دریافت کنید");
      }
      if (index != 0 || !this.check) {
        return;
      }
      Date.prototype.addDays = function(days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
      };
      var date = new Date();
      var newDate = date.addDays(parseInt(session.secondChance));
      if (session.questionLength == 0) {
        this.axios
          .patch(`http://localhost:3000/api/user/session/register`, {
            userId: "5d8a5561acb6b226e8de83ae",
            reg_lessonId: this.reg_lesson._id,
            sessionId: session._id,
            title: session.title,
            passed: true,
            anotherChanceDate: newDate,
            score: 100
          })
          .then(res => {
            // var length=res.data.lessons[global.index].session.length-1
            var newRegSession = res.data.reg_lessons[
              global.index
            ].reg_sessions.slice(-1)[0];
            this.reg_sessions.push(newRegSession);
            this.sessions.splice(index, 1);
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.axios
          .patch(`http://localhost:3000/api/user/session/register`, {
            userId: "5d8a5561acb6b226e8de83ae",
            reg_lessonId: this.reg_lesson._id,
            sessionId: session._id,
            title: session.title,
            passed: false,
            anotherChanceDate: newDate,
            score: 0
          })
          .then(res => {
            // var length=res.data.lessons[global.index].session.length-1
            var newRegSession = res.data.reg_lessons[
              global.index
            ].reg_sessions.slice(-1)[0];
            this.showQuestions(newRegSession, session);
            this.reg_sessions.push(newRegSession);
            this.sessions.splice(index, 1);
          })
          .catch(err => {
            console.log(err);
          });
      }
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
        alert("باید در تمامی آزمون ها پذیرفته شوید تا گواهی برای شما صادر شود");
      } else {
        this.axios
          .patch(`http://localhost:3000/api/user/setcertificate`, {
            userId: "5d8a5561acb6b226e8de83ae",
            reg_lessonId: this.reg_lesson._id
          })
          .then(res => {
            this.reg_lesson.passed = true;
          })
          .catch(err => {
            alert('باید در تمام جلسات پذیرفته شوید')
          });

        //TODO: certificate
      }
    },
    showQuestions(reg_session, session) {
      this.isQuiz = true;
      this.selectedRegSession = reg_session;
      this.selectedSession = session;
      this.axios
        .post(`http://localhost:3000/api/session/showrandonmquestions`, {
          courseId: this.courseId,
          lessonId: this.lessonId,
          sessionId: session._id
        })
        .then(res => {
          var a = 0;
          var duration = parseInt(session.duration) * 60;
          this.questions = res.data;
          this.intervalTimer = setInterval(() => {
            var time = duration - a;
            var minute = Math.floor(time / 60);
            if (minute < 10) {
              minute = "0" + minute;
            }
            var second = Math.floor(time % 60);
            if (second < 10) {
              second = "0" + second;
            }
            document.getElementById("countdown").innerHTML =
              minute + ":" + second;
            a++;
            if (time <= 0) {
              document.getElementById("countdown").innerHTML =
                "زمان شما تمام شد";
              clearInterval(this.intervalTimer);
              this.endQuiz(reg_session, session, true);
            }
          }, 1000);
        })
        .catch(err => {
          console.log(err);
        });
    },
    endQuiz(reg_session, session, force = false) {
      var BreakException = {};
      var answerBody = {};
      var correct = 0;
      var tryCount = parseInt(reg_session.tryCount) + 1;
      try {
        this.questions.forEach((question, i) => {
          var ans = $(`input[name=${question._id}]:checked`);
          if (ans.length == 0 && !force) {
            alert(`به سوال شماره ${i + 1} پاسخ ندادید`);
            throw BreakException;
          }
          if (ans.length == 0) {
            answerBody[question._id] = undefined;
          } else {
            answerBody[question._id] = ans[0].id;
          }
        });
        this.axios
          .post(`http://localhost:3000/api/session/checkquiz`, {
            answerBody,
            courseId: this.reg_lesson.courseId,
            lessonId: this.reg_lesson.lessonId,
            sessionId: session._id
          })
          .then(res1 => {
            var passed = res1.data.score >= session.minScore;
            this.axios
              .patch(`http://localhost:3000/api/user/session/complete`, {
                userId: "5d8a5561acb6b226e8de83ae",
                reg_lessonId: this.reg_lesson._id,
                reg_sessionId: reg_session._id,
                passed: passed,
                score: res1.data.score,
                anotherChanceDate: reg_session.anotherChanceDate,
                title: reg_session.title,
                date: reg_session.date,
                sessionId: reg_session.sessionId,
                tryCount
              })
              .then(res => {
                reg_session.passed = passed;
                reg_session.score = res1.data.score;
                reg_session.tryCount = tryCount;
                this.isQuiz = false;
                clearInterval(this.intervalTimer);
              })
              .catch(err => {
                this.isQuiz = false;
                clearInterval(this.intervalTimer);
                console.log(err);
              });
          })
          .catch(err => {
            clearInterval(this.intervalTimer);
            console.log(err);
          });
      } catch (e) {
        if (e !== BreakException) throw e;
      }
    },
    duration(d) {
      return `${d}'`;
    },
    check() {
      // const index=this.reg_sessions.length-1
      // return this.reg_sessions[index].passed
      return true;
    },
    setQuizTime(index, session) {
      if (index != 0) {
        return alert("ابتدا باید جلسات قبلی را کامل کنید");
      }
      if (localStorage.getItem(session._id)) {
        return;
      }
      var dt = new Date();
      dt.setMinutes(dt.getMinutes() + 1);
      localStorage.setItem(session._id, dt);
    }
  },
  mounted() {
    if (global == undefined) {
      this.$router.push("/teacher");
    }
    //TODO: user info
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
        this.sessions = res.data;
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
          this.deletedSessions[this.sessions[i]._id] = this.sessions[i];
          this.sessions.splice(i, 1);
        });
        this.sessions = this.sessions.slice(
          0,
          this.reg_lesson.sessionLength - this.reg_sessions.length
        );
        console.log(this.de);
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
