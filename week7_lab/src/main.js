import 'bootstrap/dist/css/bootstrap.min.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAmv_xT2IOcQMJ5C5KrVeXQvxbwYfRWn0c",
  authDomain: "week7-junhong.firebaseapp.com",
  projectId: "week7-junhong",
  storageBucket: "week7-junhong.firebasestorage.app",
  messagingSenderId: "165187060655",
  appId: "1:165187060655:web:01a72c27e101d542aa655a"
};

// Initialize Firebase
initializeApp(firebaseConfig);

const app = createApp(App)
app.use(PrimeVue, { theme: { preset: Aura } })
app.use(router)
app.mount('#app')