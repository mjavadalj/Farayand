<template>
  <div :class="{root: true, chatOpen, sidebarClose, sidebarStatic}">
    <Sidebar />
    <!-- <Helper /> -->
    <div id="wrap" class="wrap">
      <Header />
      <!-- <Chat /> -->
      <v-touch
        class="content"
        @swipeleft="handleSwipe"
        @swiperight="handleSwipe"
        :swipe-options="{direction: 'horizontal', threshold: 100}"
      >
        <router-view />
        <!-- <footer class="contentFooter">
        Sing Vue Version - Made by <a href="https://flatlogic.com" rel="nofollow noopener noreferrer" target="_blank">Flatlogic</a>
        </footer>-->
      </v-touch>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

import Sidebar from "@/components/Sidebar/Sidebar";
import Header from "@/components/Header/Header";
import Chat from "@/components/Chat/Chat";
import Helper from "@/components/Helper/Helper";
import { global } from "@/main.js";
import "./Layout.scss";

export default {
  name: "Layout",
  components: { Sidebar, Header, Chat, Helper },
  methods: {
    ...mapActions("layout", [
      "switchSidebar",
      "handleSwipe",
      "changeSidebarActive"
    ])
  },
  computed: {
    ...mapState("layout", {
      sidebarClose: state => state.sidebarClose,
      sidebarStatic: state => state.sidebarStatic,
      chatOpen: state => state.chatOpen
    })
  },
  created() {
    // clearInterval(global.interval)
    
    const decoded = JSON.parse(this.$cookie.get("authorization"));
    if (!decoded) {
      return this.$router.push("/landing");
    }
    switch (decoded.role) {
      case "teacher":
        this.$router.push("/teacher");
        break;
      case "student":
        this.$router.push("/");
        break;
    }
    const staticSidebar = JSON.parse(localStorage.getItem("sidebarStatic"));
    
    if (staticSidebar) {
      this.$store.state.layout.sidebarStatic = true;
    } else if (!this.sidebarClose) {
      setTimeout(() => {
        this.switchSidebar(true);
        this.changeSidebarActive(null);
      }, 2500);
    }
  }
};
</script>

<style src="./Layout.scss" lang="scss" />
