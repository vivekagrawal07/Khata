<template>
  <NavBar/>
  <div class="dashboard-page">
    <div class="container">
      <template v-if="loading">
        <div class="skeleton-hero">
          <div class="skeleton-hero-content">
            <div class="skeleton skeleton-headline"></div>
            <div class="skeleton skeleton-paragraph"></div>
          </div>
          <div class="skeleton-hero-illustration skeleton"></div>
        </div>
        <div class="skeleton-stats">
          <div class="skeleton skeleton-stat-card" v-for="n in 4" :key="n"></div>
        </div>
        <div class="skeleton-features">
          <div class="skeleton skeleton-feature-card" v-for="n in 3" :key="n"></div>
        </div>
      </template>
      <template v-else>
        <div>
          <div class="hero-section">
            <div class="hero-content">
              <h1 class="hero-headline">
                <span class="headline-animate">Empower Your Business</span>
              </h1>
              <p class="hero-paragraph">Streamline your invoicing, track your growth, and focus on what matters most. <span class="highlight">Khata</span> helps you manage your business with ease and confidence.</p>
            </div>
            <div class="hero-illustration">
              <!-- Simple SVG illustration for business theme -->
              <svg width="180" height="140" viewBox="0 0 180 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="20" y="40" width="140" height="80" rx="16" fill="#ffd700" fill-opacity="0.15"/>
                <rect x="40" y="60" width="100" height="40" rx="8" fill="#ff6f91" fill-opacity="0.18"/>
                <rect x="60" y="80" width="60" height="20" rx="4" fill="#b3baf7" fill-opacity="0.22"/>
                <circle cx="90" cy="60" r="10" fill="#ffd700" fill-opacity="0.5"/>
                <rect x="80" y="30" width="20" height="20" rx="4" fill="#ff6f91" fill-opacity="0.4"/>
              </svg>
            </div>
          </div>
          <div class="dashboard-stats animated-stats">
            <div class="stat-card" v-for="stat in statList" :key="stat.label">
              <div class="stat-icon" :style="{background: stat.bg}">{{ stat.icon }}</div>
              <div class="stat-content">
                <h3 class="stat-animate">{{ stat.value }}</h3>
                <p>{{ stat.label }}</p>
              </div>
            </div>
          </div>
          <div class="features-section">
            <div class="features-grid">
              <div class="feature-card">
                <div class="feature-icon">🧾</div>
                <h3 class="feature-title">Easy Invoicing</h3>
                <p class="feature-desc">Create and send professional invoices in seconds with a few clicks. <span class="feature-animate"></span></p>
              </div>
              <div class="feature-card">
                <div class="feature-icon">📊</div>
                <h3 class="feature-title">Smart Analytics</h3>
                <p class="feature-desc">Track your revenue, clients, and growth with beautiful, real-time analytics. <span class="feature-animate"></span></p>
              </div>
              <div class="feature-card">
                <div class="feature-icon">🔒</div>
                <h3 class="feature-title">Secure Data</h3>
                <p class="feature-desc">Your business data is encrypted and protected with industry best practices. <span class="feature-animate"></span></p>
              </div>
            </div>
          </div>
          <!-- Removed Recent Invoices section as per user request -->
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import apiService from '../services/api.js'
import NavBar from '../components/NavBar.vue'

