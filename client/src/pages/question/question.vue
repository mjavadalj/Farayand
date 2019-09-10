<template>
  <div>
    <b-breadcrumb>
      <b-breadcrumb-item>سلام</b-breadcrumb-item>
      <b-breadcrumb-item active>{{course.title}}</b-breadcrumb-item>
      <b-breadcrumb-item active>{{lesson.title}}</b-breadcrumb-item>
      <b-breadcrumb-item active>{{session.title}}</b-breadcrumb-item>
      <b-breadcrumb-item active>سوالات</b-breadcrumb-item>
    </b-breadcrumb>
    <h1 class="display-3 text-right">{{session.title}}</h1>
    <div
      v-for="(question,index) in questions"
      :key="question._id"
      class="list-group text-center lalezar"
      style="border:1px solid;margin:2px 2px 2px 2px;"
    >
      <ul class="list-group list-group-flush">
        <li class="list-group-item">
          <span>
            <td>
              <i
                @click="deleteQuestion(question,index)"
                class="fa fa-remove action-icon"
                style="font-size: 1.5em;"
              />
              <i
                @click="editQuestion(question, index)"
                class="fa fa-edit action-icon"
                style="font-size: 1.5em;"
              />
            </td>
          </span>
          {{index+1}} سوال شماره
        </li>
        <li class="list-group-item">
          <input
            class="question-input"
            type="text"
            v-bind:id="question._id+'text'"
            v-bind:value="question.text"
          />
        </li>
        <li @click="changeAnswer($event,question,'option_1')" class="list-group-item">
          <td v-if="question.option_1.correct" data-v-71d02ef0>
            <span data-v-71d02ef0 class="badge badge-success">جواب</span>
          </td>
          <input
            class="question-input"
            type="text"
            v-bind:id="question._id+'q1'"
            v-bind:value="question.option_1.text"
          />
        </li>
        <li @click="changeAnswer($event,question,'option_2')" class="list-group-item">
          <td v-if="question.option_2.correct" data-v-71d02ef0>
            <span data-v-71d02ef0 class="badge badge-success">جواب</span>
          </td>
          <input
            class="question-input"
            type="text"
            v-bind:id="question._id+'q2'"
            v-bind:value="question.option_2.text"
          />
        </li>
        <li @click="changeAnswer($event,question,'option_3')" class="list-group-item">
          <td v-if="question.option_3.correct" data-v-71d02ef0>
            <span data-v-71d02ef0 class="badge badge-success">جواب</span>
          </td>
          <input
            class="question-input"
            type="text"
            v-bind:id="question._id+'q3'"
            v-bind:value="question.option_3.text"
          />
        </li>
        <li @click="changeAnswer($event,question,'option_4')" class="list-group-item">
          <td v-if="question.option_4.correct" data-v-71d02ef0>
            <span data-v-71d02ef0 class="badge badge-success">جواب</span>
          </td>
          <input
            class="question-input"
            type="text"
            v-bind:id="question._id+'q4'"
            v-bind:value="question.option_4.text"
          />
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { global } from "@/main.js";
export default {
  data() {
    return {
      course: null,
      lesson: null,
      session: null,
      questions: null
    };
  },

  methods: {
    deleteQuestion(question, index) {
      this.$swal
        .fire({
          title: "Are you sure?",
          text: "آزمون ها حذف می شود",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!"
        })
        .then(result => {
          if (result.value) {
            this.axios
              .patch(`http://localhost:3000/api/question/delete/`, {
                courseId: this.course._id,
                lessonId: this.lesson._id,
                sessionId: this.session._id,
                questionId: question._id
              })
              .then(res => {
                this.questions.splice(index, 1);
                this.$swal.fire({
                  type: "success",
                  title: "موفق",
                  text: "آزمون با موفقیت حذف شد"
                });
              })
              .catch(err => {
                console.log(err);
              });
          }
        });
    },
    editQuestion(question, index) {
      var body = {};
      var text = document.getElementById(question._id + "text").value;
      var option_1 = document.getElementById(question._id + "q1").value;
      var option_2 = document.getElementById(question._id + "q2").value;
      var option_3 = document.getElementById(question._id + "q3").value;
      var option_4 = document.getElementById(question._id + "q4").value;
      if (
        text == "" ||
        option_1 == "" ||
        option_2 == "" ||
        option_3 == "" ||
        option_4 == ""
      ) {
        return alert("ورودی ها را کنترل کنید");
      }
      if (text != question.text) body["text"] = text;
      if (option_1 != question.option_1.text)
        body["option_1"] = { text: option_1, correct: true };
      if (option_2 != question.option_2.text)
        body["option_2"] = { text: option_2, correct: null };
      if (option_3 != question.option_3.text)
        body["option_3"] = { text: option_3, correct: null };
      if (option_4 != question.option_4.text)
        body["option_4"] = { text: option_4, correct: null };
      if (jQuery.isEmptyObject(body)) {
        return alert("هیچ تغییری ایجاد نشده است");
      }
      body["courseId"] = this.course._id;
      body["lessonId"] = this.lesson._id;
      body["sessionId"] = this.session._id;
      body["questionId"] = question._id;

      this.axios
        .patch(`http://localhost:3000/api/question/edit`, body)
        .then(res => {
          this.$swal.fire({
            type: "success",
            title: "موفق",
            text: "آزمون با موفقیت ویرایش شد"
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    changeAnswer(e, question, name) {
      this.$swal
        .fire({
          title: "Are you sure?",
          text: "آیا می خواهید پاسخ صحیح را تغییر دهید",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "بله"
        })
        .then(result => {
          if (result.value) {
            var lastT;
            var last;
            var body = {};
            if (
              e.target.nodeName == "TD" ||
              e.target.nodeName == "INPUT" ||
              e.target.nodeName == "SPAN"
            ) {
              return;
            }
            Object.keys(question).forEach(item => {
              if (question[item].correct == true) {
                lastT = question[item].text;
                last = item;
                question[item].correct = null;
              }
            });
            body["courseId"] = this.course._id;
            body["lessonId"] = this.lesson._id;
            body["sessionId"] = this.session._id;
            body["questionId"] = question._id;
            body[name] = { text: question[name].text, correct: true };
            body[last] = { text: lastT, correct: null };
            this.axios
              .patch(`http://localhost:3000/api/question/edit`, body)
              .then(res => {
                this.$swal.fire({
                  type: "success",
                  title: "موفق",
                  text: "پاسخ آزمون با موفقیت ویرایش شد "
                });
                question[name].correct = true;
              })
              .catch(err => {
                console.log(err);
              });
          }
        });
    }
  },
  mounted() {
    if (global == undefined) {
      this.$router.push("/teacher/course");
    }

    this.course = global.course;
    this.lesson = global.lesson;
    this.session = global.session;
    this.axios
      .post(`http://localhost:3000/api/session/show`, {
        courseId: this.course._id,
        lessonId: this.lesson._id,
        sessionId: this.session._id
      })
      .then(res => {
        this.questions = res.data;
        console.log(this.questions);
      })
      .catch(err => {
        console.log(err);
      });
  },
  created() {}
};
</script>
<style>
li:hover {
  /* background-color: rgb(210, 214, 230); */
  cursor: pointer;
}
.question-input {
  background: transparent;
  border: none;
  width: 500px;
}
/* @import 'vue-good-table/dist/vue-good-table.css'; */
</style>
