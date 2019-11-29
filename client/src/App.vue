<template>
  <router-view />
</template>

<script>
import { global } from "@/main.js";
export default {
  name: "App",
  created() {
    const currentPath = this.$router.history.current.path;
    
    // clearInterval(global.inteval)
    // console.log(currentPath.split('/')[1]);
    // const decoded = JSON.parse(this.$cookie.get("authorization"));
    // console.log(decoded);

    // if (!decoded) {
    //   return this.$router.push("/landing");
    // }
    // switch (decoded.role) {
    //   case "student":
    //     this.$router.push("/");
    //     break;
    //   case "teacher":
    //     this.$router.push("/teacher");
    //     break;
    //   case "admin":
    //     this.$router.push("/app");
    //     break;
    // }

    // if (window.localStorage.getItem("authenticated") === "false") {
    //   this.$router.push("/landing");
    // }

    // if (currentPath === '/' || currentPath === '/app') {
    //   this.$router.push('/app/dashboard');
    // }
  }
};
</script>

<style src="./styles/theme.scss" lang="scss" />
