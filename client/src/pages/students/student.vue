
// TODO: route confirm user nadarim !!!




<template>
  <div id="users">
    <b-breadcrumb>
      <b-breadcrumb-item>سلام</b-breadcrumb-item>
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
        placeholder="جست و جو"
        aria-label="Search"
        aria-describedby="basic-addon1"
        v-on:keyup="search"
      />
    </div>
    <div
      id="table_data"
      class="table-striped"
      style="text-align:center;max-height:500px; overflow: auto;margin-bottom:10px;"
    >
      <table id="dtBasicExample" align="center" class="table">
        <thead>
          <tr>
            <th class>عملیات</th>
            <th class>وضعیت دانشجو</th>
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
            v-for="(user,index) in users"
            :key="user._id"
          >
            <td>
                <b-button variant="danger" @click = "deleteUser(user)"><span class="glyphicon glyphicon-trash"/></b-button>
                <b-button variant="warning" @click= "editUser(user)"><span class="glyphicon glyphicon-pencil" /></b-button>
                <b-button v-if="!user.confirmed" @click= "confirmUser(user)" variant="success"><span class="glyphicon glyphicon-ok" /></b-button>
                </td>
            <td>{{user.confirmed}}</td>
            <td>{{user.email}}</td>
            <td>{{user.date}}</td>
            <td>
              <p class="mb-0">
                <small>
                  <span class="text-muted">&nbsp; نوشیروانی</span>
                </small>
              </p>
              <p>
                <small>
                  <span class="text-muted">&nbsp; مازندران</span>
                </small>
              </p>
            </td>
            <td>{{user.username}}</td>
            <td>{{user.name}}</td>
            <td>{{index+1}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <br />
    <br />
    <button id="fixedbutton" class="btn btn-primary" type="button" @click="addUser">
        <i class="fa fa-plus" />
      </button>
    <div></div>
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
      users:[]
    };
  },

    mounted() {
        
    this.axios
      .get(`http://localhost:3000/api/user/showall`)
      .then(res => {
        console.log(res.data);
        this.users = res.data;
        // this.addSuccessNotification();
      })

    },


  methods: {
      async confirmUser(index){


      },
      deleteUser(user){
        this.axios
            .post(`http://localhost:3000/api/user/delete/`,{
                userId: user._id
                }
            )
            .then(res => {
                let userIndex = this.users.indexOf(user);
                this.users.splice(userIndex,1);
                this.$swal.fire({
                type: 'success',
                title: 'موفق',
                text: 'کاربر با موفقیت ویرایش شد',
                })
            })
            .catch(err=>{
                console.log(err)
            })

      },
      async editUser(user){
        //   console.log(index)
          const { value: formValues } = await this.$swal.fire({
            title: 'ویرایش کاربر',
            html:
                '<input id="swal-input1" class="swal2-input" required="true" placeholder = "نام کاربری">' +
                '<input id="swal-input2" class="swal2-input" placeholder = "دانشگاه فعلا نه!!!">'+
                '<input id="swal-input3" class="swal2-input" placeholder = "ایمیل">'+
                '<input id="swal-input4" class="swal2-input" placeholder = "نام">',
            focusConfirm: false,
            preConfirm: () => {
                return [
                    document.getElementById('swal-input1').value,
                    document.getElementById('swal-input2').value,
                    document.getElementById('swal-input3').value,
                    document.getElementById('swal-input4').value
                ]
            }
        })

        // if (formValues) {
        // // console.log(formValues)

        // this.$swal.fire(JSON.stringify(formValues))
        // }

        // console.log(this.users[index]._id);
        // TODO: university ezafe she
        this.axios
            .patch(`http://localhost:3000/api/user/edit`,{
                userId: user._id,
                username: formValues[0],
                email: formValues[2],
                name: formValues[3]
            })
            .then(res => {
                this.$swal.fire({
                type: 'success',
                title: 'موفق',
                text: 'کاربر با موفقیت ویرایش شد',
                })
            console.log(res.data);
            })
            .catch(err=>{
                console.log(err)
            })
    },

//TODO: university ezafe she
     async addUser(user){
        // console.log(this.$store.state.test)
        
        const { value: formValues2 } = await this.$swal.fire({
        title: 'افزودن کاربر',
        html:
            '<input id="swal-input1" class="swal2-input" required="true" placeholder = "نام کاربری">' +
            '<input id="swal-input2" class="swal2-input" placeholder = "ایمیل">'+
            '<input id="swal-input3" class="swal2-input" placeholder = "دانشگاه فعلا نه">'+
            '<input id="swal-input4" class="swal2-input" placeholder = "نقش">'+
            '<input id="swal-input5" class="swal2-input" placeholder = "نام">',
            // '<input id="swal-input6" class="swal2-input" placeholder = "جنسیت>',
        focusConfirm: false,
        preConfirm: () => {
            return [
            document.getElementById('swal-input1').value,
            document.getElementById('swal-input2').value,
            document.getElementById('swal-input3').value,
            document.getElementById('swal-input4').value,
            document.getElementById('swal-input5').value
            // document.getElementById('swal-input6').value
            ]
        }
        })

        this.axios
            .post(`http://localhost:3000/api/user/add`,{
                userId: user._id,
                username: formValues2[0],
                email: formValues2[1],
                name: formValues2[4],
                role: formValues2[3],
                gender: formValues2[5]
            })
            .then(res => {
                // console.log(res)
                this.$swal.fire({
                type: 'success',
                title: 'موفق',
                text: 'کاربر با موفقیت ویرایش شد',
                })
            // console.log(res.data);
            this.users.push(res.data)
            })
            .catch(err=>{
                console.log(err)
            })



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
    }




    }
  }
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
