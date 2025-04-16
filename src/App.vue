<template>
  <Navigation v-if="route.meta.auth" />
  <div class="p-6"><RouterView> </RouterView></div>
</template>

<script setup>
import { useRoute } from "vue-router";
import Navigation from "./components/Navigation.vue";

const route = useRoute();
</script>

<style lang="scss" scoped></style>
