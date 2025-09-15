<template>
  <div class="mt-4">
    <h3>&#128214; Book List </h3>
    <h5>(Top5: OderBy ISBN > 1000)</h5>
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
          <!-- update button -->
          <button @click="updateBook(book.id)" class="btn btn-sm btn-outline-primary">
            Update
          </button>

          <!-- delete button -->
          <button @click="deleteBook(book.id)" class="btn btn-sm btn-outline-danger">
            Delete
          </button>
        </div>

      </li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import db from '../firebase/init.js';
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';

export default {
  name: 'BookList',
  setup() {
    const books = ref([]);

// Fetch books from Firestore with specific query conditions
const fetchBooks = async () => {
  try {
    // Example query with WHERE + ORDER BY + LIMIT
    const q = query(
      collection(db, 'books'),
      where('isbn', '>', 1000),   // WHERE: only isbn greater than 1000
      orderBy('isbn', 'asc'),   // ORDER BY: sort by isbn descending
      limit(5)                   // LIMIT: take only top 5 results
    );

    const querySnapshot = await getDocs(q);

    // Map Firestore docs into plain JS objects
    books.value = querySnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data()
    }));
  } catch (error) {
    console.error('Error fetching books: ', error);
  }
};
    // Update book name (simple example: set name to "Updated Book")
    const updateBook = async (id) => {
      try {
        const bookRef = doc(db, 'books', id);
        await updateDoc(bookRef, { name: 'Updated Book' });
        alert('Book updated!');
        fetchBooks(); // Refresh list after update
      } catch (error) {
        console.error('Error updating book: ', error);
      }
    };

    // Delete book by id
    const deleteBook = async (id) => {
      try {
        await deleteDoc(doc(db, 'books', id));
        alert('Book deleted!');
        fetchBooks(); // Refresh list after delete
      } catch (error) {
        console.error('Error deleting book: ', error);
      }
    };

    // Load books on component mount
    onMounted(fetchBooks);

    return {
      books,
      updateBook,
      deleteBook
    };
  }
};
</script>
