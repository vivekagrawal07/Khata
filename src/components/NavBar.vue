<template>
  <nav class="navbar">
    <div class="container">
      <div class="navbar-brand">
        <router-link :to="isAuthenticated ? '/dashboard' : '/'" class="logo">
          <span class="logo-text">khata</span>
        </router-link>
      </div>
      
      <!-- Mobile Menu Toggle -->
      <div class="navbar-toggle" @click="toggleMenu" :class="{ 'active': isMenuOpen }">
        <span></span>
        <span></span>
        <span></span>
      </div>
      
      <!-- Desktop Menu -->
      <div v-if="!landing" class="navbar-menu desktop-menu" :class="{ 'active': isMenuOpen }">
        <router-link v-if="isAuthenticated" to="/dashboard" class="nav-link" @click="closeMenu">Home</router-link>
        <router-link v-if="isAuthenticated" to="/create" class="nav-link" @click="closeMenu">Create Invoice</router-link>
        <router-link v-if="isAuthenticated" to="/invoices" class="nav-link" @click="closeMenu">Invoices</router-link>
        <router-link v-if="isAuthenticated" to="/history" class="nav-link" @click="closeMenu">History</router-link>
      </div>
      
      <!-- Mobile Menu Overlay -->
      <div v-if="!landing && isMenuOpen" class="mobile-menu-overlay" @click="closeMenu"></div>
      
      <!-- Mobile Menu -->
      <div v-if="!landing" class="mobile-menu" :class="{ 'active': isMenuOpen }">
        <div class="mobile-menu-header">
          <span class="mobile-menu-title">Menu</span>
          <button class="mobile-menu-close" @click="closeMenu">×</button>
        </div>
        <div class="mobile-menu-links">
          <router-link v-if="isAuthenticated" to="/dashboard" class="mobile-nav-link" @click="closeMenu">
            <span class="mobile-nav-icon">🏠</span>
            Home
          </router-link>
          <router-link v-if="isAuthenticated" to="/create" class="mobile-nav-link" @click="closeMenu">
            <span class="mobile-nav-icon">➕</span>
            Create Invoice
          </router-link>
          <router-link v-if="isAuthenticated" to="/invoices" class="mobile-nav-link" @click="closeMenu">
            <span class="mobile-nav-icon">📄</span>
            Invoices
          </router-link>
          <router-link v-if="isAuthenticated" to="/history" class="mobile-nav-link" @click="closeMenu">
            <span class="mobile-nav-icon">📊</span>
            History
          </router-link>
        </div>
      </div>
      
      <div class="navbar-auth">
        <div v-if="landing || !isAuthenticated" class="auth-buttons">
          <router-link to="/login" class="btn btn-outline" @click="closeMenu">Login</router-link>
          <router-link to="/register" class="btn btn-primary" @click="closeMenu">Sign Up</router-link>
        </div>
        <div v-else class="user-menu">
          <div class="user-info" @click="toggleUserMenu">
            <span class="user-avatar">{{ userInitials }}</span>
            <span class="user-name">{{ userFirstName }}</span>
            <span class="dropdown-arrow">▼</span>
          </div>
          <div v-if="isUserMenuOpen" class="user-dropdown">
            <router-link to="/profile" class="dropdown-item" @click="closeUserMenu">
              <span class="dropdown-icon">👤</span>
              Profile
            </router-link>
            <button @click="logout" class="dropdown-item">
              <span class="dropdown-icon">🚪</span>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import apiService from '../services/api.js'

export default {
  name: 'NavBar',
  props: {
    landing: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isMenuOpen: false,
      isUserMenuOpen: false
    }
  },
  computed: {
    isAuthenticated() {
      return apiService.isAuthenticated()
    },
    user() {
      const userStr = localStorage.getItem('user')
      return userStr ? JSON.parse(userStr) : null
    },
    userFirstName() {
      return this.user?.firstName || 'User'
    },
    userFullName() {
      if (!this.user) return 'User'
      return `${this.user.firstName} ${this.user.lastName}`
    },
    userEmail() {
      return this.user?.email || ''
    },
    userInitials() {
      if (!this.user) return 'U'
      return `${this.user.firstName?.[0] || ''}${this.user.lastName?.[0] || ''}`.toUpperCase()
    }
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen
      if (this.isMenuOpen) {
        this.isUserMenuOpen = false
      }
    },
    closeMenu() {
      this.isMenuOpen = false
    },
    toggleUserMenu() {
      this.isUserMenuOpen = !this.isUserMenuOpen
    },
    closeUserMenu() {
      this.isUserMenuOpen = false
    },
    logout() {
      // Clear authentication data
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      
      // Redirect to landing page
      this.$router.push('/')
    }
  },
  mounted() {
    // Close user menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.user-menu')) {
        this.isUserMenuOpen = false
      }
    })
  }
}
</script>

