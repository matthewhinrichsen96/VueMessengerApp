<template>
  <navigation-bar/>
  <side-bar/>
  <chat-box :chatId="chatId"/>
</template>

<script setup lang="ts">
import NavigationBar from '.././components/NavigationBar.vue'
import SideBar from '.././components/SideBar.vue'
import ChatBox from ".././components/ChatBox.vue";
import { useRoute } from "vue-router";

const route = useRoute();
const chatId = route.params.chatId as string;
</script>

<style scoped>

</style>
