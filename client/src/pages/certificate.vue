<template>
  <div>
    <b-button style="margin:10px;" @click="back" type="reset" size="sm" variant="default">
      <span class="lalezar">بازگشت</span>
    </b-button>
    <b-button style="margin:10px;" @click="makeCanvas" type="reset" size="sm" variant="default">
      <span class="lalezar">دانلود</span>
    </b-button>
    <div class="print" style="height:1600px;width:1221px; margin:0 auto;" id="print">
      <div style="padding-top:50px;">
        <h1 style="font-size:6em;color:black !important;" class="xtx-b text-center">بسمه تعالی</h1>
      </div>
      <div class="just-text" style="width:800px;margin:0 auto;margin-top:300px;">
        <p
          class="just-text"
          style="font-family:iranyekan-fn;font-size:2.7em; color:black !important;"
        >گواهی می شود </p>
        <p
          class="just-text"
          style="font-family:iranyekan-fn;font-size:2.7em; color:black !important;line-height: 2;"
        >{{getRole(user.role)}}
          {{getGender(user.gender)}}
          {{user.name}}
          با کد ملی
          {{user.nationalcode}}
          درس
          {{reg_lesson.lessonTitle}} را  از دوره
          {{reg_lesson.courseTitle}}
          در
          {{reg_lesson.reg_sessions.length}} جلسه
          با نمره
          {{reg_lesson.finalScore}}
          با موفقیت پشت سر گذاشته است
        </p>
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />

      <div style="margin-top:200px;margin-left:50px;">
        <img src="../assets/image/basij-logo.png" width="300" alt />
        <p
          style="font-family:iranyekan-fn-lgt;font-size:2.7em;"
          class="text-center just-text"
        >{{ Date.now() | moment("jYYYY/jM/jD")}}</p>
        <p style="font-size:2.7em;" class="text-center just-text">www.basijgofteman.ir</p>
      </div>
    </div>

    <a ref="a"></a>
  </div>
</template>
<script>
/* eslint-enable */ /* eslint-disable */
import jsPDF from "jspdf";
import { global } from "@/main.js";
export default {
  data() {
    return {
      jwt: null,
      headers: null,
      output: null,
      ok: false,
      reg_lesson: null,
      user: null
    };
  },
  methods: {
    async makeCanvas() {
      const options = {
        type: "dataURL"
      };
      // this.output = await this.$html2canvas(this.$refs.canvas, options);
      this.output = await this.$html2canvas(
        document.getElementById("print"),
        options
      );
      this.$refs.a.href = this.output;
      this.$refs.a.download = "somefilename.png";
      this.$refs.a.click();
    },
    getGender(gender) {
      if (gender == "woman") {
        return "سرکار خانم";
      } else if (gender == "man") {
        return "جناب آقای";
      }
    },
    back() {
      this.$router.push("/");
    },
    getRole(role) {
      if (role == "student") {
        return "دانشجوی گرامی";
      } else if (role == "teacher") {
        return "استاد گرامی";
      }
    }
  },
  async mounted() {
    this.user = JSON.parse(this.$cookie.get("authorization"));

    if (global == undefined) {
      this.$router.push("/");
    } else {
      this.reg_lesson = global.reg_lesson;
    }
    console.log(this.reg_lesson);

    // const options = {
    //   type: "dataURL"
    // };
    // // this.output = await this.$html2canvas(this.$refs.canvas, options);
    // this.output = await this.$html2canvas(document.body, options);
    // this.$refs.a.href = this.output;
    // this.$refs.a.download = "somefilename.png";
    // this.$refs.a.click();
  }
};
</script>

<style>
.just-text {
  text-align: justify !important;
  direction: rtl;
}
.high-light {
  font-family: iranyekan-fn-lgt !important;
}
.idk {
  background: url("../assets/image/3.png");
  /* -webkit-background-size: cover;
  -moz-background-size: cover;
  background-size: cover;
  -o-background-size: cover; */
  width: 100%;
  height: 100vh;
  /* width: 1500px;
  height: 1000px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); */
}
#print {
  background-image: url("../assets/image/cert2.png");
  /* background-repeat: no-repeat;
  background-size: contain; */
  -webkit-background-size: cover;
  -moz-background-size: cover;
  background-size: cover;
  -o-background-size: cover;
}
</style>
