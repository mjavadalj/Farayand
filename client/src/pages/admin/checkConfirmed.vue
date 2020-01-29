<template>
  <div>
    <b-breadcrumb>
      <b-breadcrumb-item>راهنما</b-breadcrumb-item>
      <b-breadcrumb-item active>لیست بسیج اساتید</b-breadcrumb-item>
    </b-breadcrumb>
    <h6 style="font-family:samim" class="text-center just-text">تنها اساتیدی که کد ملیشان در این لیست باشد قادر به ثبت نام در سایت می باشند</h6>
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
        class="form-control"
        placeholder="جستجو"
        aria-label="Search"
        aria-describedby="basic-addon1"
        v-on:keyup="search"
      />
    </div>
    <div class="table-resposive" style="text-align:center;">
      <table id="dtBasicExample" align="center" class="table">
        <thead>
          <tr>
            <th class>عملیات</th>
            <th class>کد ملی</th>
            <th class>#</th>
          </tr>
        </thead>
        <tbody id="myTable">
          <tr v-for="(confirmedTeacher,index) in confirmedTeachers" :key="confirmedTeacher._id">
            <td>
              <i
                @click="deleteConfirmedTeacher(confirmedTeacher,index)"
                class="fa fa-remove action-icon"
                style="font-size: 1.5em;"
              />
            </td>
            <td>{{confirmedTeacher.nationalcode}}</td>
            <td id="numeric-td">{{index+1}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div>
      <button id="fixedbutton" class="btn btn-primary" type="button" @click="addUni()">
        <i class="fa fa-plus" />
      </button>
    </div>
  </div>
</template>
<script>
import { global } from "@/main.js";
import "imports-loader?$=jquery,this=>window!messenger/build/js/messenger";
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
} /* eslint-disable */
/* eslint-enable */ export default {
  data() {
    return {
      jwt: null,
      headers: null,
      locationClasses: "messenger-fixed messenger-on-bottom messenger-on-right",
      universities: null,
      confirmedTeachers:null
    };
  },
  methods: {
    search(e) {
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
    deleteConfirmedTeacher(confirmedTeacher, index) {
        console.log(confirmedTeacher);
        
      this.$swal
        .fire({
          title: `${confirmedTeacher.nationalcode}`,
          text: "کد ملی استاد از لیست بسیج اساتید حذف خواهد شد و دیگر قادر به ثبت نام در سایت نخواهد بود",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          cancelButtonText: "لغو",
          confirmButtonText: "حذف"
        })
        .then(result => {
          if (result.value) {
            this.axios
              .post(
                `http://localhost:3000/api/confirmed/delete`,
                {
                  id:  confirmedTeacher._id
                },
                this.headers
              )
              .then(res => {
                this.confirmedTeachers.splice(index, 1);
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
    
    async addUni(nationalcode = "") {
      const { value: formValues2 } = await this.$swal.fire({
        html: `
                    <div class="card">
                    <div class="card-header">
                        <strong class="lalezar" > استاد جدید</strong>
                    </div>
                    </br>
                    <div class="form-group">
                    <div class="">
                        <label class="lalezar" for="title"> کد ملی استاد</label>
                            <input
                                value="${nationalcode}"
                                type="text"
                                id="nationalcode"
                                name="nationalcode"
                                placeholder="کد ملی استاد را وارد کنید"
                                class="form-control"
                            />
                    </div>       
                    </div>`,
        focusConfirm: false,
        preConfirm: () => {
          var nationalcode = document.getElementById("nationalcode").value;
          var ok = false;
          if (nationalcode == "") {
            setTimeout(() => {
              this.addUni(nationalcode);
            }, 0);
          } else {
            ok = true;
          }
          return {
            ok,
            nationalcode
          };
        }
      });
      if (formValues2 == undefined || formValues2.ok == false) {
        return;
      }
      this.axios
        .post(
          `http://localhost:3000/api/confirmed/add`,
          {
            nationalcode: formValues2.nationalcode
          },
          this.headers
        )
        .then(res => {
          this.$swal.fire({
            type: "success",
            title: "موفق",
            text: "کد ملی استاد با موفقیت اضافه شد"
          });

          this.confirmedTeachers.push(res.data);
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  mounted() {
    this.axios
      .get(`http://localhost:3000/api/confirmed/showall`, this.headers)
      .then(res => {
        // console.log("res.data");
        // console.log(res.data);
        // this.universities = res.data;
        this.confirmedTeachers=res.data
      })
      .catch(err => {
        console.log(err);
      });
  },
  created() {
    this.headers = {
      headers: {
        Authorization: `Bearer ${this.$cookie.get("jwt")}`
      }
    };
  }
};
</script>

<style>
tr:hover {
  background-color: rgb(236, 238, 245);
  cursor: pointer;
}
</style>
