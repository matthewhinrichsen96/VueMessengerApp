<template>
  <ul>
    <li v-for="user in userList" >
      <a class="user-link">
        <img :src=user.avatar class='user-avatar'/>
        <span class="user-name">{{user.firstname}} {{user.lastname}}</span>
      </a>
    </li>
  </ul>
</template>

<script setup lang="ts">
import axios from "axios";
import { ref, onMounted } from 'vue';

const client = axios.create({
  baseURL: 'https://localhost:7113',
});

const userList = ref<User[]>([]);

async function getUsers(){

  try {
    const res = await client.get('/api/Users/All');

    const fetchedUsers: User[] = res.data.map((t: any) => ({
      userId: t.userId,
      userName: t.userName,
      firstname: t.firstname,
      lastname: t.lastname,
      avatar: t.avatar,
    }));

    userList.value = [...userList.value, ...fetchedUsers];
  } catch (error) {
    console.error("Failed to fetch users:", error);
  }
}

onMounted(() => {
  getUsers();
});
</script>

<style scoped>

</style>