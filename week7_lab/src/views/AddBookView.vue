<template>
  <div class="container mt-5">
    <div class="card shadow-sm p-4 mx-auto" style="max-width: 500px;">
      <h2 class="mb-4 text-center">
        &#128218; {{ editingId ? 'Update Book' : 'Add a New Book' }}
      </h2>

      <form @submit.prevent="submitForm">
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

        <!-- Submit + Reset -->
        <div class="d-flex gap-2">
          <button type="submit" class="btn btn-primary w-100">
            {{ editingId ? 'Save Changes' : 'Submit' }}
          </button>
          <button type="button" class="btn btn-outline-secondary" @click="resetForm">
            Reset
          </button>
        </div>
      </form>

      <!-- Child component: use key to trigger refresh -->
      <BookList
        class="mt-4"
        :key="refreshKey"
        @edit-book="startEdit"
        @delete-book="handleDelete"
      />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import db from '../firebase/init.js'
import { collection, addDoc, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore'
import BookList from '../components/BookList.vue'

export default {
  components: { BookList },
  setup() {
    const isbn = ref('')
    const name = ref('')

    // Track editing state
    const editingId = ref(null)
    // Key for forcing child component re-render
    const refreshKey = ref(0)

    const resetForm = () => {
      isbn.value = ''
      name.value = ''
      editingId.value = null
    }

    const addBook = async (isbnNumber, nameStr) => {
      await addDoc(collection(db, 'books'), { isbn: isbnNumber, name: nameStr })
    }

    const updateBook = async (id, isbnNumber, nameStr) => {
      const bookRef = doc(db, 'books', id)
      const oldSnap = await getDoc(bookRef)
      const oldData = oldSnap.exists() ? oldSnap.data() : {}
      const noChange =
        Number(oldData.isbn) === isbnNumber && String(oldData.name) === String(nameStr)
      if (noChange) return { changed: false }
      await updateDoc(bookRef, { isbn: isbnNumber, name: nameStr })
      return { changed: true }
    }

    const submitForm = async () => {
      try {
        const isbnNumber = Number(isbn.value)
        if (isNaN(isbnNumber)) {
          alert('ISBN must be a valid number'); return
        }

        if (editingId.value) {
          const res = await updateBook(editingId.value, isbnNumber, name.value)
          if (!res.changed) { alert('No changes detected.'); resetForm(); return }
          alert('Book updated!')
        } else {
          await addBook(isbnNumber, name.value)
          alert('Book added successfully!')
        }

        resetForm()
        refreshKey.value++
      } catch (e) {
        console.error(e)
      }
    }

    const startEdit = (book) => {
      editingId.value = book.id
      isbn.value = book.isbn
      name.value = book.name
    }

    const handleDelete = async (id) => {
      try {
        await deleteDoc(doc(db, 'books', id))
        alert('Book deleted!')
        refreshKey.value++ // Refresh list after delete
        if (editingId.value === id) resetForm()
      } catch (error) {
        console.error('Error deleting book: ', error)
      }
    }

    return {
      isbn,
      name,
      editingId,
      refreshKey,
      submitForm,
      resetForm,
      startEdit,
      handleDelete
    }
  }
}
</script>
