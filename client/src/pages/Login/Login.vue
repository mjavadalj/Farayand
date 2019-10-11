<template>
  <div class="login-page">
    <b-container>
      <h5 class="logo">
        <i class="fa fa-circle text-gray" />
        <span class="lalezar" style="color:black;">بسیج اساتید</span>
        <i class="fa fa-circle text-warning" />
      </h5>
      <Widget class="mx-auto" title="<h4 class='mt-0 lalezar text-center'>وارد شوید</h4>" customHeader>
        <form class="mt" @submit.prevent="login">
          <b-alert class="alert-sm" variant="danger" :show="!!errorMessage">
            {{errorMessage}}
          </b-alert>
          <div class="form-group">
            <input class="form-control no-border" ref="username"
              required type="text" name="username" placeholder="Username" />
          </div>
          <div class="form-group">
            <input class="form-control no-border" ref="password"
            required type="password" name="password" placeholder="Password" />
          </div>
          <div class="clearfix">
            <div class="btn-toolbar float-right">
              <b-button type="reset" size="sm" variant="default">Create an Account</b-button>
              <b-button type="submit" size="sm" variant="inverse">Login</b-button>
            </div>
          </div>
        </form>
      </Widget>
    </b-container>
    <footer class="footer">
      2017 &copy; Sing. Admin Dashboard Template.
    </footer>
  </div>
</template>

<script>
import Widget from '@/components/Widget/Widget';

export default {
  name: 'LoginPage',
  components: { Widget },
  data() {
    return {
      errorMessage: null,
    };
  },
  methods: {
    login() {
      const username = this.$refs.username.value;
      const password = this.$refs.password.value;
      //TODO: jome, inja cookie ro set kon, jwt ya harchiz dg, push kon be pagesh bar asas role
      // if (username.length !== 0 && password.length !== 0) {
      //   window.localStorage.setItem('authenticated', true);
      //   this.$router.push('/app/main/analytics');
      // }
    },
  },
  created() {
    // if (window.localStorage.getItem('authenticated') === 'true') {
    //   this.$router.push('/app/main/analytics');
    // }
  },
};
</script>

<style src="./Login.scss" lang="scss" scoped />
