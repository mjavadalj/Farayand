<template>
  <div>
    <b-breadcrumb>
      <b-breadcrumb-item>سلام</b-breadcrumb-item>
      <b-breadcrumb-item active>{{course.title}}</b-breadcrumb-item>
      <b-breadcrumb-item active>{{lesson.title}}</b-breadcrumb-item>
      <b-breadcrumb-item active>جلسه ها</b-breadcrumb-item>
    </b-breadcrumb>
    <h1 class="display-3 text-right">{{lesson.title}}</h1>
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
        placeholder="Serach"
        aria-label="Search"
        aria-describedby="basic-addon1"
        v-on:keyup="search"
      />
    </div>
    <div class="table-resposive" style="text-align:center;">
      <table id="dtBasicExample" align="center" class="table">
        <thead>
          <tr>
            <th class>تاریخ</th>
            <th class>شانس مجدد</th>
            <th class>مدت زمان آزمون</th>
            <th class>حداقل نمره قبولی</th>
            <th class>تعداد سوال</th>
            <th class>عنوان</th>
            <th class>#</th>
          </tr>
        </thead>
        <tbody id="myTable">
          <tr v-for="(session,index) in sessions" :key="session._id" @click="push(session)">
            <td>{{session.date}}</td>
            <td>{{session.secondChance}}</td>
            <td>{{session.duration}}</td>
            <td>{{session.minScore}}</td>
            <td>5</td>
            <td>{{session.title}}</td>
            <td>{{index+1}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import { global } from "@/main.js";
export default {
  data() {
    return {
      course: null,
      lesson: null,
      sessions: null,
      courseId: null,
      tableStyles: [
        {
          date: "1398/02/34",
          teacher: "حسن خدادی",
          title: "انقلاب اسلامی"
        },
        {
          date: "1398/02/58",
          teacher: "حسین خدادی",
          title: "انقلاب اسلامی"
        },
        {
          date: "1398/02/58",
          teacher: "حسن خدادی",
          title: "انقلاب اسلامی"
        },
        {
          date: "1398/02/58",
          teacher: "حسن خدادی",
          title: "انقلاب اسلامی"
        },
        {
          date: "1398/02/58",
          teacher: "حسن خدادی",
          title: "انقلاب اسلامی"
        }
      ]
    };
  },

  methods: {
    push(data) {
    //   this.$router.push({
    //     name: "session"
    //   });
    },
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
    parseDate(date) {
      const dateSet = date.toDateString().split(" ");
      return `${date.toLocaleString("en-us", { month: "long" })} ${
        dateSet[2]
      }, ${dateSet[3]}`;
    },
    checkAll(ev, checkbox) {
      const checkboxArr = new Array(this[checkbox].length).fill(
        ev.target.checked
      );
      Vue.set(this, checkbox, checkboxArr);
    },
    changeCheck(ev, checkbox, id) {
      this[checkbox][id] = ev.target.checked;
      if (!ev.target.checked) {
        this[checkbox][0] = false;
      }
    },
    getRandomData() {
      const result = [];

      for (let i = 0; i <= 8; i += 1) {
        result.push(Math.floor(Math.random() * 20) + 1);
      }

      return result;
    },
    initCharts() {
      const colors = ["#547fff", "#9964e3", "#f55d5d", "#ffc247", "#3abf94"];

      $.each($(".sparkline-chart"), (id, chart) => {
        $(chart).sparkline(this.getRandomData(), {
          type: "bar",
          barColor: colors[Math.floor(Math.random() * colors.length)]
        });
      });
    }
  },
  mounted() {
    // this.initCharts();
    if (global == undefined) {
      this.$router.push("/app");
    }
    console.log(global.lessonId);

    this.courseId = global.courseId;
    this.lessonId = global.lessonId;
    this.axios
      .post(`http://localhost:3000/api/session/showall`, {
        courseId: this.courseId,
        lessonId: this.lessonId
      })


      .then(res => {
        console.log(res.data)
        this.sessions = res.data.lessons.sessions;
        this.course = res.date;
        var course = res.data;
        let { lessons, ...x } = course;
        this.course = x;
        var lesson=res.data.lessons
        let{sessions,...y}=lesson
        this.lesson=lesson
      })
      .catch(err => {
        console.log(err);
      });
  },
  created() {}
};
</script>
<style>
tr:hover {
  background-color: rgb(236, 238, 245);
  cursor: pointer;
}

/* @import 'vue-good-table/dist/vue-good-table.css'; */
</style>
