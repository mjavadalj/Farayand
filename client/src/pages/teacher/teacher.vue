<template>
  <div id="teachers">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <a @click="push('Layout')" href="" class="iransans-b">مدیریت</a>
        </li>
        <li class="breadcrumb-item active iransans-b" aria-current="page">اطلاعات اساتید</li>
      </ol>
    </nav>
    <div class="input-group mb-3">
      <div class="input-group-prepend">
        <span class="input-group-text" id="basic-addon1">
          <i class="fa fa-search" />
        </span>
      </div>
      <input
        style="text-align:center;"
        type="text"
        id="myInput"
        class="form-control lalezar"
        placeholder="جست و جو"
        aria-label="Search"
        aria-describedby="basic-addon1"
        v-on:keyup="search"
      />
    </div>
    <div
      id="table_data"
      class="table-resposive"
      style="text-align:center;max-height:500px; overflow: auto;margin-bottom:10px;"
    >
      <table id="dtBasicExample" align="center" class="table">
        <thead>
          <tr>
            <th class>عملیات</th>
            <th class>وضعیت استاد</th>
            <th class>ایمیل</th>
            <th class>تاریخ عضویت</th>
            <th class>دانشگاه</th>
            <th class>نام کاربری</th>
            <th class>نام</th>
            <th class>#</th>
          </tr>
        </thead>
        <tbody id="myTable">
          <tr v-for="(teacher,index) in teachers" :key="teacher._id">
            <td>
              <i
                @click="deleteUser(teacher)"
                class="fa fa-remove action-icon"
                style="font-size: 1.5em;"
              />
              <i
                @click="editUser(teacher)"
                class="fa fa-edit action-icon"
                style="font-size: 1.5em;"
              />
              <i
                v-if="teacher.confirmed"
                @click="confirmUser(teacher)"
                class="fa fa-check action-icon"
                style="font-size: 1.5em;"
              />
              <i
                v-else
                @click="confirmUser(teacher)"
                class="fa fa-ban action-icon"
                style="font-size: 1.5em;"
              />
            </td>
            <td>
              <button
                v-if="!teacher.confirmed"
                data-v-17b74d76
                type="button"
                class="btn p-1 px-3 btn-xs btn-danger lalezar"
              >تایید نشده</button>
              <button
                v-if="teacher.confirmed"
                data-v-17b74d76
                type="button"
                class="btn p-1 px-3 btn-xs btn-success lalezar"
              >فعال</button>
            </td>
            <td>{{teacher.email}}</td>
            <td>{{teacher.date}}</td>
            <td>
              <p class="mb-0">
                <small>
                  <!-- <span class="fw-semi-bold">Type:</span> -->
                  <span class="text-muted">&nbsp; نوشیروانی</span>
                </small>
              </p>
              <p>
                <small>
                  <!-- <span class="fw-semi-bold">Dimensions:</span> -->
                  <span class="text-muted">&nbsp; مازندران</span>
                </small>
              </p>
            </td>
            <td>{{teacher.username}}</td>
            <td>{{teacher.name}}</td>
            <td>{{index+1}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <br />
    <br />
    <div>
      <button id="fixedbutton" class="btn btn-primary" type="button" @click="s()">
        <i class="fa fa-plus" />
      </button>
    </div>

    <div></div>
  </div>
</template>
<script>
import { global } from "@/main.js";
import "imports-loader?$=jquery,this=>window!messenger/build/js/messenger";
import { all } from "q";
const { Messenger } = window;
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
}
/* eslint-enable */
//#FAFBFF
export default {
  data() {
    return {
      locationClasses: "messenger-fixed messenger-on-bottom messenger-on-right",
      teachers: null
    };
  },
  methods: {
    async confirmUser(user) {
      var flag = false;
      if (!user.confirmed) {
        flag = true;
      }
      this.axios
        .patch(`http://localhost:3000/api/user/edit`, {
          userId: user._id,
          confirmed: flag
        })
        .then(res => {
          user.confirmed = flag;
          this.$swal.fire({
            type: "success",
            title: "موفق",
            text: "استاد با موفقیت ویرایش شد"
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    deleteUser(user) {
      this.$swal
        .fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!"
        })
        .then(result => {
          if (result.value) {
            this.axios
              .post(`http://localhost:3000/api/user/delete/`, {
                userId: user._id
              })
              .then(res => {
                let userIndex = this.teachers.indexOf(user);
                this.teachers.splice(userIndex, 1);
                this.$swal.fire({
                  type: "success",
                  title: "موفق",
                  text: "استاد با موفقیت حذف شد"
                });
              })
              .catch(err => {
                console.log(err);
              });
          }
        });
    },
    async editUser(user) {
      const { value: formValues } = await this.$swal.fire({
        html: `<div class="col-X-6">
        <div class="card">
          <div class="card-header">
            <strong>ویرایش استاد </strong>
          </div>
          <div class="card-body card-block">
            <form class="form-horizontal needs-validation">
              <div class="row form-group text-center">
                <div class="col-12 col-md-9">
                  <input
                    value="${user.name}"
                    type="text"
                    id="name"
                    name="name"
                    placeholder="نام استاد را وارد کنید"
                    class="form-control"
                  />
                </div>
                <div class="col col-md-3">
                  <label for="name" class="form-control-label">نام استاد</label>
                </div>
              </div>
              <div class="row form-group text-center">
                <div class="col-12 col-md-9">
                  <input
                  value="${user.phoneNumber}"
                    type="number"
                    id="number"
                    name="number"
                    placeholder="شماره همراه را وارد کنید"
                    class="form-control"
                    required
                  />
                </div>
                <div class="col col-md-3">
                  <label for="number" class="form-control-label">شماره همراه</label>
                </div>
              </div>
              <div class="row form-group text-center">
                <div class="col-12 col-md-9">
                  <input
                  value="${user.email}"
                    type="email"
                    id="email"
                    name="email"
                    placeholder="ایمیل استاد را وارد کنید"
                    class="form-control"
                  />
                </div>
                <div class="col col-md-3">
                  <label for="email" class="form-control-label">ایمیل</label>
                </div>
              </div>
              <div class="row form-group text-center">
                <div class="col-12 col-md-9">
                  <input
                  value="${user.username}"
                    type="text"
                    id="username"
                    name="username"
                    placeholder="نام کاربری را وارد کنید"
                    class="form-control"
                    required
                  />
                </div>
                <div class="col col-md-3">
                  <label for="username" class="form-control-label">نام کاربری</label>
                </div>
              </div>
              <div class="row form-group text-center">
                <div class="col-12 col-md-9">
                  <input
                  value="${user.password}"
                    type="password"
                    id="password"
                    name="password"
                    placeholder="رمز"
                    class="form-control"
                  />
                </div>
                <div class="col col-md-3">
                  <label for="password" class="form-control-label">رمز</label>
                </div>
              </div>
              <div class="row form-group text-center">
                <div class="col col-md-9">
                  <div class="form-check-inline form-check">
                    <label for="inline-radio2" class="form-check-label">
                      <input
                        
                        type="radio"
                        id="inline-radio2"
                        name="inline-radios"
                        value="option2"
                        class="form-check-input"
                      />خانم
                    </label>
                    <label for="inline-radio3" class="form-check-label">
                      <input
                      
                        type="radio"
                        id="inline-radio3"
                        name="inline-radios"
                        value="option3"
                        class="form-check-input"
                      />آقا
                    </label>
                  </div>
                </div>
                <div class="col col-md-3">
                  <label class="form-control-label">جنسیت</label>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>`,
        // '<input id="swal-input6" class="swal2-input" placeholder = "جنسیت>',
        focusConfirm: false,
        preConfirm: () => {
          var name = document.getElementById("name").value;
          var username = document.getElementById("username").value;
          var email = document.getElementById("email").value;
          var number = document.getElementById("number").value;
          var password = document.getElementById("password").value;
          var ok = false;
          var gender = "";
          if ($("#inline-radio3").is(":checked")) {
            gender = "man";
          } else if ($("#inline-radio2").is(":checked")) {
            gender = "woman";
          }
          if (
            name == "" ||
            username == "" ||
            email == "" ||
            password == "" ||
            gender == ""
          ) {
            setTimeout(() => {
              this.editUser(user);
            }, 0);
          } else {
            ok = true;
          }
          return {
            ok,
            name,
            username,
            number,
            email,
            gender,
            password
          };
        }
      });
      if (formValues == undefined || formValues.ok == false) {
        return;
      }
      // TODO: university ezafe she
      this.axios
        .patch(`http://localhost:3000/api/user/edit`, {
          userId: user._id,
          username: formValues.username,
          name: formValues.name,
          phoneNumber: formValues.number,
          email: formValues.email,
          gender: formValues.gender,
          password: formValues.password
        })
        .then(res => {
          user = res.data;
          this.$swal.fire({
            type: "success",
            title: "موفق",
            text: "استاد با موفقیت ویرایش شد"
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    show() {
      document.getElementById("password").type = "text";
      // $("#password").prop("type", "text");
    },
    hide() {
      document.getElementById("password").type = "password";
      // $("#password").prop("type", "password");
    },
    addSuccessNotification() {
      Messenger().post({
        extraClasses: this.locationClasses,
        message: "Showing success message was successful!",
        type: "success",
        showCloseButton: true
      });
      return false;
    },
    search(e, temp = null) {
      var value = $("#myInput")
        .val()
        .toLowerCase();
      $("#myTable tr").filter(function() {
        $(this).toggle(
          $(this)
            .text()
            .toLowerCase()
            .indexOf(value) > -1
        );
      });
      console.log(value);
    },
    async s(name = "", username = "", number = "", email = "") {
      const { value: formValues2 } = await this.$swal.fire({
        html: `<div class="col-X-6">
        <div class="card">
          <div class="card-header">
            <strong>استاد جدید</strong>
          </div>
          <div class="card-body card-block">
            <form class="form-horizontal needs-validation">
              <div class="row form-group text-center">
                <div class="col-12 col-md-9">
                  <input
                    value="${name}"
                    type="text"
                    id="name"
                    name="name"
                    placeholder="نام استاد را وارد کنید"
                    class="form-control"
                  />
                </div>
                <div class="col col-md-3">
                  <label for="name" class="form-control-label">نام استاد</label>
                </div>
              </div>
              <div class="row form-group text-center">
                <div class="col-12 col-md-9">
                  <input
                  value="${number}"
                    type="number"
                    id="number"
                    name="number"
                    placeholder="شماره همراه را وارد کنید"
                    class="form-control"
                    required
                  />
                </div>
                <div class="col col-md-3">
                  <label for="number" class="form-control-label">شماره همراه</label>
                </div>
              </div>
              <div class="row form-group text-center">
                <div class="col-12 col-md-9">
                  <input
                  value="${email}"
                    type="email"
                    id="email"
                    name="email"
                    placeholder="ایمیل استاد را وارد کنید"
                    class="form-control"
                  />
                </div>
                <div class="col col-md-3">
                  <label for="email" class="form-control-label">ایمیل</label>
                </div>
              </div>
              <div class="row form-group text-center">
                <div class="col-12 col-md-9">
                  <input
                  value="${username}"
                    type="text"
                    id="username"
                    name="username"
                    placeholder="نام کاربری را وارد کنید"
                    class="form-control"
                    required
                  />
                </div>
                <div class="col col-md-3">
                  <label for="username" class="form-control-label">نام کاربری</label>
                </div>
              </div>
              <div class="row form-group text-center">
                <div class="col-12 col-md-9">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="رمز"
                    class="form-control"
                  />
                </div>
                <div class="col col-md-3">
                  <label for="password" class="form-control-label">رمز</label>
                </div>
              </div>
              <div class="row form-group text-center">
                <div class="col col-md-9">
                  <div class="form-check-inline form-check">
                    <label for="inline-radio2" class="form-check-label">
                      <input
                        
                        type="radio"
                        id="inline-radio2"
                        name="inline-radios"
                        value="option2"
                        class="form-check-input"
                      />خانم
                    </label>
                    <label for="inline-radio3" class="form-check-label">
                      <input
                      
                        type="radio"
                        id="inline-radio3"
                        name="inline-radios"
                        value="option3"
                        class="form-check-input"
                      />آقا
                    </label>
                  </div>
                </div>
                <div class="col col-md-3">
                  <label class="form-control-label">جنسیت</label>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>`,
        // '<input id="swal-input6" class="swal2-input" placeholder = "جنسیت>',
        focusConfirm: false,
        preConfirm: () => {
          var name = document.getElementById("name").value;
          var username = document.getElementById("username").value;
          var email = document.getElementById("email").value;
          var number = document.getElementById("number").value;
          var password = document.getElementById("password").value;
          var ok = false;
          var gender = "";
          if ($("#inline-radio3").is(":checked")) {
            gender = "man";
          } else if ($("#inline-radio2").is(":checked")) {
            gender = "woman";
          }
          if (
            name == "" ||
            username == "" ||
            email == "" ||
            password == "" ||
            gender == ""
          ) {
            setTimeout(() => {
              this.s(name, username, number, email);
            }, 0);
          } else {
            ok = true;
          }
          return {
            ok,
            name,
            username,
            number,
            email,
            gender,
            password
          };
        }
      });
      if (formValues2 == undefined || formValues2.ok == false) {
        return;
      }
      this.axios
        .post(`http://localhost:3000/api/user/add`, {
          username: formValues2.username,
          phoneNumber: formValues2.number,
          email: formValues2.email,
          name: formValues2.name,
          role: "teacher",
          gender: formValues2.gender,
          password: formValues2.password,
          confirmed: true
        })
        .then(res => {
          this.$swal.fire({
            type: "success",
            title: "موفق",
            text: "کاربر با موفقیت ثبت شد"
          });
          this.teachers.unshift(res.data);
        })
        .catch(err => {
          console.log(err);
        });
    },
    push(name){
      this.$router.push({
        name
      })
    }
  },
  mounted() {
    // this.initCharts();

    this.axios
      .get(`http://localhost:3000/api/user/teacher/showall`)
      .then(res => {
        console.log("res.data");
        console.log(res.data);
        this.teachers = res.data;
        // this.addSuccessNotification();
      })
      .catch(err => {
        console.log(err);
      });
  },
  created() {
    // $("body").mouseup(function(e) {
    //     var container = $("#editForm");
    //     // if the target of the click isn't the container nor a descendant of the container
    //     if (!container.is(e.target) && container.has(e.target).length === 0) {
    //       console.log(this.selectedTeacher);
    //     }
    //   });
    // $("#password").password("toggle");
    // this.initializationMessengerCode();
  }
};
</script>

<style>
tr:hover {
  background-color: rgb(236, 238, 245);
  cursor: pointer;
}
input {
  text-align: center;
}
#fixedbutton {
  position: fixed;
  bottom: 10px;
  right: 10px;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  /* display: none; <- Crashes Chrome on hover */
  -webkit-appearance: none;
  margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
}

input[type="number"] {
  -moz-appearance: textfield; /* Firefox */
}
.action-icon {
  margin-right: 5px;
}
</style>