export default {
  name: 'DashboardPage',
  components: {
    NavBar
  },
  data() {
    return {
      invoices: [],
      loading: true
    }
  },
  computed: {
    userFirstName() {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      return user.firstName || 'User'
    },
    totalInvoices() {
      return this.invoices.length
    },
    totalRevenue() {
      return this.invoices.reduce((sum, invoice) => sum + (invoice.totalAmount || 0), 0)
    },
    pendingInvoices() {
      return this.invoices.filter(invoice => invoice.status === 'sent' || invoice.status === 'draft').length
    },
    paidInvoices() {
      return this.invoices.filter(invoice => invoice.status === 'paid').length
    },
    recentInvoices() {
      return this.invoices.slice(0, 5) // Show only 5 most recent
    },
    statList() {
      return [
        {
          label: 'Total Invoices',
          value: this.totalInvoices,
          icon: '📄',
          bg: 'linear-gradient(135deg, #ffd700 0%, #ff6f91 100%)'
        },
        {
          label: 'Total Revenue',
          value: `$${this.totalRevenue.toFixed(2)}`,
          icon: '💰',
          bg: 'linear-gradient(135deg, #ff6f91 0%, #ffd700 100%)'
        },
        {
          label: 'Pending Invoices',
          value: this.pendingInvoices,
          icon: '⏳',
          bg: 'linear-gradient(135deg, #b3baf7 0%, #ffd700 100%)'
        },
        {
          label: 'Paid Invoices',
          value: this.paidInvoices,
          icon: '✅',
          bg: 'linear-gradient(135deg, #ffd700 0%, #b3baf7 100%)'
        }
      ]
    }
  },
  mounted() {
    this.loadInvoices()
  },
  methods: {
    async loadInvoices() {
      try {
        const response = await apiService.getInvoices()
        const rawInvoices = response.invoices || response || []
        // Map backend fields to frontend fields for dashboard use
        this.invoices = rawInvoices.map(inv => ({
          id: inv.id,
          clientName: inv.client_name || (inv.first_name && inv.last_name ? inv.first_name + ' ' + inv.last_name : ''),
          createdAt: inv.created_at,
          totalAmount: Number(inv.total_amount),
          status: inv.status,
          // Add any other fields needed for dashboard
        }))
      } catch (error) {
        console.error('Error loading invoices:', error)
        this.invoices = []
      } finally {
        this.loading = false
      }
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString()
    },
    getStatusClass(status) {
      switch (status) {
        case 'paid': return 'status-paid'
        case 'sent': return 'status-sent'
        case 'draft': return 'status-draft'
        default: return 'status-draft'
      }
    }
  }
}
</script>

