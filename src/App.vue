<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "app",
  created(){
    this.$store.commit('tabs/initState')
  }
};
</script>

<style>
</style>
