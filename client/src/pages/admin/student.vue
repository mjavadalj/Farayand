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
            <th class>شماره همراه</th>
            <th class>تاریخ عضویت</th>
            <th class>دانشگاه</th>
            <th class>کد ملی</th>
            <th class>نام</th>
            <th class>#</th>
          </tr>
        </thead>
        <tbody id="myTable">
          <tr v-for="(user,index) in users" :key="user._id">
            <td>
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
            <td id="numeric-td">{{user.email}}</td>
            <td id="numeric-td">{{user.phoneNumber}}</td>
            <td id="numeric-td">{{ new Date(user.date) | moment("jYYYY/jM/jD | HH:mm ")}}</td>
            <td>{{retUni(user.university)}}</td>
            <td id="numeric-td">{{user.nationalcode}}</td>
            <td>{{user.name}}</td>
            <td id="numeric-td">{{index+1}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <br />
    <br />
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
const { Messenger } = window; /* eslint-disable */
/* eslint-disable */

/* eslint-enable */ export default {
  data() {
    return {
      jwt: null,
      headers: null,
      users: [],
      selectedUser: null,
      universities: null
    };
  },

  created() {
    this.headers = {
      'headers': {
        Authorization: `Bearer ${this.$cookie.get("jwt")}`
      }
    };
    this.axios
      .get(`http://localhost:3000/api/user/student/showall`, {
        'headers': {
          Authorization: `Bearer ${this.$cookie.get("jwt")}`
        }
      })
      .then(res => {
        console.log(res.data);

        this.users = res.data;
        // this.addSuccessNotification();
      })
      .catch(err => {
        console.log(err);
      });
  },
  mounted() {
  },
  //TODO: delete add edit delete methods
  methods: {
    async confirmUser(user) {
      var flag = false;
      if (!user.confirmed) {
        flag = true;
      }
      this.axios
        .patch(
          `http://localhost:3000/api/user/edit`,
          {
            userId: user._id,
            confirmed: flag
          },
          this.headers
        )
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
