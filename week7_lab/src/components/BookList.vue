<template>
  <div class="mt-4">
    <h3>&#128214; Book List</h3>
    <h5>(Top 5: OrderBy ISBN > 1000)</h5>

    <ul class="list-group">
      <li
        v-for="book in books"
        :key="book.id"
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <!-- Left: book info -->
        <div>
          <span><strong>{{ book.name }}</strong></span>
          <span class="badge bg-primary ms-2">ISBN: {{ book.isbn }}</span>
        </div>

        <!-- Right: action buttons -->
        <div class="d-flex gap-2">
          <!-- Update: emit book object to parent -->
          <button
            @click="$emit('edit-book', book)"
            class="btn btn-sm btn-outline-primary"
          >
            Update
          </button>

          <!-- Delete: emit book id to parent -->
          <button
            @click="$emit('delete-book', book.id)"
            class="btn btn-sm btn-outline-danger"
          >
            Delete
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import db from '../firebase/init.js'
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore'

export default {
  name: 'BookList',
  emits: ['edit-book', 'delete-book'],
  setup() {
    const books = ref([])

    // Fetch top 5 books with isbn > 1000
    const fetchBooks = async () => {
      try {
        const q = query(
          collection(db, 'books'),
          where('isbn', '>', 1000),
          orderBy('isbn', 'asc'),
          limit(5)
        )
        const querySnapshot = await getDocs(q)
        books.value = querySnapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data()
        }))
      } catch (error) {
        console.error('Error fetching books: ', error)
      }
    }

    onMounted(fetchBooks)

    return { books }
  }
}
</script>
