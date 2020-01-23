<template>
  <div>
    <b-button style="margin:10px;" @click="back" type="reset" size="sm" variant="default">
      <span class="lalezar">بازگشت</span>
    </b-button>
    <b-button style="margin:10px;" @click="makeCanvas" type="reset" size="sm" variant="default">
      <span class="lalezar">دانلود</span>
    </b-button>
    <div class="print" style="height:500px;width:800px; margin:0 auto;" id="print">
      <div style="margin:5px;">
        <img src="../assets/image/basij-logo.png" width="100" alt />
      </div>
      <div style="margin-top:-40px;">
        <h1 class="xtx-b text-center">بسمه تعالی</h1>
      </div>
      <div style="margin-top:60px;">
        <p class="text-center just-text" style="font-family:iranyekan-fn;font-size:1.8em;">
          گواهی می شود {{getRole(user.role)}} گرامی
          <span class="high-light">علی رحیمی</span>
          با کد ملی
          {{user.nationalcode}}
        </p>
        <p class="text-center just-text" style="font-family:iranyekan-fn;font-size:1.8em;">
          درس
          {{reg_lesson.lessonTitle}} را از دوره
          {{reg_lesson.courseTitle}}
          در
          {{reg_lesson.reg_sessions.length}} جلسه
        </p>
        <p class="text-center just-text" style="font-family:iranyekan-fn;font-size:1.8em;">
          با نمره
          {{reg_lesson.finalScore}}
          با موفقیت پشت سر گذاشت
        </p>
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      
      <h6 class="text-center just-text">www.basijgofteman.ir</h6>
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
    getRole(role) {
      if (role == "student") {
        return "دانشجوی";
      } else if (role == "teacher") {
        return "استاد";
      }
    },
    back(){
      this.$router.push("/");
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
  font-family: iranyekan-fn !important;
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
</style>
