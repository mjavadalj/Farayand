<template><div>

  <div v-show="!ok" ref="canvas">
    <p> گواهی فلان درس با فلان استاد از فلان دانشگاه با فلان نمره با فلان وضعیت</p>
    <!-- //TODO: axe emzaye yaroo -->
    
    <div ref="box1">
    
    </div>
  </div>
  <!-- <b-button @click="makeCanvas" type="reset" size="sm" variant="default">
                    <span class="lalezar">to canvas</span>
                  </b-button> -->
    <a ref="a"></a> 
  </div>
</template>
<script>
/* eslint-enable *//* eslint-disable */

export default {
  data() {
    return {
      output: null,
      ok:false
    };
  },
  methods: {
    /*async makeCanvas(){
          const options = {
              type: 'dataURL'
          }
            this.output = await this.$html2canvas(this.$refs.canvas ,options);
            console.log(this.output);
      }*/
  },
  async mounted(){
          const options = {
              type: 'dataURL'
          }
            this.output = await this.$html2canvas(this.$refs.canvas ,options);
            console.log(this.output);
             this.$refs.a.href = this.output;
        this.$refs.a.download = 'somefilename.jpg';
        this.$refs.a.click();
    
  }
};
</script>

<style>

</style>
