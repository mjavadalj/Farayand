<template>
  <div class="login-page">
    <b-container>
      <h5 class="logo">
        <i class="fa fa-circle text-gray" />
        <span class="lalezar" style="color:black;">بسیج اساتید</span>
        <i class="fa fa-circle text-warning" />
      </h5>
      <Widget
        class="mx-auto"
        title="<h4 class='mt-0 lalezar text-center'>وارد شوید</h4>"
        customHeader
      >
        <form class="mt" @submit.prevent="login">
          <b-alert class="alert-sm" variant="danger" :show="!!errorMessage">{{errorMessage}}</b-alert>
          <div class="form-group">
            <input
              class="form-control no-border lalezar"
              ref="nationalcode"
              required
              type="text"
              name="nationalcode"
              placeholder="کد ملی"
            />
          </div>
          <div class="form-group">
            <input
              class="form-control no-border lalezar"
              ref="password"
              required
              type="password"
              name="password"
              placeholder="رمز عبور"
            />
          </div>
          <div class="clearfix">
            <div class="btn-toolbar float-right">
              <b-button @click="signup" type="reset" size="sm" variant="default">
                <span class="lalezar">ثبت نام کنید</span>
              </b-button>
              <b-button type="submit" size="sm" variant="inverse">
                <span class="lalezar">ورود</span>
              </b-button>
            </div>
          </div>
        </form>
      </Widget>
    </b-container>
    <footer class="footer">2017 &copy; Sing. Admin Dashboard Template.</footer>
  </div>
</template>

<script>
import Widget from "@/components/Widget/Widget";
import VueJWT from "vuejs-jwt";

export default {
  name: "LoginPage",
  components: { Widget },
  data() {
    return {
      errorMessage: null
    };
  },
  methods: {
    login() {
      const nationalcode = this.$refs.nationalcode.value;
      const password = this.$refs.password.value;
      var body = {
        nationalcode,
        password
      };
      this.axios
        .post("http://localhost:3000/api/user/signin", body)
        .then(loginResponse => {
          if (loginResponse.data.code == 1) {
            const jwt = loginResponse.data.jwt;
            const decoded = this.$jwt.decode(jwt);
            this.$cookie.set("authorization", JSON.stringify(decoded));
            this.$cookie.set("jwt", jwt);

            switch (decoded.role) {
              case "student":
                this.$router.push("/");
                break;
              case "teacher":
                this.$router.push("/teacher");
                break;
              case "admin":
                this.$router.push("/app/course");
                break;
            }
          }
          else{
            alert(loginResponse.data.message)
          }
        })
        .catch(loginError => {});

      // ? ---------------------------------------------

      // if (nationalcode.length !== 0 && password.length !== 0) {
      //   window.localStorage.setItem('authenticated', true);
      //   this.$router.push('/app/main/analytics');
      // }
    },
    signup() {
      this.$router.push("/signup");
    }
  },
  created() {
    // if (window.localStorage.getItem('authenticated') === 'true') {
    //   this.$router.push('/app/main/analytics');
    // }
  }
};
</script>

<style src="./Login.scss" lang="scss" scoped />
