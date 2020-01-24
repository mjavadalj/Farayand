<template>
  <div id="landing-page">
    <div>
      <!-- <div class="image">
        <img src="../assets/image/rahbar2.jpg" class="img-fluid" alt="Responsive image" />
      </div>-->
      <div id="content2">
        <img src="../assets/image/basij-logo.png" width="200px" class="ribbon" />
      </div>
      <div class="login-box">
        <div class="text-center">
          <h5 class="logo">
            <i style="margin-right:5px;" class="fa fa-circle text-gray" />
            <span class="lalezar" style="color:#F2F2F2;">بسیج اساتید</span>
            <i style="margin-left:5px;" class="fa fa-circle text-warning" />
          </h5>
        </div>
        <b-container>
          <Widget class="mx-auto" title customHeader>
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
        <br />
        <div class="image">
          <img src="../assets/image/1.png" width="300px" class="img-fluid" alt="Responsive image" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
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
} /* eslint-disable */
/* eslint-enable */ import Widget from "@/components/Widget/Widget";
import VueJWT from "vuejs-jwt";
export default {
  data() {
    return {
      slide: 0,
      sliding: null
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
        })
        .catch(loginError => {});
    },
    signup() {
      this.$router.push("/signup");
    },
    onSlideStart(slide) {
      this.sliding = true;
    },
    onSlideEnd(slide) {
      this.sliding = false;
    }
  },
  mounted() {},
  created() {}
};
</script>

<style>
a {
  text-decoration: none;
  color: gray;
}

*,
*:before,
*:after {
  box-sizing: inherit;
  /*   border: 1px solid red; */
}

.fixed-nav-bar {
  position: fixed;
  align-items: flex-end;
  justify-content: flex-end;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100%;
  height: 60px;
  background-color: #fafbff;
  box-shadow: 0px 0px 10px #fafbff;
  display: flex;
  line-height: 60px;
}

nav img {
  height: 50px;
}

nav .brand {
  flex: 1;
  align-self: flex-start;
  height: 50px;
  margin-left: 15px;
}

nav .link {
  flex: 1;
  max-width: max-content;
  margin-right: 40px;
}

.page-container {
  margin-top: 50px;
  margin-bottom: 100px;
  display: flex;
  justify-content: center;
}

.page-container > .post {
  flex: 1;
  max-width: 500px;
}

.post > .link {
  text-align: center;
  font-family: courier;
  font-size: 2.5em;
  font-weight: lighter;
  margin: 50px 0px;
}

a:hover {
  color: black;
}
.login-box {
  position: absolute;
  top: 50px;
  right: 2%;

  /* border: solid #0033ff; */
  border-bottom: 1px solid #f2f2f2;
  border-top: 1px solid #f2f2f2;
  padding-top: 1.5em;
  padding-bottom: 1.5em;
}
#landing-page,
.generate {
  background: url("../assets/image/rahbar2.jpg") no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  background-size: cover;
  -o-background-size: cover;
  width: 100%;
  height: 100vh;
  /* filter: blur(8px);
  -webkit-filter: blur(8px); */
}
#content2 {
  position: relative;
}
#content2 img {
  position: absolute;
  top: 5px;
  left: 5px;
}
</style>
