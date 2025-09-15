<template>
  <div class="container mt-5">
    <div class="card shadow-sm p-4 mx-auto" style="max-width: 500px;">
      <h2 class="mb-4 text-center">&#128218; Add a New Book</h2>
      <form @submit.prevent="addBook">
        <!-- ISBN -->
        <div class="mb-3">
          <label for="isbn" class="form-label">ISBN</label>
          <input
            type="number"
            v-model="isbn"
            id="isbn"
            class="form-control"
            placeholder="Enter ISBN number"
            required
          />
        </div>

        <!-- Name -->
        <div class="mb-3">
          <label for="name" class="form-label">Book Name</label>
          <input
            type="text"
            v-model="name"
            id="name"
            class="form-control"
            placeholder="Enter book title"
            required
          />
        </div>

        <!-- Submit -->
        <button type="submit" class="btn btn-primary w-100">
          &#10133; Add Book
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import db from '../firebase/init.js';
import { collection, addDoc } from 'firebase/firestore';

export default {
  setup() {
    const isbn = ref('');
    const name = ref('');

    const addBook = async () => {
      try {
        const isbnNumber = Number(isbn.value);
        if (isNaN(isbnNumber)) {
          alert('ISBN must be a valid number');
          return;
        }

        await addDoc(collection(db, 'books'), {
          isbn: isbnNumber,
          name: name.value
        });

        isbn.value = '';
        name.value = '';
        alert('Book added successfully!');
      } catch (error) {
        console.error('Error adding book: ', error);
      }
    };

    return {
      isbn,
      name,
      addBook
    };
  }
};
</script>
