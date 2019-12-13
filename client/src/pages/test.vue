<template>
  <div>
      <div ref="content" @click="downloadCertificate('reg_lesson')" id="canvas" class="pic">
    <h3 style="margin-left:500px">ddd</h3>
  </div>
  <div id="xx">

  </div>
  </div>
</template>
<script>
import { global } from "@/main.js";
import "imports-loader?$=jquery,this=>window!messenger/build/js/messenger";
const { Messenger } = window;
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
export default {
  data() {
    return {
      locationClasses: "messenger-fixed messenger-on-bottom messenger-on-right",
      reg_lessons: null,
      user: {}
    };
  },
  methods: {
    downloadCertificate(reg_lesson) {
      //     html2canvas(document.querySelector('#canvas')).then(canvas => {
      //   	let pdf = new jsPDF('p','mm','a4');
      //   	pdf.addImage(canvas.toDataURL('image/png'), 'PNG',0,0);
      //   	pdf.save('filename.pdf');
      //   });
      var canvasElement = document.createElement("canvas");
      const doc = new jsPDF();
      html2canvas(this.$refs.content, { canvas: canvasElement }).then(function(
        canvas
      ) {
        const img = canvas.toDataURL("image/jpeg", 0.8);
        console.log(img);
        
        // doc.addImage(img, "JPEG", 20, 20);
        // doc.save("sample.pdf");
      });
    }
  },
  mounted() {
    // this.initCharts();
  },
  created() {}
};
</script>

<style >
.pic {
  background: url("../assets/image/form1.jpg") no-repeat center center fixed;
  /* -webkit-background-size: cover;
  -moz-background-size: cover;
  background-size: cover;
  -o-background-size: cover; */
  width: 100%;
  height: 100vh;
}
</style>