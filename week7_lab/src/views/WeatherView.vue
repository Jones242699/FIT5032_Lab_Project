<template>
  <section class="wrap">
    <h1>Weather APP</h1>

    <!-- Search controls -->
    <div class="controls">
      <input
        v-model="city"
        type="text"
        placeholder="Type a city, e.g. Melbourne"
        class="search-input"
        @keyup.enter="searchByCity"
        @input="errorMsg=''"
        aria-label="City name"
      />
      <button @click="searchByCity" class="search-button" :disabled="loading">
        {{ loading ? 'Loading...' : 'Search' }}
      </button>
      <button @click="useMyLocation" class="search-button" :disabled="loading">
        {{ loading ? 'Locating...' : 'Use my location' }}
      </button>
    </div>

    <!-- Notes & errors -->
    <p v-if="locationNote" class="note">{{ locationNote }}</p>
    <p v-if="errorMsg" class="error">{{ errorMsg }}</p>

    <!-- Main content -->
    <main>
      <div v-if="weatherData">
        <h2>{{ weatherData.name }}, {{ weatherData.sys.country }}</h2>

        <div class="row">
          <!-- Weather icon (size controlled via CSS .icon) -->
          <img v-if="iconUrl" :src="iconUrl" alt="Weather Icon" class="icon" />
          <!-- Rounded Celsius temperature -->
          <p v-if="temperature !== null" class="temp">{{ temperature }} °C</p>
        </div>

        <!-- Current weather description -->
        <span>{{ weatherData.weather[0].description }}</span>
      </div>
    </main>
  </section>
</template>

<script>
/**
 * WeatherView.vue
 * - Fetch weather by city name or current location.
 * - Uses geolocation with a resilient fallback to IP-based location.
 * - OpenWeather API key must be provided via Vite env: VITE_OWM_API_KEY=xxxx
 */
import axios from "axios"

// Read API key from Vite environment; remember to restart the dev server after editing .env
const apikey = import.meta.env.VITE_OWM_API_KEY || ""

