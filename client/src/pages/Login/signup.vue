<template>
  <div id="landing-page">
    <div id="content2">
      <img src="../../assets/image/basij-logo.png" width="200px" class="ribbon" />
    </div>
    <div class="login-page leftside">
      <b-container>
        <h5 title="تغییر" class="logo">
          <span @click="changeRole">
            <i style="color:white;" class="fa fa-edit refresh"></i>
          </span>
          <span class="lalezar" style="color:#F2F2F2;">به عنوان {{getRole()}} در حال ثبت نام هستید</span>
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
                ref="nationalcode"
                required
                type="text"
                name="nationalcode"
                placeholder="کد ملی"
                oninvalid="this.setCustomValidity('کد ملی خود را وارد کنید')"
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
            <div class="form-group">
              <input
                @click="showModal"
                class="form-control"
                type="button"
                name="uni"
                id="uni"
                value="دانشگاه خود را انتخاب کنید"
              />
            </div>
            <div class="form-group text-center">
              <label class="radio-inline" style="margin-right:10px;">
                <input type="radio" name="optradio" checked id="man-radio" />
                <span class="lalezar" style="color:white;">آقا</span>
              </label>
              <label class="radio-inline">
                <input type="radio" name="optradio" id="woman-radio" />
                <span class="lalezar" style="color:white;">خانم</span>
              </label>
            </div>

            <div class="clearfix">
              <div class="btn-toolbar float-right">
                <b-button @click="landing" type="reset" size="sm" variant="default">
                  <span class="lalezar">قبلا ثبت نام کرده ام</span>
                </b-button>
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
      <!-- <footer class="footer">2017 &copy; Sing. Admin Dashboard Template.</footer> -->
    </div>
    <div id="modaaal">
      <b-modal id="my-modal" ref="my-modal" no-close-on-backdrop scrollable hide-footer title>
        <div v-if="role=='teacher'" class="container text-center">
          <button
            @click="removeTeacherUni(uni)"
            v-for="uni in selectedUniversities"
            :key="uni._id"
            type="button"
            style="margin:2px;font-family:lalezar"
            class="btn btn-outline-secondary"
          >
            <span>{{uni.name}}</span>
          </button>
        </div>
        <template v-if="role=='teacher'" v-slot:modal-header="{ close }">
          <b-button size="sm" variant="outline-info">
            <span @click="setUniForTeacher()" class="lalezar">خاتمه</span>
          </b-button>
        </template>
        <div class="d-block text-center lalezar">
          <h3>دانشگاه خود را انتخاب کنید</h3>
        </div>
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text" id="basic-addon1">
              <i class="fa fa-search" />
            </span>
          </div>
          <input
            style="text-align:center;"
            type="text"
            id="myInput2"
            class="form-control lalezar"
            placeholder="جستجو"
            aria-label="Search"
            aria-describedby="basic-addon1"
            v-on:keyup="search2"
          />
        </div>
        <div
          id="table_data"
          class="table-resposive"
          style="text-align:center;max-height:400px; overflow: auto;margin-bottom:10px;"
        >
          <table id="dtBasicExample" align="center" class="table">
            <thead>
              <tr>
                <th class>شهرستان</th>
                <th class>استان</th>
                <th class>نام</th>
                <th class>#</th>
              </tr>
            </thead>
            <tbody id="myTable2">
              <tr v-for="(uni,index) in universities" :key="uni._id" @click="setUni(uni)">
                <td>{{uni.city}}</td>
                <td>{{uni.state}}</td>
                <td>{{uni.name}}</td>
                <td>{{index+1}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </b-modal>
    </div>
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
      role: "teacher",
      university: null,
      universities: null,
      selectedUniversities: []
    };
  },
  methods: {
    signup() {
      // console.log(this.selectedUniversities);
      // console.log(this.university);
      var uniId = [];
      if (this.role == "teacher") {
        if (this.selectedUniversities.length == 0) {
          return alert("دانشگاه خود را انتخاب کنید");
        }
        this.selectedUniversities.forEach(uni => {
          uniId.push(uni._id);
        });
      } else if (this.role == "student") {
        console.log("!!!!!!!!");
        if (this.university == null) {
          return alert("دانشگاه خود را انتخاب کنید");
        }
        uniId.push(this.university._id);
      } else {
        return;
      }
      const nationalcode = this.$refs.nationalcode.value;
      const password = this.$refs.password.value;
      const name = this.$refs.name.value;
      const phoneNumber = this.$refs.phoneNumber.value;
      const email = this.$refs.email.value;
      const role = this.role;
      var gender;
      const uni = this.role == "student" ? this.university : this.universities;
      if ($("#man-radio").is(":checked")) {
        gender = "man";
      } else if ($("#woman-radio").is(":checked")) {
        gender = "woman";
      }
      var body = {
        nationalcode,
        password,
        name,
        phoneNumber,
        email,
        gender,
        role,
        uniId: uniId
      };
      this.axios
        .post("http://localhost:3000/api/user/signup", body)
        .then(result => {
          if (result.data.code == 1) {
            this.axios
              .post("http://localhost:3000/api/user/signin", {
                nationalcode,
                password
              })
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
                } else {
                  alert(loginResponse.data.message);
                }
              })
              .catch(loginError => {});
          }
          else{
            alert(result.data.message)
          }
        })
        .catch(err => {
          console.log(err.message);
        });
      // if (nationalcode.length !== 0 && password.length !== 0) {
      //   window.localStorage.setItem('authenticated', true);
      //   this.$router.push('/app/main/analytics');
      // }
    },
    setRole(role) {
      this.role = role;
      // console.log(role);
    },
    getRole() {
      if (this.role == "teacher") {
        return "استاد";
      } else {
        return "دانشجو";
      }
    },
    showModal() {
      if (!this.universities) {
        this.axios
          .get(`http://localhost:3000/api/university/showall`)
          .then(res => {
            this.$refs["my-modal"].show();
            this.universities = res.data;
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.$refs["my-modal"].show();
      }
    },
    hideModal() {
      this.$refs["my-modal"].hide();
    },
    toggleModal() {
      // We pass the ID of the button that we want to return focus to
      // when the modal has hidden
      this.$refs["my-modal"].toggle("#toggle-btn");
    },
    setUni(uni) {
      if (this.role == "teacher") {
        find = this.selectedUniversities.find(obj => {
          return obj._id == uni._id;
        });
        if (!find) {
          let index = this.universities.indexOf(uni);
          this.universities.splice(index, 1);
          return this.selectedUniversities.push(uni);
        }

        return;
      }
      this.university = uni;
      this.hideModal();
      $("#uni").val(uni.name);
    },
    setUniForTeacher() {
      this.hideModal();
      if (this.selectedUniversities.length == 0) {
        return (document.getElementById("uni").value =
          "دانشگاه خود را انتخاب کنید");
      }
      document.getElementById("uni").value = "";
      this.selectedUniversities.forEach((uni, index) => {
        if (index == this.selectedUniversities.length - 1) {
          document.getElementById("uni").value += uni.name;
        } else {
          document.getElementById("uni").value += uni.name + " , ";
        }
      });
    },
    search2(e, temp = null) {
      var value = $("#myInput2")
        .val()
        .toLowerCase();
      $("#myTable2 tr").filter(function() {
        $(this).toggle(
          $(this)
            .text()
            .toLowerCase()
            .indexOf(value) > -1
        );
      });
    },
    removeTeacherUni(uni) {
      let index = this.selectedUniversities.indexOf(uni);
      this.selectedUniversities.splice(index, 1);
      this.universities.push(uni);
    },
    landing() {
      this.$router.push("/landing");
    },
    changeRole() {
      this.role = this.role == "teacher" ? "student" : "teacher";
      this.selectedUniversities = [];
      this.university = null;
      this.universities = null;
      document.getElementById("uni").value = "دانشگاه خود را انتخاب کنید";
      console.log(this.role);
    }
  },
  created() {
    // if (window.localStorage.getItem('authenticated') === 'true') {
    //   this.$router.push('/app/main/analytics');
    // }
  }
};
</script>
<style>
@media screen and (min-width: 1400px) {
  .leftside {
    margin-left: 1100px !important;
    /* position: fixed; */
  }
}
</style>
<style src="./Login.scss" lang="scss" scoped />
