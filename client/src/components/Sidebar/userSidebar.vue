<template>
  <nav
    :class="{sidebar: true, sidebarStatic, sidebarOpened}"
    @mouseenter="sidebarMouseEnter"
    @mouseleave="sidebarMouseLeave"
  >
    <header class="logo">
      <router-link to="/teacher">
        پنل
        <span class="text-warning">دانشجو</span>
      </router-link>
      <h6 class="samim">{{user.name}}</h6>
    </header>
    <ul class="nav">
      <NavLink header="خانه" link="/home" iconName="fa fa-home" index="course" isHeader />
      <NavLink
        header="درس های ثبت نام شده"
        link="/mylesson"
        iconName="fa fa-list"
        index="course"
        isHeader
      />
      <NavLink header="ویرایش اطلاعات" link="/edit" iconName="fa fa-edit" index="edit" isHeader />
      <b-button @click="logout()" class="logout-btn" variant="outline-danger">خروج</b-button>
    </ul>
  </nav>
</template>

<script>
import { mapState, mapActions } from "vuex";
import isScreen from "@/core/screenHelper";
import NavLink from "./NavLink/NavLink";

export default {
  name: "Sidebar",
  components: { NavLink },
  data() {
    return {
      user: null,
      alerts: [
        {
          id: 0,
          title: "Sales Report",
          value: 15,
          footer: "Calculating x-axis bias... 65%",
          color: "info"
        },
        {
          id: 1,
          title: "Personal Responsibility",
          value: 20,
          footer: "Provide required notes",
          color: "danger"
        }
      ]
    };
  },
  methods: {
    ...mapActions("layout", ["changeSidebarActive", "switchSidebar"]),
    setActiveByRoute() {
      const paths = this.$route.fullPath.split("/");
      paths.pop();
      this.changeSidebarActive(paths.join("/"));
    },
    sidebarMouseEnter() {
      // if (!this.sidebarStatic && (isScreen("lg") || isScreen("xl"))) {
      //   this.switchSidebar(false);
      //   this.setActiveByRoute();
      // }
    },
    sidebarMouseLeave() {
      //   if (!this.sidebarStatic && (isScreen("lg") || isScreen("xl"))) {
      //     this.switchSidebar(true);
      //     this.changeSidebarActive(null);
      //   }
    },
    logout() {
      this.$cookie.delete("authorization");
      this.$router.push("/landing");
    }
  },
  created() {
    this.user = JSON.parse(this.$cookie.get("authorization"));
    this.setActiveByRoute();
  },
  computed: {
    ...mapState("layout", {
      sidebarStatic: state => state.sidebarStatic,
      sidebarOpened: state => !state.sidebarClose,
      activeItem: state => state.sidebarActiveElement
    })
  }
};
</script>

<!-- Sidebar styles should be scoped -->
<style src="./Sidebar.scss" lang="scss" scoped/>
