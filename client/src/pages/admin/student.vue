<template>
  <div id="users">
    <b-breadcrumb>
      <b-breadcrumb-item>راهنما</b-breadcrumb-item>
      <b-breadcrumb-item active>دانشجویان</b-breadcrumb-item>
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
    <div
      id="table_data"
      class="table-resposive"
      style="text-align:center;max-height:500px; overflow: auto;margin-bottom:10px;"
    >
      <table id="dtBasicExample" align="center" class="table">
        <thead>
          <tr>
            <th class>عملیات</th>
            <th class>وضعیت دانشجو</th>
            <th class>ایمیل</th>
            <th class>تاریخ عضویت</th>
            <th class>
              <div data-v-71d02ef0>
                <span data-v-71d02ef0 class="badge badge-info">پس از ثبت دانشجو، دانشگاه را اضافه کنید</span>
              </div>دانشگاه
            </th>
            <th class>کد ملی</th>
            <th class>نام</th>
            <th class>#</th>
          </tr>
        </thead>
        <tbody id="myTable">
          <tr v-for="(user,index) in users" :key="user._id">
            <td>
              <i
                @click="showModal(user)"
                class="fa fa-university action-icon"
                style="font-size: 1.3em;"
              />
              <i
                @click="deleteUser(user)"
                class="fa fa-remove action-icon"
                style="font-size: 1.5em;"
              />
              <i @click="editUser(user)" class="fa fa-edit action-icon" style="font-size: 1.5em;" />
              <i
                v-if="user.confirmed"
                @click="confirmUser(user)"
                class="fa fa-check action-icon"
                style="font-size: 1.5em;"
              />
              <i
                v-else
                @click="confirmUser(user)"
                class="fa fa-ban action-icon"
                style="font-size: 1.5em;"
              />
            </td>
            <td>
              <button
                v-if="!user.confirmed"
                data-v-17b74d76
                type="button"
                class="btn p-1 px-3 btn-xs btn-danger lalezar"
              >تایید نشده</button>
              <button
                v-if="user.confirmed"
                data-v-17b74d76
                type="button"
                class="btn p-1 px-3 btn-xs btn-success lalezar"
              >فعال</button>
            </td>
            <td>{{user.email}}</td>
            <td id="numeric-td">{{ new Date(user.date) | moment("jYYYY/jM/jD | HH:mm ")}}</td>
            <td>{{retUni(user.university)}}</td>
            <td>{{user.nationalcode}}</td>
            <td>{{user.name}}</td>
            <td id="numeric-td">{{index+1}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <br />
    <br />
    <button id="fixedbutton" class="btn btn-primary" type="button" @click="s()">
      <i class="fa fa-plus" />
    </button>
    <div id="modaaal">
      <b-modal id="my-modal" ref="my-modal" scrollable hide-footer title>
        <div class="d-block text-center lalezar">
          <h3>دانشگاه جدید به استاد اضافه کنید</h3>
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
          style="text-align:center;max-height:500px; overflow: auto;margin-bottom:10px;"
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
              <tr v-for="(uni,index) in universities" :key="uni._id" @click="addUserUni(uni,index)">
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
import { global } from "@/main.js";
import "imports-loader?$=jquery,this=>window!messenger/build/js/messenger";
import { all } from "q";
const { Messenger } = window;
/* eslint-disable */

/* eslint-enable */
export default {
  data() {
    return {
      users: [],
      selectedUser: null,
      universities: null
    };
  },

  mounted() {
    this.axios
      .get(`http://localhost:3000/api/user/student/showall`)
      .then(res => {
        console.log(res.data);

        this.users = res.data;
        // this.addSuccessNotification();
      })
      .catch(err => {
        console.log(err);
      });
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
            text: "کاربر با موفقیت ویرایش شد"
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
                let userIndex = this.users.indexOf(user);
                this.users.splice(userIndex, 1);
                this.$swal.fire({
                  type: "success",
                  title: "موفق",
                  text: "کاربر با موفقیت حذف شد"
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
            <strong>ویرایش دانشجو </strong>
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
                    placeholder="نام دانشجو را وارد کنید"
                    class="form-control"
                  />
                </div>
                <div class="col col-md-3">
                  <label for="name" class="form-control-label">نام دانشجو</label>
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
                    placeholder="ایمیل دانشجو را وارد کنید"
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
                  value="${user.nationalcode}"
                    type="text"
                    id="nationalcode"
                    name="nationalcode"
                    placeholder="کد ملی را وارد کنید"
                    class="form-control"
                    required
                  />
                </div>
                <div class="col col-md-3">
                  <label for="nationalcode" class="form-control-label">کد ملی</label>
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
          var nationalcode = document.getElementById("nationalcode").value;
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
            nationalcode == "" ||
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
            nationalcode,
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
          nationalcode: formValues.nationalcode,
          name: formValues.name,
          phoneNumber: formValues.number,
          email: formValues.email,
          gender: formValues.gender,
          password: formValues.password
        })
        .then(res => {
          Object.keys(formValues).forEach(item => {
            if (user[item]) {
              user[item] = formValues[item];
            }
          });
          this.$swal.fire({
            type: "success",
            title: "موفق",
            text: "کاربر با موفقیت ویرایش شد"
          });
        })
        .catch(err => {
          console.log(err);
        });
    },

    //TODO: university ezafe she

    async s(name = "", nationalcode = "", number = "", email = "") {
      const { value: formValues2 } = await this.$swal.fire({
        html: `<div class="col-X-6">
        <div class="card">
          <div class="card-header">
            <strong>دانشجوی جدید</strong>
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
                    placeholder="نام دانشجو را وارد کنید"
                    class="form-control"
                  />
                </div>
                <div class="col col-md-3">
                  <label for="name" class="form-control-label">نام دانشجو</label>
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
                    placeholder="ایمیل دانشجو را وارد کنید"
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
                  value="${nationalcode}"
                    type="text"
                    id="nationalcode"
                    name="nationalcode"
                    placeholder="کد ملی را وارد کنید"
                    class="form-control"
                    required
                  />
                </div>
                <div class="col col-md-3">
                  <label for="nationalcode" class="form-control-label">کد ملی</label>
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
          var nationalcode = document.getElementById("nationalcode").value;
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
            nationalcode == "" ||
            email == "" ||
            password == "" ||
            gender == ""
          ) {
            setTimeout(() => {
              this.s(name, nationalcode, number, email);
            }, 0);
          } else {
            ok = true;
          }
          return {
            ok,
            name,
            nationalcode,
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
          nationalcode: formValues2.nationalcode,
          phoneNumber: formValues2.number,
          email: formValues2.email,
          name: formValues2.name,
          role: "student",
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
          this.users.push(res.data);
          console.log(res.data);
        })
        .catch(err => {
          console.log(err);
        });
    },

    formData(teacher, index) {
      return teacher[index];
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
    showModal(user) {
      this.axios
        .get(`http://localhost:3000/api/university/showall`)
        .then(res => {
          this.$refs["my-modal"].show();
          this.selectedUser = user;
          this.universities = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    hideModal() {
      this.$refs["my-modal"].hide();
    },
    toggleModal() {
      // We pass the ID of the button that we want to return focus to
      // when the modal has hidden
      this.$refs["my-modal"].toggle("#toggle-btn");
    },
    addUserUni(uni, index) {
      this.axios
        .patch(`http://localhost:3000/api/user/user/adduni`, {
          userId: this.selectedUser._id,
          uniId: uni._id
        })
        .then(res => {
          console.log(res.data);
          this.selectedUser.university = [];
          this.selectedUser.university.push(uni);
          this.hideModal();
        })
        .catch(err => {
          console.log(err);
        });
    },
    retUni(uni) {
      if (uni.length == 0) {
        return "";
      }
      return uni[0].name;
    }
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
