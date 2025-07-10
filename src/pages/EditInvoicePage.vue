<template>
  <div class="edit-invoice-page">
    <div class="container">
      <div class="page-header">
        <h1>Edit Invoice</h1>
        <p>Update the invoice details below</p>
      </div>
      <SkeletonLoader v-if="loading" type="form" :fields="7" />
      <div v-else>
        <!-- Existing invoice form content -->
        <InvoiceForm :invoice="invoice" :isEditing="true" @save="updateInvoice" />
      </div>
    </div>
  </div>
</template>

<script>
import InvoiceForm from '../components/InvoiceForm.vue'
import SkeletonLoader from '../components/SkeletonLoader.vue'
import apiService from '../services/api.js'

export default {
  name: 'EditInvoicePage',
  components: {
    InvoiceForm,
    SkeletonLoader
  },
  data() {
    return {
      invoice: null,
      loading: true
    }
  },
  mounted() {
    this.loadInvoice()
  },
  methods: {
    async loadInvoice() {
      try {
        const invoiceId = this.$route.params.id
        console.log('Loading invoice with ID:', invoiceId)
        
        // Fetch invoice data
        const response = await apiService.getInvoice(invoiceId)
        console.log('Invoice API Response:', response)
        console.log('Invoice Response Keys:', Object.keys(response || {}))
        this.invoice = response.invoice || response
        
        // Check if items are already in the invoice response
        console.log('Invoice object keys:', Object.keys(this.invoice || {}))
        console.log('Invoice object:', this.invoice)
        
        // Handle items stored as JSON string in the items field
        if (this.invoice && this.invoice.items) {
          console.log('Raw items field:', this.invoice.items)
          console.log('Items field type:', typeof this.invoice.items)
          
          try {
            // Try to parse items as JSON if it's a string
            if (typeof this.invoice.items === 'string') {
              const parsedItems = JSON.parse(this.invoice.items)
              console.log('Parsed items from JSON:', parsedItems)
              this.invoice.items = Array.isArray(parsedItems) ? parsedItems : []
            } else if (Array.isArray(this.invoice.items)) {
              // Items are already an array
              console.log('Items already an array:', this.invoice.items)
            } else {
              // Items is neither string nor array, set to empty array
              console.log('Items field is not string or array, setting to empty array')
              this.invoice.items = []
            }
          } catch (parseError) {
            console.warn('Error parsing items JSON:', parseError)
            this.invoice.items = []
          }
        } else {
          console.log('No items field found, setting to empty array')
          this.invoice.items = []
        }
        
        console.log('Final invoice data with items:', this.invoice)
        
        if (!this.invoice) {
          console.error('Invoice not found:', invoiceId)
        }
      } catch (error) {
        console.error('Error loading invoice:', error)
        alert(error.message || 'Error loading invoice. Please try again.')
      } finally {
        this.loading = false
      }
    },
    async updateInvoice(updatedInvoice) {
      try {
        console.log('Update invoice called with:', updatedInvoice)
        console.log('Invoice ID from form:', updatedInvoice.id)
        console.log('Route params ID:', this.$route.params.id)
        
        // Use the ID from the form, or fallback to route parameter
        const invoiceId = updatedInvoice.id || this.$route.params.id
        
        if (!invoiceId) {
          throw new Error('Invoice ID is missing')
        }
        
        console.log('Using invoice ID for update:', invoiceId)
        await apiService.updateInvoice(invoiceId, updatedInvoice)
        
        alert('Invoice updated successfully!')
        this.$router.push('/invoices')
      } catch (error) {
        console.error('Error updating invoice:', error)
        alert(error.message || 'Error updating invoice. Please try again.')
      }
    }
  }
}
</script>

<style scoped>
.edit-invoice-page {
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
  background: linear-gradient(90deg, #ffd700 0%, #ff6f91 100%);
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
  .container {
    padding: 1rem;
  }
}
@media (max-width: 600px) {
  .edit-invoice-page {
    padding: 1rem 0;
  }
  .container {
    padding: 0.5rem;
  }
}
</style> 