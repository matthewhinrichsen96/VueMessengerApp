<template>
  <div class="fixed bottom-10 left-80 h-5/6 flex flex-col flex-1 border shadow-md bg-white w-5/6 max-w-5xl">
    <div id="chatBox" class="flex-1 px-4 py-4 overflow-y-auto">
      <div ref="scrollDownRef" />

      <div
          v-for="message in messages"
          :key="message.id"
          :class="[
          'flex items-center mb-4',
          message.senderId === userId ? 'flex-row-reverse' : ''
        ]"
      >
        <div
            :class="[
            'flex-none flex flex-col items-center space-y-1',
            message.senderId === userId ? 'ml-4' : 'mr-4'
          ]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
               stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
          <a href="#" class="block text-xs hover:underline">{{ message.senderId }}</a>
        </div>

        <div
            :class="[
            'flex-1 p-2 rounded-lg mb-2 relative',
            message.senderId === userId ? 'bg-gray-300 text-black' : 'bg-gray-600 text-white'
          ]"
        >
          <div :class="message.senderId === userId ? 'text-right' : 'text-left'">
            {{ message.text }}
          </div>

          <button
              v-if="message.senderId === userId"
              class="inline-flex hover:bg-gray-100 rounded-full p-2"
              type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
            </svg>
          </button>

          <span
              :class="[
              'ml-2 text-xs absolute right-3 bottom-2',
              message.senderId === userId ? 'text-black' : 'text-white'
            ]"
          >
            {{ formatTimestamp(message.timestamp) }}
          </span>

          <div
              :class="[
              'absolute top-1/2 transform rotate-45 w-2 h-2',
              message.senderId === userId
                ? 'right-0 translate-x-1/2 bg-gray-300'
                : 'left-0 -translate-x-1/2 bg-gray-600'
            ]"
          ></div>
        </div>
      </div>
    </div>

    <div class="flex items-center border-t p-2">
      <div>
        <button class="inline-flex hover:bg-gray-100 rounded-full p-2" type="button">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
               viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>

      <div class="w-full mx-2">
        <textarea
            ref="textareaRef"
            rows="1"
            v-model="input"
            class="block w-full rounded-md border border-gray-200 resize-none focus:ring-0"
            placeholder="Message..."
            @keydown.enter.prevent="handleEnter"
        />
      </div>

      <div>
        <button class="inline-flex hover:bg-gray-100 rounded-full p-2" type="button" @click="sendMessage">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
               stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
          <span class="px-2">Send</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, nextTick, onMounted} from 'vue'
import {fetchRedis} from "../helpers/redis.ts";
import {messageArrayValidator} from "../lib/validations/message.ts";
import axios from "axios";

const userId = 'Matthew'
const chatId = 'matt'
const messages = ref([
  { id: 1, senderId: '123', text: 'Hi!', timestamp: Date.now() },
  { id: 2, senderId: '456', text: 'Hello there!', timestamp: Date.now() }
])
const client = axios.create({
  baseURL: 'http://localhost:3000', // or wherever your dev server is running
})

const input = ref('')
const scrollDownRef = ref<null | HTMLDivElement>(null)
const textareaRef = ref<null | HTMLTextAreaElement>(null)

async function sendMessage() {
  if (!input.value.trim()) return
  messages.value.push({
    id: Date.now(),
    senderId: userId,
    text: input.value,
    timestamp: new Date().toISOString()
  })

  try {
    const res = await client.post('/api/message/send', {text: input.value, chatId, userId})

    console.log(res.data);
  }
  catch(error){
    console.log("error", error);
    throw error;
  }
  input.value = ''
  nextTick(() => {
    scrollDownRef.value?.scrollIntoView({ behavior: 'smooth' })
  })
}

async function getChatMessages(chatId: string, userId: string) {
  try {
    const results: string[] = await fetchRedis(
        'zrange',
        `chat:${userId}:${chatId}`,
        0,
        -1
    )
    const dbMessages: Message[] = results.map((messages) => JSON.parse(messages))
    const newMessages = messageArrayValidator.parse(dbMessages)

    messages.value = [...messages.value, ...newMessages];
  }
  catch (error)
  {
    console.log(error)
  }
}

function formatTimestamp(timestamp: string | number): string {
  return new Date(timestamp).toLocaleTimeString()
}

function handleEnter(e: KeyboardEvent) {
  if (!e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}

onMounted(() => {
  getChatMessages(chatId, userId);
})

</script>

<style scoped>

</style>

