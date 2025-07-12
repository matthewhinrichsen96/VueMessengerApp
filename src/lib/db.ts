import { Redis } from "@upstash/redis";

export const db = new Redis({
    url: import.meta.env.VITE_UPSTASH_REDIS_REST_URL,
    token: import.meta.env.VITE_UPSTASH_REDIS_REST_TOKEN,
})