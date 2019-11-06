<template>
  <div>
    <b-breadcrumb>
      <b-breadcrumb-item>راهنما</b-breadcrumb-item>
      <b-breadcrumb-item active>دوره {{course.title}}</b-breadcrumb-item>
      <b-breadcrumb-item active>درس {{lesson.title}}</b-breadcrumb-item>
      <b-breadcrumb-item active>جلسه {{session.title}}</b-breadcrumb-item>
      <b-breadcrumb-item active>سوالات</b-breadcrumb-item>
    </b-breadcrumb>
    <h1 class="display-3 text-right">{{session.title}}</h1>
    <div class="custom-file">
      <input
        type="file"
        class="custom-file-input"
        id="inputGroupFile01"
        ref="inputGroupFile01"
        @change="save_name"
        aria-describedby="inputGroupFileAddon01"
      />
      <label class="custom-file-label" for="inputGroupFile01">Choose file</label>
      <button @click="upload">upload</button>
    </div>
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
          <td
            class="widgetControls widget-controls"
            v-if="question.option_1.correct"
            data-v-71d02ef0
          >
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
          <td
            class="widgetControls widget-controls"
            v-if="question.option_2.correct"
            data-v-71d02ef0
          >
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
          <td
            class="widgetControls widget-controls"
            v-if="question.option_3.correct"
            data-v-71d02ef0
          >
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
          <td
            class="widgetControls widget-controls"
            v-if="question.option_4.correct"
            data-v-71d02ef0
          >
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
    <div>
      <button id="fixedbutton" class="btn btn-primary" type="button" @click="addQuestion()">
        <i class="fa fa-plus" />
      </button>
    </div>
  </div>
</template>
<script>
import { global } from "@/main.js";
export default {
  data() {
    return {
      newAnswer: 0,
      course: null,
      lesson: null,
      session: null,
      questions: null,
      file: ""
    };
  },

  methods: {
    deleteQuestion(question, index) {
      if (question._id == undefined) {
        return alert("برای حذف  صفحه را ریفرش ! کنید");
      }
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
      if (question._id == undefined) {
        return alert("برای تغییر  صفحه را ریفرش ! کنید");
      }
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
        body["option_1"] = {
          text: option_1,
          correct: question.option_1.correct
        };
      if (option_2 != question.option_2.text)
        body["option_2"] = {
          text: option_2,
          correct: question.option_2.correct
        };
      if (option_3 != question.option_3.text)
        body["option_3"] = {
          text: option_3,
          correct: question.option_3.correct
        };
      if (option_4 != question.option_4.text)
        body["option_4"] = {
          text: option_4,
          correct: question.option_4.correct
        };
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
          console.log(res.data);
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
      if (e.target.nodeName == "INPUT") {
        return;
      }
      if (question._id == undefined) {
        return alert("برای تغییر پاسخ صحیح صفحه را ریفرش ! کنید");
      }
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
    },
    async addQuestion(text = "", op1 = "", op2 = "", op3 = "", op4 = "") {
      const { value: formValues2 } = await this.$swal.fire({
        html: `
          <div
                class="list-group text-center lalezar"
                style="border:1px solid;margin:2px 2px 2px 2px;"
              >
                <ul id="myForm" class="list-group list-group-flush">
                  <li class="list-group-item">
                    <span>
                    </span>
                    سوال جدید
                  </li>
                  <li class="list-group-item">
                    <input
                    value="${text}"
                      id="n-text"
                      placeholder="سوال"
                      class="question-add-input"
                      type="text"
                    />
                  </li>
                  <li class="list-group-item">
                    <input type="radio" class="form-check-input" id="1" name="materialExampleRadios">
                    <input
                    value="${op1}"
                    id="n-p-1"
                    placeholder="گزینه 1"
                      class="question-add-input"
                      type="text"
                      
                    />
                  </li>
                  <li class="list-group-item">
                  <input type="radio" class="form-check-input" id="2" name="materialExampleRadios">
                    <input
                    value="${op2}"
                    id="n-p-2"
                    placeholder="گزینه 2"
                      class="question-add-input"
                      type="text"
                    />
                  </li>
                  <li  class="list-group-item">
                    <input type="radio" class="form-check-input" id="3" name="materialExampleRadios">
                    <input
                    value="${op3}"
                    id="n-p-3"
                    placeholder="گزینه 3"
                      class="question-add-input"
                      type="text"
                    />
                  </li>
                  <li  class="list-group-item">
                    <input type="radio" class="form-check-input" id="4" name="materialExampleRadios">
                    <input
                    value="${op4}"
                    id="n-p-4"
                    placeholder="گزینه 4"
                    class="question-add-input"
                      type="text"
                    />
                  </li>
                </ul>
              </div>
          `,
        focusConfirm: false,
        preConfirm: () => {
          var ans = $("input[name=materialExampleRadios]:checked")[0];
          var text = document.getElementById("n-text").value;
          var op1 = document.getElementById("n-p-1").value;
          var op2 = document.getElementById("n-p-2").value;
          var op3 = document.getElementById("n-p-3").value;
          var op4 = document.getElementById("n-p-4").value;
          var ok = false;
          if (
            text == "" ||
            op1 == "" ||
            op2 == "" ||
            op3 == "" ||
            op4 == "" ||
            ans == undefined
          ) {
            setTimeout(() => {
              this.addQuestion(text, op1, op2, op3, op4);
            }, 0);
          } else {
            ok = true;
          }
          var question = {
            text,
            option_1: {
              text: op1,
              correct: ans.id == 1 ? true : null
            },
            option_2: {
              text: op2,
              correct: ans.id == 2 ? true : null
            },
            option_3: {
              text: op3,
              correct: ans.id == 3 ? true : null
            },
            option_4: {
              text: op4,
              correct: ans.id == 4 ? true : null
            }
          };
          return {
            ok,
            question
          };
        }
      });

      if (formValues2 == undefined || formValues2.ok == false) {
        return;
      }
      this.axios
        .patch(`http://localhost:3000/api/question/add`, {
          courseId: this.course._id,
          lessonId: this.lesson._id,
          sessionId: this.session._id,
          question: formValues2.question
        })
        .then(res => {
          this.$swal.fire({
            type: "success",
            title: "موفق",
            text: "آزمون با موفقیت ثبت شد"
          });
          this.questions.push(formValues2.question);
        })
        .catch(err => {
          console.log(err);
        });
    },
    upload() {
      var formatData = new FormData();
      //TODO: key value
      formatData.append("sessionId", this.session._id);
      formatData.append("file", this.file.files[0]);
      for (var key of formatData.entries()) {
        console.log(key[0] + ", " + key[1]);
      }

      this.axios.post("http://localhost:3000/api/session/addfile", formatData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }).then(result=>{
        console.log(result);
        
      })
      .catch(err=>{
        console.log(err);
        
      })
    },
    save_name() {
      // console.log(this.$refs["inputGroupFile01"]);

      this.file = this.$refs["inputGroupFile01"];

      console.log(this.file);
    }
  },
  async mounted() {
    if (global == undefined) {
      this.$router.push("/teacher/course");
    }
    try {
      this.course = global.course;
      this.lesson = global.lesson;
      this.session = global.session;

      await this.axios
        .post(`http://localhost:3000/api/session/showallquestions`, {
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
    } catch (error) {}
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
.question-add-input {
  background: transparent;
  width: 300px;
  border: none;
}
/* @import 'vue-good-table/dist/vue-good-table.css'; */
</style>