<style scoped>
.dashboard-page {
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.wave {
  display: inline-block;
  animation: waveAnim 1.5s infinite;
  transform-origin: 70% 70%;
}
@keyframes waveAnim {
  0%, 60%, 100% { transform: rotate(0deg); }
  10%, 30% { transform: rotate(-18deg); }
  20% { transform: rotate(14deg); }
  40% { transform: rotate(8deg); }
  50% { transform: rotate(-8deg); }
}
.page-header p {
  color: #5c6bc0;
  font-size: 1.15rem;
  margin-bottom: 0;
}
.animated-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2rem;
  margin-bottom: 2.5rem;
}
.stat-card {
  background: linear-gradient(90deg, #fffbe7 0%, #f8fafc 100%);
  border-radius: 1rem;
  padding: 2rem 1.5rem;
  box-shadow: 0 4px 24px rgba(255, 215, 0, 0.10);
  display: flex;
  align-items: center;
  gap: 1.25rem;
  transition: box-shadow 0.2s, transform 0.2s;
  border: 1px solid #ffd70044;
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
  font-size: 2.5rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.10);
}
.stat-content h3 {
  font-size: 2rem;
  font-weight: 700;
  color: #1a237e;
  margin: 0 0 0.25rem 0;
  animation: statPop 1.2s cubic-bezier(.68,-0.55,.27,1.55);
}
@keyframes statPop {
  0% { transform: scale(0.7); opacity: 0; }
  60% { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(1); }
}
.stat-content p {
  color: #5c6bc0;
  margin: 0;
  font-size: 1rem;
}
.dashboard-cards, .business-summary, .dashboard-progress, .dashboard-quote, .dashboard-timeline { display: none; }
.hero-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2.5rem;
  margin-bottom: 2.5rem;
  background: linear-gradient(120deg, #fffbe7 0%, #f8fafc 100%);
  border-radius: 1.2rem;
  box-shadow: 0 8px 32px rgba(255, 215, 0, 0.10);
  padding: 2.5rem 2rem;
  animation: fadeIn 1.2s;
}
.hero-content {
  flex: 1 1 320px;
}
.hero-headline {
  font-size: 2.5rem;
  font-weight: 900;
  color: #1a237e;
  margin-bottom: 1.2rem;
  background: linear-gradient(90deg, #ff6f91 0%, #ffd700 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.headline-animate {
  display: inline-block;
  animation: headlinePop 1.2s cubic-bezier(.68,-0.55,.27,1.55);
}
@keyframes headlinePop {
  0% { transform: scale(0.7); opacity: 0; }
  60% { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(1); }
}
.hero-paragraph {
  font-size: 1.18rem;
  color: #3949ab;
  font-weight: 600;
  margin-bottom: 0;
  animation: fadeInUp 1.2s;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.hero-illustration {
  flex: 0 0 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 1.2s;
}
.highlight {
  color: #ff6f91;
  font-weight: 900;
}
.features-section {
  margin: 2.5rem 0 1.5rem 0;
  display: flex;
  justify-content: center;
  align-items: stretch;
  min-height: 220px;
}
.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
  width: 100%;
  max-width: 1000px;
}
.feature-card {
  background: linear-gradient(120deg, #fffbe7 0%, #f8fafc 100%);
  border-radius: 1.2rem;
  box-shadow: 0 8px 32px rgba(255, 215, 0, 0.10);
  padding: 2.2rem 1.5rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: box-shadow 0.25s, transform 0.2s;
  animation: featurePop 1.1s cubic-bezier(.68,-0.55,.27,1.55);
  min-height: 220px;
}
.feature-card:hover {
  box-shadow: 0 12px 40px rgba(255, 215, 0, 0.18);
  transform: translateY(-6px) scale(1.04);
}
@keyframes featurePop {
  0% { transform: scale(0.7); opacity: 0; }
  60% { transform: scale(1.08); opacity: 1; }
  100% { transform: scale(1); }
}
.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #ffd700 0%, #ff6f91 100%);
  color: #fff;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.10);
}
.feature-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: #1a237e;
  margin-bottom: 0.5rem;
  background: linear-gradient(90deg, #ff6f91 0%, #ffd700 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.feature-desc {
  font-size: 1.08rem;
  color: #3949ab;
  font-weight: 600;
  margin-bottom: 0;
  position: relative;
  animation: fadeInUp 1.2s;
}
.feature-animate {
  display: inline-block;
  width: 10px;
  height: 10px;
  background: linear-gradient(135deg, #ffd700 0%, #ff6f91 100%);
  border-radius: 50%;
  margin-left: 0.5rem;
  animation: pulse 1.2s infinite alternate;
}
@keyframes pulse {
  from { transform: scale(1); opacity: 0.7; }
  to { transform: scale(1.3); opacity: 1; }
}
@media (max-width: 900px) {
  .hero-section {
    flex-direction: column;
    gap: 1.5rem;
    padding: 1.2rem;
  }
  .features-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  .features-section {
    min-height: 0;
  }
}
@media (max-width: 600px) {
  .hero-section {
    padding: 0.7rem;
  }
  .hero-headline {
    font-size: 1.5rem;
  }
  .hero-illustration {
    flex: 0 0 120px;
  }
}
.skeleton {
  background: linear-gradient(90deg, #f8fafc 25%, #e3e9f7 50%, #f8fafc 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.2s infinite linear;
  border-radius: 0.7rem;
}
@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
.skeleton-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2.5rem;
  margin-bottom: 2.5rem;
  background: linear-gradient(120deg, #fffbe7 0%, #f8fafc 100%);
  border-radius: 1.2rem;
  box-shadow: 0 8px 32px rgba(255, 215, 0, 0.10);
  padding: 2.5rem 2rem;
}
.skeleton-hero-content {
  flex: 1 1 320px;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.skeleton-headline {
  width: 260px;
  height: 36px;
}
.skeleton-paragraph {
  width: 220px;
  height: 20px;
}
.skeleton-hero-illustration {
  flex: 0 0 180px;
  width: 180px;
  height: 140px;
}
.skeleton-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin-bottom: 2.5rem;
}
.skeleton-stat-card {
  height: 90px;
  border-radius: 1rem;
}
.skeleton-features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
  width: 100%;
  max-width: 1000px;
  margin: 2.5rem 0 1.5rem 0;
}
.skeleton-feature-card {
  height: 160px;
  border-radius: 1.2rem;
}
@media (max-width: 900px) {
  .skeleton-stats {
    grid-template-columns: 1fr 1fr;
  }
  .skeleton-features {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
@media (max-width: 600px) {
  .skeleton-hero {
    flex-direction: column;
    gap: 1.5rem;
    padding: 1.2rem;
  }
  .skeleton-headline {
    width: 160px;
    height: 24px;
  }
  .skeleton-paragraph {
    width: 120px;
    height: 16px;
  }
  .skeleton-hero-illustration {
    width: 120px;
    height: 90px;
  }
}
</style> 