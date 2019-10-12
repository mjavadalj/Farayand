<template>
  <router-view />
</template>

<script>
export default {
  name: "App",
  created() {
    const decoded = JSON.parse(this.$cookie.get("authorization"));
    console.log(decoded);

    if (!decoded) {
      return this.$router.push("/login");
    }
    switch (decoded.role) {
      case "student":
        this.$router.push("/");
        break;
      case "teacher":
        this.$router.push("/teacher");
        break;
      case "admin":
        this.$router.push("/app");
        break;
    }
    const currentPath = this.$router.history.current.path;
    if (window.localStorage.getItem("authenticated") === "false") {
      this.$router.push("/login");
    }

    // if (currentPath === '/' || currentPath === '/app') {
    //   this.$router.push('/app/dashboard');
    // }
  }
};
</script>

<style src="./styles/theme.scss" lang="scss" />