export default {
  name: "WeatherView",
  data() {
    return {
      city: "",             // search input
      weatherData: null,    // latest OpenWeather response
      loading: false,       // UI loading flag
      errorMsg: "",         // human-friendly error message
      locationNote: "",     // context note (e.g., "Using device location")
      _watchId: null        // geolocation watch id for cleanup
    }
  },
  computed: {
    // Celsius temperature (metric units already used in API calls)
    temperature() {
      const t = this.weatherData?.main?.temp
      return typeof t === "number" ? Math.round(t) : null
    },
    // Compose the weather icon URL from the API response
    iconUrl() {
      const code = this.weatherData?.weather?.[0]?.icon
      return code ? `https://openweathermap.org/img/wn/${code}@2x.png` : null
    },
  },
  mounted() {
    // Attempt to load weather immediately using current device location
    this.useMyLocation()
  },
  beforeUnmount() {
    // Cleanup any active geolocation watcher when component unmounts
    if (this._watchId) navigator.geolocation.clearWatch(this._watchId)
  },
  methods: {
    /**
     * Use device geolocation to fetch weather.
     * Falls back to IP-based location for POSITION_UNAVAILABLE / TIMEOUT.
     */
    async useMyLocation() {
      // Basic guard: API key must exist
      if (!apikey) {
        this.errorMsg = "Missing OpenWeather API key. Set VITE_OWM_API_KEY in .env and restart the dev server."
        return
      }

      // If geolocation is not available, use IP-based approximation
      if (!navigator.geolocation) {
        this.errorMsg = "Geolocation not supported; using IP-based location."
        await this.fetchByIP()
        return
      }

      this.loading = true
      this.errorMsg = ""
      this.locationNote = ""

      let resolved = false
      const finish = () => { this.loading = false }

      // Lower accuracy improves success indoors and is faster
      const opts = { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }

      // Success handler: request weather by device coordinates
      const success = async ({ coords }) => {
        if (resolved) return
        resolved = true
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${apikey}&units=metric`
        await this.fetchWeatherData(url)
        this.locationNote = "Using device location (GPS/Wi-Fi)"
        finish()
        if (this._watchId) navigator.geolocation.clearWatch(this._watchId)
      }

      // Map geolocation error codes to readable messages
      const human = (err) => {
        switch (err?.code) {
          case 1: return "Location permission denied. Please allow it in the browser."
          case 2: return "Position unavailable. Turn on Wi-Fi and allow Location Services for Chrome."
          case 3: return "Location timeout. Trying fallback..."
          default: return err?.message || "Failed to get your location."
        }
      }

      // Failure handler: for unavailable/timeout, try IP-based fallback
      const fail = async (err) => {
        this.errorMsg = human(err)
        if (err?.code === 2 || err?.code === 3) {
          await this.fetchByIP()
        } else {
          finish()
        }
      }

      // Race: watchPosition + getCurrentPosition; whichever returns first is used
      this._watchId = navigator.geolocation.watchPosition(success, fail, opts)
      navigator.geolocation.getCurrentPosition(success, fail, opts)

      // Extra guard: if neither returns, force a timeout path
      setTimeout(() => { if (!resolved) fail({ code: 3, message: "timeout" }) }, 10000)
    },

    /**
     * Approximate location via IP when device geolocation is unavailable.
     * Good enough for demo/screenshot and avoids blocking on permissions.
     */
    async fetchByIP() {
      try {
        const ip = await fetch("https://ipapi.co/json/").then(r => r.json())
        if (ip?.latitude && ip?.longitude) {
          const url = `https://api.openweathermap.org/data/2.5/weather?lat=${ip.latitude}&lon=${ip.longitude}&appid=${apikey}&units=metric`
          await this.fetchWeatherData(url)
          this.locationNote = "Used IP-based location (approx.)"
          this.errorMsg = ""
        } else {
          this.errorMsg = "IP-based location failed. Check network/VPN."
        }
      } catch {
        this.errorMsg = "IP-based location failed. Check network/VPN."
      } finally {
        this.loading = false
      }
    },

    /**
     * Search weather by city name.
     */
    async searchByCity() {
      if (!apikey) {
        this.errorMsg = "Missing OpenWeather API key. Set VITE_OWM_API_KEY in .env and restart the dev server."
        return
      }
      if (!this.city.trim()) {
        this.errorMsg = "Please enter a city"
        return
      }
      this.loading = true
      this.errorMsg = ""
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(this.city.trim())}&appid=${apikey}&units=metric`
      await this.fetchWeatherData(url)
      this.locationNote = `City search: ${this.city.trim()}`
      this.loading = false
    },

    /**
     * Generic fetch wrapper: requests weather and stores the JSON response.
     * Handles common HTTP errors with helpful messages.
     */
    async fetchWeatherData(url) {
      try {
        const { data } = await axios.get(url)
        this.weatherData = data
      } catch (error) {
        this.weatherData = null
        if (error?.response?.status === 401) {
          this.errorMsg = "OpenWeather says: Invalid API key (401). Check VITE_OWM_API_KEY."
        } else if (error?.response?.status === 404) {
          this.errorMsg = "City not found (404)."
        } else {
          this.errorMsg = error?.response
            ? `HTTP ${error.response.status} - ${error.response.data?.message || "Request failed"}`
            : "Network error"
        }
        // Log for debugging
        console.error("Error fetching weather data:", error)
      }
    },
  },
}
</script>

<style scoped>
/* Layout */
.wrap { max-width: 640px; margin: 2rem auto; }
.controls { display: flex; gap: .5rem; margin: 1rem 0; flex-wrap: wrap; }

/* Inputs & buttons */
.search-input { flex: 1; min-width: 260px; padding: .5rem .75rem; }
.search-button { padding: .5rem .75rem; cursor: pointer; }

/* Weather row */
.row { display: flex; align-items: center; gap: .75rem; }
.temp { font-size: 1.5rem; font-weight: 600; }

/*  Icon size control (keeps it neat) */
.icon { width: 80px; height: auto; object-fit: contain; }

/* Messages */
.error { color: #d21; margin: .5rem 0; }
.note { color: #555; font-size: .9rem; margin: .25rem 0; }
</style>
