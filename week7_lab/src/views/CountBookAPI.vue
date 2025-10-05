<template>
  <section class="wrap container">
    <h1>Book Counter</h1>

    <p v-if="loading">Loading...</p>
    <p v-else-if="errorMsg">error</p>
    <p v-else-if="count !== null">Total number of books: {{ count }}</p>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const count = ref(null)        // number | null
const loading = ref(false)
const errorMsg = ref('')

const FUNCTION_URL =
  import.meta.env.VITE_GET_BOOK_COUNT_URL ||
  'http://127.0.0.1:5001/Week7-Junhong/us-central1/getBookCount'

async function getBookCountAPI() {
  const { data } = await axios.get(FUNCTION_URL)
  return data
}

async function fetchCount() {
  loading.value = true
  errorMsg.value = ''

  try {
    const data = await getBookCountAPI()
    const n = typeof data === 'number' ? data : Number(data?.count)

    if (Number.isFinite(n)) {
      count.value = n
    } else {
      throw new Error('Invalid response')
    }
  } catch (e) {
    count.value = null
    errorMsg.value = e?.message || 'Request failed'
  } finally {
    loading.value = false
  }
}

onMounted(fetchCount)
</script>

<style scoped>
.wrap { display: grid; gap: .75rem; align-items: start; }
.container { max-width: 960px; margin: 0 auto; padding: 24px 16px; }
</style>
