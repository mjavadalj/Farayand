<template>
  <div>
    <b-breadcrumb>
      <b-breadcrumb-item>راهنما</b-breadcrumb-item>
      <b-breadcrumb-item active>دانشگاه ها</b-breadcrumb-item>
    </b-breadcrumb>
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
            <th class>شهر</th>
            <th class>استان</th>
            <th class>نام</th>
            <th class>#</th>
          </tr>
        </thead>
        <tbody id="myTable">
          <tr v-for="(uni,index) in universities" :key="uni._id">
            <td>
              <i
                @click="deleteUni(uni,index)"
                class="fa fa-remove action-icon"
                style="font-size: 1.5em;"
              />
              <i
                @click="editUni(uni,index)"
                class="fa fa-edit action-icon"
                style="font-size: 1.5em;"
              />
            </td>
            <td>{{uni.city}}</td>
            <td>{{uni.state}}</td>
            <td>{{uni.name}}</td>
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
      universities: null
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
    deleteUni(uni, index) {
      this.$swal
        .fire({
          title: `${uni.name}`,
          text: "دانشگاه حذف می شود",
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
                `http://localhost:3000/api/university/delete`,
                {
                  id: uni._id
                },
                this.headers
              )
              .then(res => {
                this.universities.splice(index, 1);
                this.$swal.fire({
                  type: "success",
                  title: "موفق",
                  text: "دانشگاه با موفقیت حذف شد"
                });
              })
              .catch(err => {
                console.log(err);
              });
          }
        });
    },
    async editUni(uni, index) {
      const { value: formValues2 } = await this.$swal.fire({
        html: `
                    <div class="card">
                    <div class="card-header">
                        <strong class="lalezar" > ویرایش دانشگاه</strong>
                    </div>
                    </br>
                    <div class="form-group">
                    <div class="">
                        <label class="lalezar" for="title"> نام دانشگاه</label>
                            <input
                                value="${uni.name}"
                                type="text"
                                id="name"
                                name="name"
                                placeholder="نام دانشگاه را وارد کنید"
                                class="form-control"
                            />
                    </div>
                    </br>
                    <div class="">
                        <label class="lalezar"  for="title">استان</label>
                            <input
                                value="${uni.state}"
                                type="text"
                                id="state"
                                name="state"
                                placeholder="استان را مشخص کنید"
                                class="form-control"
                            />
                    </div>
                    </br>
                    <div class="">
                        <label class="lalezar"  for="title">شهرستان</label>
                            <input
                                value="${uni.city}"
                                type="text"
                                id="city"
                                name="city"
                                placeholder="شهرستان را مشخص کنید"
                                class="form-control"
                            />
                    </div>        
                    </div>`,
        focusConfirm: false,
        preConfirm: () => {
          var name = document.getElementById("name").value;
          var state = document.getElementById("state").value;
          var city = document.getElementById("city").value;
          var ok = false;
          if (name == "" || state == "" || city == "") {
            setTimeout(() => {
              this.editUni(uni, index);
            }, 0);
          } else {
            ok = true;
          }
          return {
            ok,
            name,
            state,
            city
          };
        }
      });
      if (formValues2 == undefined || formValues2.ok == false) {
        return;
      }
      this.axios
        .patch(
          `http://localhost:3000/api/university/edit`,
          {
            id: uni._id,
            name: formValues2.name,
            state: formValues2.state,
            city: formValues2.city
          },
          this.headers
        )
        .then(res => {
          this.$swal.fire({
            type: "success",
            title: "موفق",
            text: "دانشگاه با موفقیت ویرایش شد"
          });
          Object.keys(formValues2).forEach(item => {
            if (uni[item]) {
              uni[item] = formValues2[item];
            }
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    async addUni(name = "", state = "", city = "") {
      const { value: formValues2 } = await this.$swal.fire({
        html: `
                    <div class="card">
                    <div class="card-header">
                        <strong class="lalezar" > دانشگاه جدید</strong>
                    </div>
                    </br>
                    <div class="form-group">
                    <div class="">
                        <label class="lalezar" for="title"> نام دانشگاه</label>
                            <input
                                value="${name}"
                                type="text"
                                id="name"
                                name="name"
                                placeholder="نام دانشگاه را وارد کنید"
                                class="form-control"
                            />
                    </div>
                    </br>
                    <div class="">
                        <label class="lalezar"  for="title">استان</label>
                            <input
                                value="${state}"
                                type="text"
                                id="state"
                                name="state"
                                placeholder="استان را مشخص کنید"
                                class="form-control"
                            />
                    </div>
                    </br>
                    <div class="">
                        <label class="lalezar"  for="title">شهرستان</label>
                            <input
                                value="${city}"
                                type="text"
                                id="city"
                                name="city"
                                placeholder="شهرستان را مشخص کنید"
                                class="form-control"
                            />
                    </div>        
                    </div>`,
        focusConfirm: false,
        preConfirm: () => {
          var name = document.getElementById("name").value;
          var state = document.getElementById("state").value;
          var city = document.getElementById("city").value;
          var ok = false;
          if (name == "" || state == "" || city == "") {
            setTimeout(() => {
              this.addUni(name, state, city);
            }, 0);
          } else {
            ok = true;
          }
          return {
            ok,
            name,
            state,
            city
          };
        }
      });
      if (formValues2 == undefined || formValues2.ok == false) {
        return;
      }
      this.axios
        .post(
          `http://localhost:3000/api/university/add`,
          {
            name: formValues2.name,
            state: formValues2.state,
            city: formValues2.city
          },
          this.headers
        )
        .then(res => {
          this.$swal.fire({
            type: "success",
            title: "موفق",
            text: "دانشگاه با موفقیت اضافه شد"
          });
          console.log(res.data);

          this.universities.push(res.data);
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  mounted() {
    this.axios
      .get(`http://localhost:3000/api/university/showall`, this.headers)
      .then(res => {
        console.log("res.data");
        console.log(res.data);
        this.universities = res.data;
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
