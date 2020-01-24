<template>
  <div id="teachers">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <a @click="push('Layout')" href>مدیریت</a>
        </li>
        <li class="breadcrumb-item active" aria-current="page">اطلاعات اساتید</li>
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
        placeholder="جستجو"
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
            <!-- <th class>id</th> -->
            <th class>وضعیت استاد</th>
            <th class>ایمیل</th>
            <th class>شماره همراه</th>
            <th class>تاریخ عضویت</th>
            <th class>دانشگاه</th>
            <th class>کد ملی</th>
            <th class>نام</th>
            <th class>#</th>
          </tr>
        </thead>
        <tbody id="myTable">
          <tr v-for="(teacher,index) in teachers" :key="teacher._id">
            <td>
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
            <!-- <td>{{teacher._id}}</td> -->
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
            <td id="numeric-td">{{teacher.email}}</td>
            <td id="numeric-td">{{teacher.phoneNumber}}</td>
            <td id="numeric-td">{{ new Date(teacher.date) | moment("jYYYY/jM/jD | HH:mm ")}}</td>
            <td>
              <div v-for="(uni) in teacher.university" :key="uni._id">
                <p class="mb-0">
                  <small>
                    <!-- <span class="fw-semi-bold">Type:</span> -->
                    <span class="text-muted">&nbsp; {{uni.name}}</span>
                  </small>
                </p>
              </div>
            </td>
            <td id="numeric-td">{{teacher.nationalcode}}</td>
            <td>{{teacher.name}}</td>
            <td id="numeric-td">{{index+1}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <br />
    <br />
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
} /* eslint-disable */ //#FAFBFF //TODO: filter uni select same
/* eslint-enable */ export default {
  data() {
    return {
      jwt: null,
      headers: null,
      locationClasses: "messenger-fixed messenger-on-bottom messenger-on-right",
      teachers: null,
      universities: null,
      selectedTeacher: null
    };
  },
  methods: {
    async confirmUser(user) {
      // var flag = false;
      // if (!user.confirmed) {
      //   flag = true;
      // }
      // this.axios
      //   .patch(`http://localhost:3000/api/user/edit`, {
      //     userId: user._id,
      //     confirmed: flag
      //   },this.headres)
      //   .then(res => {
      //     user.confirmed = flag;
      //     this.$swal.fire({
      //       type: "success",
      //       title: "موفق",
      //       text: "استاد با موفقیت ویرایش شد"
      //     });
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });
      this.axios
        .post(`http://localhost:3000/api/user/delete`, {
          userId: user._id,
          // confirmed: flag
        },this.headres)
        .then(res => {
          // user.confirmed = flag;
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
    },
    push(name) {
      this.$router.push({
        name
      });
    },
  },
  mounted() {
    // this.initCharts();
  },
  created() {
    this.headers = {
      headers: {
        Authorization: `Bearer ${this.$cookie.get("jwt")}`
      }
    };
    // $("body").mouseup(function(e) {
    //     var container = $("#editForm");
    //     // if the target of the click isn't the container nor a descendant of the container
    //     if (!container.is(e.target) && container.has(e.target).length === 0) {
    //       console.log(this.selectedTeacher);
    //     }
    //   });
    // $("#password").password("toggle");
    // this.initializationMessengerCode();
    this.axios
      .get(`http://localhost:3000/api/user/teacher/showall`, {
        headers: {
          Authorization: `Bearer ${this.$cookie.get("jwt")}`
        }
      })
      .then(res => {
        console.log("res.data");
        this.teachers = res.data;
        console.log(this.teachers);
        // this.addSuccessNotification();
      })
      .catch(err => {
        console.log(err);
      });
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
.modal-backdrop {
  opacity: 0.5 !important;
}
</style>
