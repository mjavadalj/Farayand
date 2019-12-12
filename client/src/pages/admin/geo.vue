<template>
  <div id="users">
    <b-breadcrumb>
      <b-breadcrumb-item>راهنما</b-breadcrumb-item>
      <b-breadcrumb-item active>مدیریت استان ها و شهر ها</b-breadcrumb-item>
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
            <th class>نام استان</th>
            <th class>#</th>
          </tr>
        </thead>
        <tbody id="myTable">
          <tr v-for="(province,index) in provinces" :key="province._id">
            <td>
              <i
                @click="addCity('',province)"
                class="fa fa-plus action-icon"
                style="font-size: 1.3em;"
              />
              <i
                @click="showModal(province)"
                class="fa fa-building action-icon"
                style="font-size: 1.3em;"
              />
              <i
                @click="deleteProvince(province)"
                class="fa fa-remove action-icon"
                style="font-size: 1.5em;"
              />
              <i
                @click="editProvince(province)"
                class="fa fa-edit action-icon"
                style="font-size: 1.5em;"
              />
            </td>
            <td>{{province.name}}</td>
            <td id="numeric-td">{{index+1}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <br />
    <br />
    <button id="fixedbutton" class="btn btn-primary" type="button" @click="addProvince()">
      <i class="fa fa-plus" />
    </button>
    <div id="modaaal">
      <b-modal id="my-modal" ref="my-modal" scrollable hide-footer title>
        <template v-slot:modal-header="{ close }">
          <b-button size="sm" variant="outline-danger" @click="addCity('',selectedProvince)">+</b-button>
        </template>
        <div class="d-block text-center lalezar">
          <span>
            <h3>لیست شهر ها</h3>
          </span>
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
                <th class>عملیات</th>
                <th class>نام</th>
                <th class>#</th>
              </tr>
            </thead>
            <tbody id="myTable2">
              <tr v-for="(city,index) in cities" :key="city._id">
                <td>
                  <i
                    @click="deleteCity(city)"
                    class="fa fa-remove action-icon"
                    style="font-size: 1.5em;"
                  />
                  <i
                    @click="editCity(city)"
                    class="fa fa-edit action-icon"
                    style="font-size: 1.5em;"
                  />
                </td>
                <td>{{city.name}}</td>
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

/* eslint-enable *//* eslint-disable */
export default {
  data() {
    return {
      users: [],
      selectedUser: null,
      provinces: null,
      cities: null,
      selectedProvince: null
    };
  },

  mounted() {
    this.axios
      .get(`http://localhost:3000/api/geo/province/showall`)
      .then(res => {
        console.log(res.data);

        this.provinces = res.data;
      })
      .catch(err => {
        console.log(err);
      });
  },

  methods: {
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
    showModal(province) {
      this.axios
        .post(`http://localhost:3000/api/geo/city/showall`, {
          provinceId: province._id
        })
        .then(res => {
          this.$refs["my-modal"].show();
          this.selectedProvince = province;
          this.cities = res.data;
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
    },
    async addProvince(name = "") {
      const { value: formValues2 } = await this.$swal.fire({
        html: `
        <div class="col-X-6">
          <div class="card">
          <div class="card-header">
            <strong>استان جدید</strong>
          </div>
          </br>
          <div class="form-group">
          <div class="">
            <label for="title">نام استان</label>
                  <input
                    value="${name}"
                    type="text"
                    id="name"
                    name="name"
                    placeholder="نام استان را وارد کنید"
                    class="form-control"
                  />
          </div>  
          </div>   
          </div>`,
        focusConfirm: false,
        preConfirm: () => {
          var name = document.getElementById("name").value;
          var ok = false;
          if (name == "") {
            setTimeout(() => {
              this.addProvince(name);
            }, 0);
          } else {
            ok = true;
          }
          return {
            ok,
            name
          };
        }
      });
      if (formValues2 == undefined || formValues2.ok == false) {
        return;
      }
      console.log(formValues2);

      this.axios
        .post(`http://localhost:3000/api/geo/province/add`, {
          name: formValues2.name
        })
        .then(res => {
          this.$swal.fire({
            type: "success",
            title: "موفق",
            text: "استان با موفقیت ثبت شد"
          });
          console.log(res.data);

          this.provinces.unshift(res.data);
        })
        .catch(err => {
          console.log(err);
        });
    },
    deleteProvince(province) {
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
              .patch(`http://localhost:3000/api/geo/province/delete`, {
                provinceId: province._id
              })
              .then(res => {
                let provinceIndex = this.provinces.indexOf(province);
                this.provinces.splice(provinceIndex, 1);
                this.$swal.fire({
                  type: "success",
                  title: "موفق",
                  text: "استان با موفقیت حذف شد"
                });
              })
              .catch(err => {
                console.log(err);
              });
          }
        });
    },
    async editProvince(province) {
      const { value: formValues2 } = await this.$swal.fire({
        html: `
        <div class="col-X-6">
          <div class="card">
          <div class="card-header">
            <strong> ویرایش استان</strong>
          </div>
          </br>
          <div class="form-group">
          <div class="">
            <label for="title">نام استان</label>
                  <input
                    value="${province.name}"
                    type="text"
                    id="name"
                    name="name"
                    placeholder="نام استان را وارد کنید"
                    class="form-control"
                  />
          </div>  
          </div>   
          </div>`,
        focusConfirm: false,
        preConfirm: () => {
          var name = document.getElementById("name").value;
          var ok = false;
          if (name == "") {
            setTimeout(() => {
              this.editProvince(province);
            }, 0);
          } else {
            ok = true;
          }
          return {
            ok,
            name
          };
        }
      });
      if (formValues2 == undefined || formValues2.ok == false) {
        return;
      }
      console.log(formValues2);

      this.axios
        .patch(`http://localhost:3000/api/geo/province/edit`, {
          name: formValues2.name,
          provinceId: province._id
        })
        .then(res => {
          this.$swal.fire({
            type: "success",
            title: "موفق",
            text: "استان با موفقیت ویرایش شد"
          });
          province.name = formValues2.name;
        })
        .catch(err => {
          console.log(err);
        });
    },
    async addCity(name = "", province) {
      this.hideModal()
      const { value: formValues2 } = await this.$swal.fire({
        html: `
        <div class="col-X-6">
          <div class="card">
          <div class="card-header">
            <strong>شهر جدید</strong>
          </div>
          </br>
          <div class="form-group">
          <div class="">
            <label for="title">نام شهر</label>
                  <input
                    value="${name}"
                    type="text"
                    id="name"
                    name="name"
                    placeholder="نام شهر را وارد کنید"
                    class="form-control"
                  />
          </div>  
          </div>   
          </div>`,
        focusConfirm: false,
        preConfirm: () => {
          var name = document.getElementById("name").value;
          var ok = false;
          if (name == "") {
            setTimeout(() => {
              this.addProvince(name, province);
            }, 0);
          } else {
            ok = true;
          }
          return {
            ok,
            name
          };
        }
      });
      if (formValues2 == undefined || formValues2.ok == false) {
        return;
      }
      this.axios
        .post(`http://localhost:3000/api/geo/city/add`, {
          name: formValues2.name,
          provinceId: province._id
        })
        .then(res => {
          this.$swal.fire({
            type: "success",
            title: "موفق",
            text: "شهر با موفقیت ثبت شد"
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    deleteCity(city) {
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
              .patch(`http://localhost:3000/api/geo/city/delete`, {
                cityId: city._id
              })
              .then(res => {
                let index = this.cities.indexOf(city);
                this.cities.splice(index, 1);
                this.$swal.fire({
                  type: "success",
                  title: "موفق",
                  text: "شهر با موفقیت حذف شد"
                });
              })
              .catch(err => {
                console.log(err);
              });
          }
        });
    },
    async editCity(city) {
      this.hideModal();
      const { value: formValues2 } = await this.$swal.fire({
        html: `
        <div style="z-index:10;" class="col-X-6">
          <div class="card">
          <div class="card-header">
            <strong> ویرایش شهر</strong>
          </div>
          </br>
          <div class="form-group">
          <div class="">
            <label for="title">نام شهر</label>
                  <input
                    value="${city.name}"
                    type="text"
                    id="name"
                    name="name"
                    placeholder="نام شهر را وارد کنید"
                    class="form-control"
                  />
          </div>  
          </div>   
          </div>`,
        focusConfirm: false,
        preConfirm: () => {
          var name = document.getElementById("name").value;
          var ok = false;
          if (name == "") {
            setTimeout(() => {
              this.editProvince(city);
            }, 0);
          } else {
            ok = true;
          }
          return {
            ok,
            name
          };
        }
      });
      if (formValues2 == undefined || formValues2.ok == false) {
        return;
      }
      this.axios
        .patch(`http://localhost:3000/api/geo/city/edit`, {
          name: formValues2.name,
          cityId: city._id
        })
        .then(res => {
          this.$swal.fire({
            type: "success",
            title: "موفق",
            text: "شهر با موفقیت ویرایش شد"
          });
          city.name = formValues2.name;
          this.showModal(this.selectedProvince);
        })
        .catch(err => {
          console.log(err);
        });
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
