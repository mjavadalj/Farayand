<template>
  <div>
    <b-breadcrumb>
      <b-breadcrumb-item>سلام</b-breadcrumb-item>
      <b-breadcrumb-item active>دوره ها</b-breadcrumb-item>
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
            <th class>وضعیت انتشار</th>
            <th class>تاریخ</th>
            <th class>استاد</th>
            <th class>عنوان</th>
            <th class>#</th>
          </tr>
        </thead>
        <tbody id="myTable">
          <tr v-for="(course,index) in courses" :key="course._id" @click="push(course)">
            <td>{{course.publishable}}</td>
            <td>{{course.date}}</td>
            <td>{{course.user.name}}</td>
            <td>{{course.title}}</td>
            <td>{{index+1}}</td>
          </tr>
        </tbody>
      </table>
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
}
/* eslint-enable */
export default {
  data() {
    return {
      locationClasses: "messenger-fixed messenger-on-bottom messenger-on-right",
      courses: null,
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
    addSuccessNotification() {
      Messenger().post({
        extraClasses: this.locationClasses,
        message: "Showing success message was successful!",
        type: "success",
        showCloseButton: true
      });
      return false;
    },
    push(course) {
      console.log(course._id);

      global.courseId = course._id;
      this.$router.push({
        name: "lesson",
        params: {
          title: course.title
        }
      });
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

    this.axios
      .post(`http://localhost:3000/api/course/showall`)
      .then(res => {
        console.log("res.data");
        console.log(res.data);
        this.courses = res.data;
        // this.addSuccessNotification();
      })
      .catch(err => {
        console.log(err);
      });
  },
  created() {
    // this.initializationMessengerCode();
  }
};
</script>

<style src="./Notifications.scss" lang="scss" scoped>
tr:hover {
  background-color: rgb(236, 238, 245);
  cursor: pointer;
}
</style>
