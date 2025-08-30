import type { RouteRecordRaw } from 'vue-router'
import Chat from "./pages/Chat.vue"
import HomePage from "./pages/HomePage.vue"

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: HomePage
  },
  {
    path: '/chat',
    component: Chat
  },
  {
    path: '/chat/:chatId',
    component: () => import("./pages/Chat.vue"),
    props: true
  }
];
