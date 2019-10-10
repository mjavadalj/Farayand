<template>
  <div v-if="role!=null" class="login-page">
    <b-container>
      <div class="fixed-top text-center">
        <h5 class="logo">
          <i class="fa fa-circle text-gray" />
          <span class="lalezar" style="color:black;">بسیج اساتید</span>
          <i class="fa fa-circle text-warning" />
        </h5>
      </div>
      <h5 class="logo">
        <span @click="role=null"><i class="fa fa-edit refresh"></i></span>
        <span class="lalezar" style="color:black;">به عنوان {{getRole()}} در حال ثبت نام هستید</span>
        
      </h5>
      <Widget
        class="mx-auto"
        title="<h6 class='mt-0 lalezar text-center'>تمامی بخش ها را تکمیل کنید</h6>"
        customHeader
      >
        <form class="mt" @submit.prevent="signup">
          <b-alert class="alert-sm" variant="danger" :show="!!errorMessage">{{errorMessage}}</b-alert>
          <div class="form-group">
            <input
              class="form-control no-border"
              ref="name"
              required
              type="text"
              name="name"
              placeholder="نام کامل"
              oninvalid="this.setCustomValidity('نام کامل خود را وارد کنید')"
              oninput="setCustomValidity('')"
            />
          </div>
          <div class="form-group">
            <input
              class="form-control no-border"
              ref="username"
              required
              type="text"
              name="username"
              placeholder="نام کاربری"
              oninvalid="this.setCustomValidity('نام کاربری خود را وارد کنید')"
              oninput="setCustomValidity('')"
            />
          </div>
          <div class="form-group">
            <input
              class="form-control no-border"
              ref="password"
              required
              type="password"
              name="password"
              placeholder="رمز"
              oninvalid="this.setCustomValidity('رمز خود را وارد کنید')"
              oninput="setCustomValidity('')"
            />
          </div>
          <div class="form-group">
            <input
              class="form-control no-border"
              ref="email"
              required
              type="email"
              name="email"
              placeholder="ایمیل"
              oninvalid="this.setCustomValidity('ایمیل خود را به درستی وارد کنید')"
              oninput="setCustomValidity('')"
            />
          </div>
          <div class="form-group">
            <input
              class="form-control no-border"
              ref="phoneNumber"
              required
              type="text"
              pattern="^\d{4}\d{3}\d{4}$"
              name="phoneNumber"
              placeholder="شماره همراه"
              oninvalid="this.setCustomValidity('شماره همراه خود را به درستی وارد کنید')"
              oninput="setCustomValidity('')"
            />
          </div>
          <div class="form-group text-center">
            <label class="radio-inline" style="margin-right:10px;">
              <input type="radio" name="optradio" checked />
              <span class="lalezar">آقا</span>
            </label>
            <label class="radio-inline">
              <input type="radio" name="optradio" />
              <span class="lalezar">خانم</span>
            </label>
          </div>
          <div class="clearfix">
            <div class="btn-toolbar float-right">
              <b-button type="submit" size="sm" variant="inverse">
                <i class="fa fa-sign-in">
                  <span style="margin-left:2px;" class="lalezar">ثبت نام</span>
                </i>
              </b-button>
            </div>
          </div>
        </form>
      </Widget>
    </b-container>
    <footer class="footer">2017 &copy; Sing. Admin Dashboard Template.</footer>
  </div>
  <div v-else>
    <b-container>
      <div class="page-middle">
        <div class="text-center">
          <h3 class="lalezar">ثبت نام به عنوان</h3>
        </div>
        <div style="margin-top:20px;" class="text-center">
          <figure @click="setRole('student')" style="margin-right:50px;" class="figure">
            <img
              src="../../assets/image/student.png"
              width="200px"
              height="200px"
              alt="Responsive image"
            />
            <figcaption class="figure-caption">
              <span style="font-size:1.2em;" class="lalezar">دانشجو</span>
            </figcaption>
          </figure>
          <figure @click="setRole('teacher')" style="margin-left:50px;" class="figure">
            <img
              src="../../assets/image/teacher.png"
              width="200px"
              height="200px"
              alt="Responsive image"
            />
            <figcaption class="figure-caption">
              <span  style="font-size:1.2em;" class="lalezar">استاد</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </b-container>
  </div>
</template>

<script>
import Widget from "@/components/Widget/Widget";

export default {
  name: "LoginPage",
  components: { Widget },
  data() {
    return {
      errorMessage: null,
      role: null
    };
  },
  methods: {
    signup() {
      const username = this.$refs.username.value;
      const password = this.$refs.password.value;
      console.log(this.$refs);

      // if (username.length !== 0 && password.length !== 0) {
      //   window.localStorage.setItem('authenticated', true);
      //   this.$router.push('/app/main/analytics');
      // }
    },
    setRole(role) {
      this.role = role;
      console.log(role);
    },
    getRole() {
      if (this.role == "teacher") {
        return "استاد";
      } else {
        return "دانشجو";
      }
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
