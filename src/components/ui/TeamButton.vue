<template>
 <ul>
   <li v-for="team in teamList" :key="team.name">
     <a href="#" class="team-link">
       <img :src="team.avatar" class="team-avatar"/>
       <span class="team-name">{{ team.name }}</span>
     </a>
   </li>
 </ul>
</template>

<script setup lang="ts">
  import axios from "axios";
  import { ref, onMounted } from 'vue';

  const client = axios.create({
    baseURL: 'http://localhost:7113',
  });

  const teamList = ref<Teams[]>([]);

  async function getTeams(){
    try {
      const res = await client.get('/teams/AllTeams');

      const fetchedTeams: Teams[] = res.data.Teams.map((t: any) => ({
        name: t.name,
        avatar: t.avatar
      }));

      teamList.value = [...teamList.value, ...fetchedTeams];
    } catch (error) {
      console.error("Failed to fetch teams:", error);
    }
  }

  onMounted(() => {
    getTeams();
  });
</script>

<style scoped>

</style>