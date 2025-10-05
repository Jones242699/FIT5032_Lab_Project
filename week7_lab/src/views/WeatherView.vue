<template>
  <section class="wrap">
    <h1>Weather APP</h1>

    <div class="controls">
      <input
        v-model="city"
        type="text"
        placeholder="Type a city, e.g. Melbourne"
        class="search-input"
        @keyup.enter="searchByCity"
      />
      <button @click="searchByCity" class="search-button" :disabled="loading">
        {{ loading ? 'Loading...' : 'Search' }}
      </button>
    </div>

    <!-- Show request errors (e.g., network error, city not found) -->
    <p v-if="errorMsg" style="color:red;margin:.5rem 0">{{ errorMsg }}</p>

    <!-- The <main> tag holds the main content of the page -->
    <main>
      <!-- Render weather details only when data is available -->
      <div v-if="weatherData">
        <!-- City name and country code returned by the API -->
        <h2>{{ weatherData.name }}, {{ weatherData.sys.country }}</h2>

        <div>
          <!-- Weather icon from OpenWeather (computed below) -->
          <img :src="iconUrl" alt="Weather Icon" />
          <!-- Temperature in Celsius (computed below) -->
          <p>{{ temperature }} °C</p>
        </div>

        <!-- Current weather description (the first item in the array is "current") -->
        <span>{{ weatherData.weather[0].description }}</span>
      </div>
    </main>
  </section>
</template>

<script>
import axios from "axios";

// Read your API key from Vite env variables (.env or .env.local)
// Example: VITE_OWM_API_KEY=xxxxxxxxxxxxxxxx
const apikey = import.meta.env.VITE_OWM_API_KEY;

export default {
  name: "WeatherView",
  data() {
    return {
      city: "",
      weatherData: null,
      hourlyForecast: [],   // reserved for future extension
      dailyForecast: [],    // reserved for future extension
      loading: false,
      errorMsg: ""
    };
  },
  computed: {
    // Temperature (metric unit is already Celsius due to &units=metric)
    temperature() {
      const t = this.weatherData?.main?.temp;
      return typeof t === "number" ? Math.round(t) : null;
    },
    // Weather icon URL assembled from the icon code returned by the API
    iconUrl() {
      const code = this.weatherData?.weather?.[0]?.icon;
      return code ? `https://openweathermap.org/img/wn/${code}@2x.png` : null;
    },
  },
  mounted() {
    // On mount, try to fetch weather by the user's current geolocation
    this.fetchCurrentLocationWeather();
  },
  methods: {
    // Get weather using browser geolocation (runs asynchronously)
    async fetchCurrentLocationWeather() {
      if (!navigator.geolocation) {
        this.errorMsg = "Geolocation is not supported by this browser.";
        return;
      }
      this.loading = true;
      this.errorMsg = "";
      navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
          const { latitude, longitude } = coords;
          // Build the OpenWeather URL using coordinates (metric units)
          const url =
            `https://api.openweathermap.org/data/2.5/weather` +
            `?lat=${latitude}&lon=${longitude}` +
            `&appid=${apikey}&units=metric`;
          await this.fetchWeatherData(url);
          this.loading = false;
        },
        (err) => {
          this.loading = false;
          this.errorMsg =
            err?.message || "Failed to get your location. Please allow permission.";
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    },

    // Search weather by city name using a GET query string
    async searchByCity() {
      if (!this.city.trim()) {
        this.errorMsg = "Please enter a city";
        return;
      }
      this.loading = true;
      this.errorMsg = "";
      const url =
        `https://api.openweathermap.org/data/2.5/weather` +
        `?q=${encodeURIComponent(this.city.trim())}` +
        `&appid=${apikey}&units=metric`;
      await this.fetchWeatherData(url);
      this.loading = false;
    },

    // Generic fetch wrapper that stores the JSON response to weatherData
    async fetchWeatherData(url) {
      try {
        const { data } = await axios.get(url);
        this.weatherData = data;
      } catch (error) {
        this.weatherData = null;
        this.errorMsg = error?.response
          ? `HTTP ${error.response.status} - ${error.response.data?.message || "Request failed"}`
          : "Network error";
        console.error("Error fetching weather data:", error);
      }
    },
  },
};
</script>

<style scoped>
.wrap { max-width: 640px; margin: 2rem auto; }
.controls { display: flex; gap: .5rem; margin: 1rem 0; }
.search-input { flex: 1; padding: .5rem .75rem; }
.search-button { padding: .5rem .75rem; cursor: pointer; }
pre { background: #f6f8fa; padding: 1rem; border-radius: 8px; }
</style>
