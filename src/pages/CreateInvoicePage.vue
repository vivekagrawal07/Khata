<template>
  <NavBar />
  <div class="create-invoice-page">
    <div class="container">
      <div class="page-header">
        <h1>Create Invoice</h1>
        <p>Fill in the details to generate a new invoice</p>
      </div>
      <SkeletonLoader v-if="loading" type="form" :fields="7" />
      <div v-else>
        <!-- Existing invoice form content -->
        <InvoiceForm @save="createInvoice" />
      </div>
    </div>
  </div>
</template>

<script>
import InvoiceForm from '../components/InvoiceForm.vue'
import SkeletonLoader from '../components/SkeletonLoader.vue'
import apiService from '../services/api.js'
import NavBar from '../components/NavBar.vue'
export default {
  name: 'CreateInvoicePage',
  components: {
    NavBar,
    InvoiceForm,
    SkeletonLoader
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    async createInvoice(invoiceData) {
      try {
        console.log('Payload sent to API:', invoiceData)
        // Call the real API
        const response = await apiService.createInvoice(invoiceData)
        console.log('Invoice creation response:', response)
        
        // Show success message
        alert('Invoice created successfully!')
        
        // Redirect to invoice list page
        this.$router.push('/invoices')
      } catch (error) {
        console.error('Error creating invoice:', error)
        alert(error.message || 'Error creating invoice. Please try again.')
      }
    }
  }
}
</script>

<style scoped>
.create-invoice-page {
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

.container {
  max-width: 700px;
  margin: 0 auto;
  background: rgba(255,255,255,0.97);
  border-radius: 1.2rem;
  box-shadow: 0 8px 32px rgba(255, 111, 145, 0.10);
  padding: 2rem;
  animation: fadeIn 1.2s;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.98); }
  to { opacity: 1; transform: scale(1); }
}

.form-card {
  background: linear-gradient(90deg, #fffbe7 0%, #f8fafc 100%);
  border-radius: 1rem;
  box-shadow: 0 2px 12px rgba(255, 215, 0, 0.08);
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  transition: box-shadow 0.25s, transform 0.2s;
  animation: fadeInUp 0.7s;
}

.form-card:hover {
  box-shadow: 0 8px 32px rgba(255, 215, 0, 0.18);
  transform: translateY(-4px) scale(1.02);
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 900px) {
  .container {
    padding: 1rem;
  }
}
@media (max-width: 600px) {
  .create-invoice-page {
    padding: 1rem 0;
  }
  .container {
    padding: 0.5rem;
  }
}
</style> 