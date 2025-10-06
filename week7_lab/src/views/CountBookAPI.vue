<template>
  <section class="wrap container">
    <button @click="goHome" class="back-btn">&larr; Back to Home</button>
    <h1>Book APP</h1>

    <p v-if="loading">Loading...</p>
    <p v-else-if="errorMsg">error</p>
    <p v-else-if="count !== null">Total number of books: {{ count }}</p>

    <pre v-if="rawData">{{ rawData }}</pre>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const count = ref(null)        // number | null
const loading = ref(false)
const errorMsg = ref('')
const rawData = ref('')
const router = useRouter()

const FUNCTION_URL =
  import.meta.env.VITE_GET_BOOK_COUNT_URL ||
  'https://countbooks-vwp5bgk52a-uc.a.run.app'

async function getBookCountAPI() {
  const { data } = await axios.get(FUNCTION_URL)
  return data
}

async function fetchCount() {
  loading.value = true
  errorMsg.value = ''

  try {
    const data = await getBookCountAPI()
    rawData.value = JSON.stringify(data, null, 2)
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

function goHome() {
  router.push('/')
}
onMounted(fetchCount)
</script>

<style scoped>
.wrap {
  display: grid;
  gap: 0.75rem;
  align-items: start;
}

.back-btn {
  background-color: #4b8bf4;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 15px;
  transition: background-color 0.2s;
  justify-self: start;
}

.back-btn:hover {
  background-color: #3a73d1;
}

.container {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px 16px;
}
</style>
