<template>
  <div style="width:800px;margin:auto;left:0;">
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
    <div style="margin-bottom:5px;" class="text-center">
      <button
      v-if="(role == 'teacher' && selectedUniversities.length != 0)||(role == 'student' && university != null)"
        id="teacher"
        style="margin:2px;font-family:lalezar"
        class="btn btn-outline-secondary"
        type="button"
        @click="change()"
      >ذخیره تغییرات</button>
    </div>
    <h6 style="font-family:samim" class="text-center just-text">{{describe(role)}}</h6>
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
export default {
  data() {
    return {
      user: null,
      role: null,
      jwt: null,
      headers: null,
      university: null,
      universities: null,
      selectedUniversities: []
    };
  },
  methods: {
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
    change() {
      var uniId = [];
      if (this.role == "teacher") {
        if (this.selectedUniversities.length == 0) {
          return alert("دانشگاه خود را انتخاب کنید");
        }
        this.selectedUniversities.forEach(uni => {
          uniId.push(uni._id);
        });
      } else if (this.role == "student") {
        if (this.university == null) {
          return alert("دانشگاه خود را انتخاب کنید");
        }
        uniId.push(this.university._id);
      } else {
        return;
      }
      this.$swal
        .fire({
          title: `تغییر دانشگاه`,
          text: `${this.describe(this.role)}`,
          type: "warning",
          showCancelButton: true,
          cancelButtonText: "بازگشت",
          cancelButtonColor: "#3085d6",
          confirmButtonColor: "#d33",
          confirmButtonText: "تغییر"
        })
        .then(result => {
          if (result.value) {
            this.axios
              .patch(
                "http://localhost:3000/api/user/changeUNI",
                {
                  uniId: uniId
                },
                this.headers
              )
              .then(result => {
                console.log(result);
              })
              .catch(loginError => {
                  
              });
          }
        });
    },
    describe(role) {
      if (role == "teacher") {
        return "دانشگاه های انتخابی جایگزین دانشگاه های قبلی می شوند.";
      } else if (role == "student") {
        return "دانشگاه انتخابی جایگزین دانشگاه  قبلی می شود.";
      }
    }
  },
  created() {
    this.headers = {
      headers: {
        Authorization: `Bearer ${this.$cookie.get("jwt")}`
      }
    };
    this.user = JSON.parse(this.$cookie.get("authorization"));
    this.role = this.user.role;
  }
};
</script>