<style scoped>
.navbar {
  background: linear-gradient(90deg, #1a237e 0%, #5c6bc0 100%);
  background-size: 200% 200%;
  animation: gradientMove 6s ease-in-out infinite;
  box-shadow: 0 4px 24px rgba(30, 34, 90, 0.12);
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: box-shadow 0.3s;
}

@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.navbar .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
}

.navbar-brand {
  display: flex;
  align-items: center;
  z-index: 1002;
}

.logo {
  text-decoration: none;
  color: #fff;
  font-size: 2.2rem;
  font-weight: 900;
  letter-spacing: -1px;
  text-shadow: 0 4px 16px rgba(30, 34, 90, 0.18);
  transition: transform 0.2s;
}

.logo:hover {
  transform: scale(1.08) rotate(-2deg);
  filter: brightness(1.2);
}

.logo-text {
  background: linear-gradient(45deg, #fff, #ffd700, #b3baf7, #ff6f91);
  background-size: 200% 200%;
  animation: logoGradient 4s linear infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

@keyframes logoGradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.navbar-menu {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  text-decoration: none;
  color: #e3e9f7;
  font-weight: 700;
  padding: 0.5rem 1.25rem;
  border-radius: 0.7rem;
  transition: background 0.25s, color 0.25s, box-shadow 0.25s, transform 0.2s;
  font-size: 1.15rem;
  position: relative;
  overflow: hidden;
}

.nav-link::before {
  content: '';
  position: absolute;
  left: 0; top: 0; right: 0; bottom: 0;
  background: linear-gradient(90deg, #ffd700 0%, #ff6f91 100%);
  opacity: 0;
  z-index: 0;
  transition: opacity 0.3s;
}

.nav-link:hover, .nav-link.router-link-active {
  color: #1a237e;
  background: #fff;
  box-shadow: 0 2px 12px rgba(255, 215, 0, 0.10);
  transform: translateY(-2px) scale(1.04);
}

.nav-link:hover::before, .nav-link.router-link-active::before {
  opacity: 0.12;
}

.navbar-auth {
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 1002;
}

.auth-buttons {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-outline {
  padding: 0.5rem 1.25rem;
  font-size: 1rem;
  border: 2px solid #ffd700;
  color: #ffd700;
  background: none;
  border-radius: 0.7rem;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  text-decoration: none;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.08);
}

.btn-outline:hover {
  background: #ffd700;
  color: #1a237e;
  box-shadow: 0 4px 16px rgba(255, 215, 0, 0.18);
}

.btn-primary {
  padding: 0.5rem 1.25rem;
  font-size: 1rem;
  border: none;
  color: #fff;
  background: linear-gradient(90deg, #ff6f91 0%, #ffd700 100%);
  border-radius: 0.7rem;
  font-weight: 900;
  transition: background 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(255, 111, 145, 0.10);
}

.btn-primary:hover {
  background: linear-gradient(90deg, #ffd700 0%, #ff6f91 100%);
  color: #1a237e;
  box-shadow: 0 4px 16px rgba(255, 111, 145, 0.18);
}

.user-menu {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 0.7rem;
  transition: background 0.2s, box-shadow 0.2s;
  color: #fff;
  background: rgba(255,255,255,0.04);
}

.user-info:hover {
  background: #ffd70022;
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.10);
}

.user-avatar {
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(135deg, #ffd700 0%, #ff6f91 100%);
  color: #1a237e;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 900;
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.18);
  border: 2px solid #fff;
  transition: box-shadow 0.2s;
}

.user-name {
  font-weight: 800;
  color: #fff;
  font-size: 1.1rem;
  letter-spacing: 0.5px;
}

.dropdown-arrow {
  font-size: 0.95rem;
  color: #ffd700;
}

.user-dropdown {
  position: absolute;
  top: 110%;
  right: 0;
  background: #fff;
  border: 1px solid #e3e9f7;
  border-radius: 0.7rem;
  box-shadow: 0 8px 32px rgba(30, 34, 90, 0.18);
  z-index: 1001;
  min-width: 180px;
  padding: 0.5rem 0;
  margin-top: 0.5rem;
  animation: dropdownFade 0.3s;
}

@keyframes dropdownFade {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  text-decoration: none;
  color: #1a237e;
  font-weight: 700;
  font-size: 1.08rem;
  transition: background 0.2s, color 0.2s, transform 0.2s;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  border-radius: 0.5rem;
}

.dropdown-item:hover {
  background: #ffd70022;
  color: #ff6f91;
  transform: translateX(4px) scale(1.03);
}

.dropdown-icon {
  font-size: 1.1rem;
}

/* Mobile Menu Toggle */
.navbar-toggle {
  display: none;
  flex-direction: column;
  cursor: pointer;
  padding: 0.5rem;
  z-index: 1002;
  transition: all 0.3s ease;
}

.navbar-toggle span {
  width: 25px;
  height: 3px;
  background: #fff;
  margin: 3px 0;
  border-radius: 2px;
  transition: all 0.3s ease;
  transform-origin: center;
}

.navbar-toggle.active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.navbar-toggle.active span:nth-child(2) {
  opacity: 0;
}

.navbar-toggle.active span:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

/* Mobile Menu Overlay */
.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Mobile Menu */
.mobile-menu {
  position: fixed;
  top: 0;
  right: -300px;
  width: 300px;
  height: 100vh;
  background: linear-gradient(135deg, #1a237e 0%, #5c6bc0 100%);
  z-index: 1001;
  transition: right 0.3s ease;
  box-shadow: -4px 0 24px rgba(30, 34, 90, 0.2);
  overflow-y: auto;
}

.mobile-menu.active {
  right: 0;
}

.mobile-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 1.5rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.mobile-menu-title {
  color: #fff;
  font-size: 1.5rem;
  font-weight: 900;
  letter-spacing: 1px;
}

.mobile-menu-close {
  background: none;
  border: none;
  color: #fff;
  font-size: 2rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background 0.2s;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-menu-close:hover {
  background: rgba(255, 255, 255, 0.1);
}

.mobile-menu-links {
  padding: 1rem 0;
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  color: #e3e9f7;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.1rem;
  transition: all 0.2s;
  border-left: 3px solid transparent;
}

.mobile-nav-link:hover,
.mobile-nav-link.router-link-active {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border-left-color: #ffd700;
  transform: translateX(5px);
}

.mobile-nav-icon {
  font-size: 1.3rem;
  width: 24px;
  text-align: center;
}

/* Responsive Breakpoints */
@media (max-width: 1200px) {
  .navbar .container {
    padding: 1rem 1.5rem;
  }
  
  .navbar-menu {
    gap: 1.5rem;
  }
  
  .nav-link {
    padding: 0.5rem 1rem;
    font-size: 1.1rem;
  }
}

@media (max-width: 1024px) {
  .navbar .container {
    padding: 1rem;
  }
  
  .navbar-menu {
    gap: 1rem;
  }
  
  .nav-link {
    padding: 0.5rem 0.8rem;
    font-size: 1rem;
  }
  
  .logo {
    font-size: 2rem;
  }
  
  .user-name {
    font-size: 1rem;
  }
}

@media (max-width: 768px) {
  .navbar .container {
    padding: 0.8rem 1rem;
  }
  
  .desktop-menu {
    display: none;
  }
  
  .navbar-toggle {
    display: flex;
  }
  
  .logo {
    font-size: 1.8rem;
  }
  
  .auth-buttons {
    gap: 0.5rem;
  }
  
  .btn-outline,
  .btn-primary {
    padding: 0.4rem 1rem;
    font-size: 0.9rem;
  }
  
  .user-info {
    padding: 0.4rem 0.8rem;
  }
  
  .user-avatar {
    width: 2.2rem;
    height: 2.2rem;
    font-size: 1.1rem;
  }
  
  .user-name {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .navbar .container {
    padding: 0.6rem 0.8rem;
  }
  
  .logo {
    font-size: 1.6rem;
  }
  
  .auth-buttons {
    flex-direction: column;
    gap: 0.3rem;
  }
  
  .btn-outline,
  .btn-primary {
    padding: 0.3rem 0.8rem;
    font-size: 0.8rem;
  }
  
  .user-info {
    padding: 0.3rem 0.6rem;
  }
  
  .user-avatar {
    width: 2rem;
    height: 2rem;
    font-size: 1rem;
  }
  
  .user-name {
    display: none;
  }
  
  .mobile-menu {
    width: 280px;
    right: -280px;
  }
}

@media (max-width: 360px) {
  .navbar .container {
    padding: 0.5rem 0.6rem;
  }
  
  .logo {
    font-size: 1.4rem;
  }
  
  .auth-buttons {
    gap: 0.2rem;
  }
  
  .btn-outline,
  .btn-primary {
    padding: 0.25rem 0.6rem;
    font-size: 0.75rem;
  }
  
  .mobile-menu {
    width: 260px;
    right: -260px;
  }
}
</style> 