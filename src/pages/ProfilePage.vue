<template>
  <NavBar />
  <div class="profile-page">
    <div class="container">
      <div class="page-header">
        <h1>Profile</h1>
        <p>Manage your account and business details</p>
      </div>
      <SkeletonLoader v-if="loading" type="profile" />
      <div v-else>
        <div class="profile-section">
          <h2>Profile Information</h2>
          <ProfileForm 
            :profile="profile" 
            @save="updateProfile"
            :loading="updating"
          />
        </div>
        
        <div class="profile-section">
          <h2>Account Statistics</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">📄</div>
              <div class="stat-content">
                <h3>{{ totalInvoices }}</h3>
                <p>Total Invoices</p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">💰</div>
              <div class="stat-content">
                <h3>${{ totalRevenue.toFixed(2) }}</h3>
                <p>Total Revenue</p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">✅</div>
              <div class="stat-content">
                <h3>{{ paidInvoices }}</h3>
                <p>Paid Invoices</p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">⏳</div>
              <div class="stat-content">
                <h3>{{ pendingInvoices }}</h3>
                <p>Pending Invoices</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '../components/NavBar.vue'
import ProfileForm from '../components/ProfileForm.vue'
import SkeletonLoader from '../components/SkeletonLoader.vue'
import apiService from '../services/api.js'

export default {
  name: 'ProfilePage',
  components: {
    NavBar,
    ProfileForm,
    SkeletonLoader
  },
  data() {
    return {
      profile: null,
      loading: true,
      updating: false,
      error: null,
      totalInvoices: 0,
      totalRevenue: 0,
      paidInvoices: 0,
      pendingInvoices: 0
    }
  },
  mounted() {
    this.loadProfile()
    this.loadStats()
  },
  methods: {
    async loadProfile() {
      this.loading = true
      this.error = null
      
      try {
        const response = await apiService.getProfile()
        console.log('Profile API Response:', response)
        this.profile = response.user || response.profile || response
      } catch (error) {
        console.error('Error loading profile:', error)
        this.error = error.message || 'Failed to load profile'
      } finally {
        this.loading = false
      }
    },
    
    async loadStats() {
      try {
        const response = await apiService.getInvoices()
        const invoices = response.invoices || response || []
        
        this.totalInvoices = invoices.length
        this.totalRevenue = invoices.reduce((sum, inv) => sum + (Number(inv.total_amount) || 0), 0)
        this.paidInvoices = invoices.filter(inv => inv.status === 'paid').length
        this.pendingInvoices = invoices.filter(inv => inv.status === 'sent' || inv.status === 'draft').length
      } catch (error) {
        console.error('Error loading stats:', error)
      }
    },
    
    async updateProfile(profileData) {
      this.updating = true
      
      try {
        console.log('Updating profile with:', profileData)
        const response = await apiService.updateProfile(profileData)
        console.log('Profile update response:', response)
        
        // Update local profile data
        this.profile = { ...this.profile, ...profileData }
        
        // Update user data in localStorage if needed
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        const updatedUser = { ...user, ...profileData }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        
        alert('Profile updated successfully!')
      } catch (error) {
        console.error('Error updating profile:', error)
        alert(error.message || 'Failed to update profile')
      } finally {
        this.updating = false
      }
    }
  }
}
</script>

<style scoped>
.profile-page {
  padding: 2rem 0;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #ffd700 100%);
  background-size: 200% 200%;
  animation: bgMove 10s ease-in-out infinite;
}

@keyframes bgMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.page-header {
  text-align: left;
  margin-bottom: 2.5rem;
  padding-left: 1rem;
  animation: fadeInDown 0.8s;
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-30px); }
  to { opacity: 1; transform: translateY(0); }
}

.page-header h1 {
  color: #1a237e;
  margin-bottom: 0.25rem;
  font-size: 2.5rem;
  font-weight: 800;
  letter-spacing: -1px;
  background: linear-gradient(90deg, #ff6f91 0%, #ffd700 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-header p {
  color: #5c6bc0;
  font-size: 1.15rem;
  margin-bottom: 0;
}

.profile-content {
  max-width: 800px;
  margin: 0 auto;
}

.profile-section {
  background: rgba(255,255,255,0.97);
  border-radius: 1.2rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(255, 215, 0, 0.12);
  animation: fadeIn 1.2s;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.98); }
  to { opacity: 1; transform: scale(1); }
}

.profile-section h2 {
  color: #1a237e;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #ffd700;
  padding-bottom: 0.5rem;
  background: linear-gradient(90deg, #ffd700 0%, #ff6f91 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: linear-gradient(90deg, #fffbe7 0%, #f8fafc 100%);
  border-radius: 0.8rem;
  border: 1px solid #ffd70044;
  box-shadow: 0 2px 12px rgba(255, 215, 0, 0.08);
  transition: box-shadow 0.25s, transform 0.2s;
  animation: fadeInUp 0.7s;
}

.stat-card:hover {
  box-shadow: 0 8px 32px rgba(255, 215, 0, 0.18);
  transform: translateY(-4px) scale(1.03);
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.stat-icon {
  font-size: 2rem;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ffd700 0%, #ff6f91 100%);
  color: #fff;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.10);
}

.stat-content h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a237e;
  margin: 0 0 0.25rem 0;
}

.stat-content p {
  color: #5c6bc0;
  margin: 0;
  font-size: 0.9rem;
}

.loading,
.error {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.loading p,
.error p {
  font-size: 1.2rem;
  color: #6c757d;
  margin-bottom: 1rem;
}

.error .btn {
  margin-top: 1rem;
}

@media (max-width: 900px) {
  .profile-section {
    padding: 1.5rem;
  }
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
  }
  .stat-card {
    padding: 1rem;
  }
}
@media (max-width: 600px) {
  .profile-page {
    padding: 1rem 0;
  }
  .profile-section {
    padding: 1rem;
  }
}
</style> 