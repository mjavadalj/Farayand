<template>
  <div id="teachers">
    <b-breadcrumb>
      <b-breadcrumb-item>سلام</b-breadcrumb-item>
      <b-breadcrumb-item active>اساتید</b-breadcrumb-item>
    </b-breadcrumb>
    <div v-if="!addTeacherFlag" class="input-group mb-3">
      <div class="input-group-prepend">
        <span class="input-group-text" id="basic-addon1">
          <i class="fa fa-search" />
        </span>
      </div>
      <input
        style="text-align:center;"
        type="text"
        id="myInput"
        class="form-control"
        placeholder="Serach"
        aria-label="Search"
        aria-describedby="basic-addon1"
        v-on:keyup="search"
      />
    </div>
    <div
      v-if="!addTeacherFlag"
      id="table_data"
      class="table-resposive"
      style="text-align:center;max-height:500px; overflow: auto;margin-bottom:10px;"
    >
      <table id="dtBasicExample" align="center" class="table">
        <thead>
          <tr>
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
          <tr
            v-for="(teacher,index) in teachers"
            :key="teacher._id"
            @click="push($event,teacher,index)"
          >
            <td>{{teacher.confirmed}}</td>
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
    <div v-else id="teacherReg" class>
      <div class="col-X-6">
        <div class="card">
          <div class="card-header">
            <strong>Basic Form</strong> Elements
          </div>
          <div class="card-body card-block">
            <form class="form-horizontal needs-validation">
              <div class="row form-group text-center">
                <div class="col-12 col-md-9">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="نام استاد را وارد کنید"
                    class="form-control"
                    required
                  />
                </div>
                <div class="col col-md-3">
                  <label for="name" class="form-control-label">نام استاد</label>
                </div>
              </div>
              <div class="row form-group text-center">
                <div class="col-12 col-md-9">
                  <input
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
            <div class="card-footer">
              <button @click="saveTeacher()" type="submit" class="btn btn-primary btn-sm">
                <i class="fa fa-dot-circle-o"></i> ثبت استاد
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <br />
    <br />
    <div v-if="selectedTeacher!=null" id="editForm" class="text-center">
      <h3>
        در حال ویرایش اطلاعات استاد
        <span>{{selectedTeacher.name}}</span>
      </h3>
      <form id class="needs-validation">
        <div class="form-row" style="text-align:center;">
          <div class="col-md-4 mb-3">
            <label for="name">نام</label>
            <input
              style="text-align:center;"
              type="text"
              class="form-control"
              id="name"
              placeholder=" نام جدید را وارد کنید"
              v-bind:value="formData(selectedTeacher,'name')"
              required
            />
            <div class="invalid-feedback">نام استاد را وارد کنید</div>
            <div class="valid-feedback">Looks good!</div>
          </div>
          <div class="col-md-4 mb-3">
            <label for="password">رمز</label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text" id="ipassword">
                  <i
                    @mousedown="show"
                    @mouseleave="hide"
                    @mouseup="hide"
                    id="toggle"
                    class="fa fa-unlock"
                  />
                </span>
              </div>
              <input
                type="password"
                class="form-control"
                id="password"
                placeholder="رمز جدید را وارد کنید"
                aria-describedby="password"
                v-bind:value="formData(selectedTeacher,'password')"
                required
              />
            </div>
            <div class="invalid-feedback">رمز را وارد کنید</div>
          </div>
          <div class="col-md-4 mb-3">
            <label for="username">نام کاربری</label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text" id="inputGroupPrepend">@</span>
              </div>
              <input
                type="text"
                class="form-control"
                id="username"
                placeholder="نام کاربری"
                aria-describedby="username"
                v-bind:value="formData(selectedTeacher,'username')"
                required
              />
              <div class="invalid-feedback">نام کاربری را وارد کنید</div>
            </div>
          </div>
        </div>
        <div class="form-row text-center">
          <div class="col-md-6 mb-3">
            <label for="email">ایمیل</label>
            <input
              v-bind:value="formData(selectedTeacher,'email')"
              type="email"
              class="form-control"
              id="email"
              placeholder="ایمیل"
              required
            />
          </div>
          <div class="col-md-3 mb-3">
            <label for="number">شماره همراه</label>
            <input
              type="number"
              class="form-control"
              id="number"
              placeholder="شماره همراه"
              v-bind:value="formData(selectedTeacher,'phoneNumber')"
              required
            />
            <div class="invalid-feedback">Please provide a valid state.</div>
          </div>
        </div>
      </form>
      <div class="container">
        <button
          v-if="!selectedTeacher.confirmed"
          style="margin-right:20px;"
          class="btn btn-success"
          @click="confirm(true)"
        >تایید استاد</button>
        <button
          v-else
          style="margin-right:20px;"
          class="btn btn-danger"
          @click="confirm(false)"
        >غیر فعال کردن استاد</button>
        <button class="btn btn-primary" @click="edit">ویرایش اطلاعات</button>
        <button class="btn btn-primary" @click="cancel">بازگشت</button>
        <button class="btn btn-primary" @click="deleteUser">حذف</button>
      </div>
    </div>
    <div v-else>
      <button id="fixedbutton" class="btn btn-primary" type="button" @click="addTeacher()">
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
      addTeacherFlag: false,
      rowIndex: null,
      color: "#ECEEF5",
      test: "d",
      selectedTeacher: null,
      locationClasses: "messenger-fixed messenger-on-bottom messenger-on-right",
      teachers: null
    };
  },
  methods: {
    deleteUser() {
      this.axios
        .post(`http://localhost:3000/api/user/delete`, {
          userId: this.selectedTeacher._id
        })
        .then(res => {
          console.log(res);
          var table = document.getElementById("myTable");
          table.childNodes[this.rowIndex].remove();
          this.selectedTeacher = null;
          this.rowIndex = null;
          this.changeMaxHeight(500);
        })
        .catch(err => {
          console.log(err);
        });
    },
    cancel() {
      this.selectedTeacher = null;
      this.changeMaxHeight(500);
    },
    edit() {
      var body = {};
      const t = this.selectedTeacher;
      var name = $("#name").val();
      var email = $("#email").val();
      var username = $("#username").val();
      var password = $("#password").val();
      var phoneNumber = $("#number").val();
      if (name != t.name && name != "") {
        body.name = name;
      }
      if (email != t.email && email != "") {
        body.email = email;
      }
      if (username != t.username && username != "") {
        body.username = username;
      }
      if (password != t.password && password != "") {
        body.password = password;
      }
      if (phoneNumber != t.phoneNumber && phoneNumber != "") {
        body.phoneNumber = phoneNumber;
      }
      if (!jQuery.isEmptyObject(body)) {
        body.userId = t._id;
        this.axios
          .patch(`http://localhost:3000/api/user/edit`, body)
          .then(res => {
            this.selectedTeacher = null;
            this.changeMaxHeight(500);
            var index = this.teachers.findIndex(obj => obj._id == t._id);
            if (body.name) {
              this.teachers[index].name = body.name;
            }
            if (body.password) {
              this.teachers[index].password = body.password;
            }
            if (body.username) {
              this.teachers[index].username = body.username;
            }
            if (body.email) {
              this.teachers[index].email = body.email;
            }
            if (body.phoneNumber) {
              this.teachers[index].phoneNumber = body.phoneNumber;
            }
            // console.log(this.teachers[index].name);
            // this.teachers[index].name='name'
            // for (const key in body) {
            //   if(key!='userId'){
            //     this.teachers[index].key=body.key
            //   }

            // }
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        alert("no change");
        this.selectedTeacher = null;
        this.changeMaxHeight(500);
      }
    },
    confirm(flag) {
      const t = this.selectedTeacher;
      this.axios
        .patch(`http://localhost:3000/api/user/edit`, {
          userId: t._id,
          confirmed: flag
        })
        .then(res => {
          console.log(res);
          this.selectedTeacher = null;
          this.changeMaxHeight(500);
          var index = this.teachers.findIndex(obj => obj._id == t._id);
          this.teachers[index].confirmed = flag;
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
    log() {
      var name = $("#name").val();

      console.log(x);
    },
    formData(teacher, index) {
      return teacher[index];
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
    push(e, teacher, index) {
      this.rowIndex = index;
      this.selectedTeacher = teacher;
      this.changeMaxHeight(200);
      // global.courseId = course._id;
      // this.$router.push({
      //   name: "lesson",
      //   params: {
      //     title: course.title
      //   }
      // });
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
    changeMaxHeight(height) {
      document.getElementById("table_data").style.maxHeight = `${height}px`;
    },
    addTeacher() {
      var x = document.getElementById("fixedbutton").childNodes[0];
      if (!this.addTeacherFlag) {
        x.className = "fa fa-minus";
        this.addTeacherFlag = true;
      } else {
        x.className = "fa fa-plus";
        this.addTeacherFlag = false;
      }

      // var content = this.createForm();
      // this.$swal({
      //   title: "Edit",
      //   button: {
      //     text: "Change",
      //     closeModal: true
      //   },
      //   content
      // }).then(flag => {
      //   console.log();
      // });
    },
    saveTeacher() {
      var name = $("#name").val();
      var username = $("#username").val();
      var password = $("#password").val();
      var email = $("#email").val();
      var phoneNumber = $("#number").val();
      var body = {};
      var gender = "";
      if ($("#inline-radio3").is(":checked")) {
        gender = "man";
      } else if ($("#inline-radio2").is(":checked")) {
        gender = "woman";
      }

      if (
        name == "" ||
        username == "" ||
        password == "" ||
        email == "" ||
        gender == ""
      ) {
        alert("ورودی ها را کنترل کنید");
        return;
      }
      body.name = name;
      body.username = username;
      body.password = password;
      body.email = email;
      body.phoneNumber = phoneNumber;
      body.gender = gender;
      body.role = "teacher";
      body.confirmed = true;
      this.axios
        .post(`http://localhost:3000/api/user/add`,body)
        .then(res => {
          console.log("res.data");
          console.log(res.data);
          this.addTeacherFlag=false
          this.teachers.unshift(res.data)
        })
        .catch(err => {
          console.log(err);
        });
    },
    createForm() {
      let content = document.createElement("div");
      let fullname = document.createElement("input");
      this.swalFormProps(fullname, "fullname ...");
      let username = document.createElement("input");
      this.swalFormProps(username, "username");
      content.appendChild(fullname);
      content.appendChild(username);
      content.appendChild(username);
      content.appendChild(username);
      content.appendChild(username);
      content.appendChild(username);
      return content;
    },
    swalFormProps(element, placeholder) {
      element.className = "form-control";
      element.placeholder = placeholder;
      element.style.marginBottom = "25px";
      element.required = true;
      element.maxLength = 25;
      element.onclick = function() {
        this.select();
      };
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
</style>
