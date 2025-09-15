<template>
  <div class="mt-4">
    <h3>&#128214; Book List (ISBN > 1000)</h3>
    <ul class="list-group">
      <li
        v-for="book in books"
        :key="book.id"
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <span><strong>{{ book.name }}</strong></span>
        <span class="badge bg-primary">ISBN: {{ book.isbn }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import db from '../firebase/init.js';
import { collection, getDocs, query, where } from 'firebase/firestore';

export default {
  name: 'BookList',
  setup() {
    const books = ref([]);

    const fetchBooks = async () => {
      try {
        const q = query(
          collection(db, 'books'),
          where('isbn', '>', 1000)  
        );
        const querySnapshot = await getDocs(q);
        books.value = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error('Error fetching books: ', error);
      }
    };

    // load books on component mount
    onMounted(fetchBooks);

    return {
      books
    };
  }
};
</script>
