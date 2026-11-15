<script setup lang="ts">
import {useAuth} from "~/features/auth/composables/useAuth.ts";

definePageMeta({
  middleware: 'auth',
})

const { user, logout } = useAuth()

const features = [
  {
    title: 'Employee Management',
    description: 'Kelola data dan informasi karyawan.',
    path: '/employees',
  },
  {
    title: 'Terbilang',
    description: 'Konversi angka menjadi tulisan Rupiah.',
    path: '/terbilang',
  },
  {
    title: 'Star Pattern',
    description: 'Generate berbagai pola bintang.',
    path: '/star-pattern',
  },
  {
    title: 'Log History',
    description: 'Lihat riwayat aktivitas aplikasi.',
    path: '/history',
  },
]
</script>


<template>
  <main class="dashboard">
    <header class="dashboard-header">
      <div class="brand">
        <div class="brand-logo">EC</div>
        <div>
          <h1>Electronic City</h1>
          <span>Management Portal</span>
        </div>
      </div>

      <div class="user-section">
        <div class="user-info">
          <strong>{{ user?.name || 'User' }}</strong>
          <span>Administrator</span>
        </div>
        <button type="button" @click="logout">
          Logout
        </button>
      </div>
    </header>

    <section class="hero">
      <div class="hero-content">
        <span class="hero-label">ADMINISTRATION PORTAL</span>
        <h2>Welcome back, {{ user?.name || 'User' }}!</h2>
        <p>
          Manage your employees, tools, and application activities
          from one place.
        </p>
      </div>
      <div class="hero-decoration">ECI</div>
    </section>

    <section class="dashboard-content">
      <div class="section-heading">
        <div>
          <h2>Workspace</h2>
          <p>Select a module to get started.</p>
        </div>
        <span class="module-count">04 Modules</span>
      </div>

      <div class="feature-grid">
        <NuxtLink
            v-for="(feature, index) in features"
            :key="feature.path"
            :to="feature.path"
            class="feature-card"
            :class="`feature-card--${index + 1}`"
        >
          <div class="card-top">
            <span class="feature-icon">
              {{ ['👥', '🔢', '⭐', '📋'][index] }}
            </span>
            <span class="card-arrow">↗</span>
          </div>

          <div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>

          <span class="card-link">Open module →</span>
        </NuxtLink>
      </div>
    </section>

    <footer class="dashboard-footer">
      Electronic City Management Portal
    </footer>
  </main>
</template>


<style scoped>

.dashboard {
  min-height: 100vh;
  padding: 24px;
  background:
      radial-gradient(circle at 5% 10%, #dbeafe 0, transparent 25%),
      radial-gradient(circle at 95% 80%, #fee2e2 0, transparent 25%),
      #f8fafc;
}

.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  max-width: 1200px;
  margin: auto;
  padding-bottom: 24px;
}

.brand,
.user-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-logo {
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  border-radius: 12px;
  background: #dc2626;
  color: white;
  font-weight: 800;
}

.brand h1 {
  font-size: 17px;
  font-weight: 800;
  color: #172554;
}

.brand span,
.user-info span {
  display: block;
  color: #64748b;
  font-size: 12px;
}

.user-info {
  text-align: right;
  font-size: 13px;
}

.user-section button {
  padding: 9px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
}

.hero {
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
  max-width: 1200px;
  min-height: 220px;
  margin: 12px auto 36px;
  padding: 36px;
  border-radius: 20px;
  background: linear-gradient(115deg, #172554, #1d4ed8 70%, #2563eb);
  color: white;
}

.hero::before,
.hero::after {
  position: absolute;
  content: "";
  border: 1px solid rgb(255 255 255 / 15%);
  border-radius: 50%;
}

.hero::before {
  width: 300px;
  height: 300px;
  right: 5%;
  top: -150px;
}

.hero::after {
  width: 220px;
  height: 220px;
  right: 15%;
  bottom: -150px;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 550px;
}

.hero-label {
  display: inline-block;
  margin-bottom: 14px;
  color: #bfdbfe;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
}

.hero h2 {
  font-size: clamp(24px, 4vw, 34px);
  font-weight: 800;
}

.hero p {
  margin-top: 10px;
  color: #dbeafe;
  font-size: 14px;
  line-height: 1.7;
}

.hero-decoration {
  position: absolute;
  right: 8%;
  color: rgb(255 255 255 / 10%);
  font-size: clamp(70px, 12vw, 150px);
  font-weight: 900;
  letter-spacing: -10px;
}

.dashboard-content {
  max-width: 1200px;
  margin: auto;
}

.section-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-heading h2 {
  color: #172554;
  font-size: 23px;
  font-weight: 800;
}

.section-heading p {
  margin-top: 5px;
  color: #64748b;
  font-size: 14px;
}

.module-count {
  padding: 7px 12px;
  border-radius: 20px;
  background: #dbeafe;
  color: #1d4ed8;
  font-size: 12px;
  font-weight: 700;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.feature-card {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 210px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: white;
  color: inherit;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgb(15 23 42 / 8%);
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.feature-icon {
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  border-radius: 14px;
  font-size: 23px;
}

.feature-card--1 .feature-icon {
  background: #dbeafe;
}

.feature-card--2 .feature-icon {
  background: #fef3c7;
}

.feature-card--3 .feature-icon {
  background: #fce7f3;
}

.feature-card--4 .feature-icon {
  background: #dcfce7;
}

.card-arrow {
  color: #94a3b8;
  font-size: 20px;
}

.feature-card h3 {
  color: #172554;
  font-size: 17px;
  font-weight: 700;
}

.feature-card p {
  margin-top: 7px;
  color: #64748b;
  font-size: 13px;
  line-height: 1.6;
}

.card-link {
  margin-top: auto;
  color: #2563eb;
  font-size: 12px;
  font-weight: 700;
}

.dashboard-footer {
  max-width: 1200px;
  margin: 40px auto 0;
  padding: 20px 0;
  border-top: 1px solid #e2e8f0;
  color: #94a3b8;
  font-size: 12px;
}

@media (max-width: 640px) {
  .dashboard {
    padding: 16px;
  }

  .user-info {
    display: none;
  }

  .hero {
    min-height: 200px;
    padding: 24px;
  }

  .hero-decoration {
    right: 5%;
    bottom: 0;
  }

  .feature-grid {
    grid-template-columns: 1fr;
  }

  .feature-card {
    min-height: 180px;
  }
}

</style>