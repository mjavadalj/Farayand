<template>
  <nav
    :class="{sidebar: true, sidebarStatic, sidebarOpened}"
    @mouseenter="sidebarMouseEnter"
    @mouseleave="sidebarMouseLeave"
  >
    <header class="logo">
      <router-link to="/app/main"><span class="text-warning">مدیریت</span></router-link>
    </header>
    <ul class="nav">
      <NavLink
        header="دوره ها"
        link="/app/course"
        iconName="fa fa-tasks"
        index="course"
        isHeader
      />
      <NavLink
        header="اساتید"
        link="/app/teacher"
        iconName="flaticon-user"
        index="notifications"
        isHeader
      />
      <NavLink
        header="دانشجویان"
        link="/app/student"
        iconName="fa fa-graduation-cap"
        index="students"
        isHeader
      />
      <NavLink
        header="گواهی ها"
        link="/app/certificate"
        iconName="flaticon-list"
        index="certificate"
        isHeader
      />
      <NavLink
        header="دانشگاه ها"
        link="/app/universities"
        iconName="fa fa-university"
        index="uni"
        isHeader
      />
      <NavLink
        header="مدیریت استان ها"
        link="/app/geo"
        iconName="fa fa-university"
        index="geo"
        isHeader
      />
      <!-- <NavLink
        header="Dashboard"
        link="/app/dashboard"
        iconName="flaticon-home"
        index="dashboard"
        isHeader
      />
      <NavLink
        header="Typography"
        link="/app/typography"
        iconName="flaticon-list"
        index="typography"
        isHeader
      />
      <NavLink
        header="Tables Basic"
        link="/app/tables"
        iconName="flaticon-equal-1"
        index="tables"
        isHeader
      />
      <NavLink
        header="Notifications"
        link="/app/notifications"
        iconName="flaticon-star"
        index="notifications"
        isHeader
      />
      <NavLink
        :activeItem="activeItem"
        header="Components"
        link="/app/components"
        iconName="flaticon-network"
        index="components"
        :childrenLinks="[
          { header: 'Chartsxx', link: '/app/components/charts' },
          { header: 'Icons', link: '/app/components/icons' },
          { header: 'Maps', link: '/app/components/maps' },
        ]"
      /> -->
    </ul>
    
  </nav>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import isScreen from '@/core/screenHelper';
import NavLink from './NavLink/NavLink';

export default {
  name: 'Sidebar',
  components: { NavLink },
  data() {
    return {
      alerts: [
        {
          id: 0,
          title: 'Sales Report',
          value: 15,
          footer: 'Calculating x-axis bias... 65%',
          color: 'info',
        },
        {
          id: 1,
          title: 'Personal Responsibility',
          value: 20,
          footer: 'Provide required notes',
          color: 'danger',
        },
      ],
    };
  },
  methods: {
    ...mapActions('layout', ['changeSidebarActive', 'switchSidebar']),
    setActiveByRoute() {
      const paths = this.$route.fullPath.split('/');
      paths.pop();
      this.changeSidebarActive(paths.join('/'));
    },
    sidebarMouseEnter() {
      // if (!this.sidebarStatic && (isScreen('lg') || isScreen('xl'))) {
      //   this.switchSidebar(false);
      //   this.setActiveByRoute();
      // }
    },
    sidebarMouseLeave() {
      // if (!this.sidebarStatic && (isScreen('lg') || isScreen('xl'))) {
      //   this.switchSidebar(true);
      //   this.changeSidebarActive(null);
      // }
    },
  },
  created() {
    this.setActiveByRoute();
  },
  computed: {
    ...mapState('layout', {
      sidebarStatic: state => state.sidebarStatic,
      sidebarOpened: state => !state.sidebarClose,
      activeItem: state => state.sidebarActiveElement,
    }),
  },
};
</script>

<!-- Sidebar styles should be scoped -->
<style src="./Sidebar.scss" lang="scss" scoped/>
