<template>
  <form @submit.prevent="handleSubmit" class="invoice-form">
    <div class="form-section">
      <h3>Invoice Details</h3>
      
      <div class="form-row">
        <div class="form-group">
          <label for="client_name" class="form-label">Client Name *</label>
          <input
            id="client_name"
            v-model="form.client_name"
            type="text"
            class="form-control"
            required
            placeholder="Enter client name"
          />
        </div>
        
        <div class="form-group">
          <label for="client_email" class="form-label">Client Email</label>
          <input
            id="client_email"
            v-model="form.client_email"
            type="email"
            class="form-control"
            placeholder="Enter client email"
          />
        </div>
      </div>

      <div class="form-group">
        <label for="client_address" class="form-label">Client Address</label>
        <textarea
          id="client_address"
          v-model="form.client_address"
          class="form-control"
          rows="3"
          placeholder="Enter client address"
        ></textarea>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="invoice_date" class="form-label">Invoice Date *</label>
          <input
            id="invoice_date"
            v-model="form.invoice_date"
            type="date"
            class="form-control"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="due_date" class="form-label">Due Date</label>
          <input
            id="due_date"
            v-model="form.due_date"
            type="date"
            class="form-control"
          />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="tax_rate" class="form-label">Tax Rate (%)</label>
          <input
            id="tax_rate"
            v-model.number="form.tax_rate"
            type="number"
            class="form-control"
            min="0"
            max="100"
            step="0.01"
            placeholder="10.00"
          />
        </div>
        
        <div class="form-group">
          <label for="status" class="form-label">Status</label>
          <select id="status" v-model="form.status" class="form-control">
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>
    </div>

    <div class="form-section">
      <div class="section-header">
        <h3>Items</h3>
        <button type="button" @click="addItem" class="btn btn-success">
          + Add Item
        </button>
      </div>
      
      <div class="items-container">
        <div v-for="(item, index) in form.items" :key="index" class="item-row">
          <div class="item-description">
            <label :for="`description-${index}`" class="form-label">Description</label>
            <input
              :id="`description-${index}`"
              v-model="item.description"
              type="text"
              class="form-control"
              placeholder="Item description"
              required
            />
          </div>
          
          <div class="item-quantity">
            <label :for="`quantity-${index}`" class="form-label">Qty</label>
            <input
              :id="`quantity-${index}`"
              v-model.number="item.quantity"
              type="number"
              class="form-control"
              min="1"
              step="1"
              required
            />
          </div>
          
          <div class="item-price">
            <label :for="`price-${index}`" class="form-label">Price ($)</label>
            <input
              :id="`price-${index}`"
              v-model.number="item.price"
              type="number"
              class="form-control"
              min="0"
              step="0.01"
              required
            />
          </div>
          
          <div class="item-total">
            <label class="form-label">Total</label>
            <div class="total-display">${{ (item.quantity * item.price).toFixed(2) }}</div>
          </div>
          
          <div class="item-actions">
            <button
              type="button"
              @click="removeItem(index)"
              class="btn btn-danger btn-small"
              :disabled="form.items.length === 1"
            >
              ×
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="form-section">
      <div class="form-group">
        <label for="notes" class="form-label">Notes (Optional)</label>
        <textarea
          id="notes"
          v-model="form.notes"
          class="form-control"
          rows="3"
          placeholder="Additional notes or terms..."
        ></textarea>
      </div>
    </div>

    <div class="form-section total-section">
      <div class="total-row">
        <span class="total-label">Subtotal:</span>
        <span class="total-value">${{ subtotal.toFixed(2) }}</span>
      </div>
      <div class="total-row">
        <span class="total-label">Tax ({{ form.tax_rate || 10 }}%):</span>
        <span class="total-value">${{ tax.toFixed(2) }}</span>
      </div>
      <div class="total-row total-final">
        <span class="total-label">Total Amount:</span>
        <span class="total-value">${{ totalAmount.toFixed(2) }}</span>
      </div>
    </div>

    <div class="form-actions">
      <button type="button" @click="$router.go(-1)" class="btn btn-secondary">
        Cancel
      </button>
      <button type="submit" class="btn btn-primary">
        {{ isEditing ? 'Update Invoice' : 'Create Invoice' }}
      </button>
    </div>
  </form>
</template>

<script>
export default {
  name: 'InvoiceForm',
  props: {
    invoice: {
      type: Object,
      default: null
    },
    isEditing: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        client_name: '',
        client_email: '',
        client_address: '',
        invoice_date: new Date().toISOString().split('T')[0],
        due_date: '',
        tax_rate: 10.00,
        status: 'draft',
        items: [
          {
            description: '',
            quantity: 1,
            price: 0
          }
        ],
        notes: ''
      }
    }
  },
  computed: {
    subtotal() {
      return (this.form.items || []).reduce((sum, item) => {
        return sum + ((item.quantity || 0) * (item.price || 0))
      }, 0)
    },
    tax() {
      return this.subtotal * ((this.form.tax_rate || 10) / 100)
    },
    totalAmount() {
      return this.subtotal + this.tax
    }
  },
  watch: {
    invoice: {
      handler(newInvoice) {
        if (newInvoice && this.isEditing) {
          console.log('Invoice prop updated:', newInvoice)
          this.loadInvoiceData(newInvoice)
        }
      },
      immediate: true
    }
  },
  mounted() {
    if (this.invoice && this.isEditing) {
      this.loadInvoiceData(this.invoice)
    }
  },
  methods: {
    loadInvoiceData(invoice) {
      console.log('InvoiceForm received invoice data:', invoice)
      console.log('Invoice ID:', invoice.id)
      console.log('Invoice items:', invoice.items)
      console.log('Items type:', typeof invoice.items)
      console.log('Items length:', invoice.items ? invoice.items.length : 'no items')
      
      // Helper function to format date for input fields
      const formatDateForInput = (dateString) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        return date.toISOString().split('T')[0]
      }
      
      // Process items - handle different scenarios
      let processedItems = []
      if (invoice.items && Array.isArray(invoice.items) && invoice.items.length > 0) {
        console.log('Processing existing items...')
        processedItems = invoice.items.map(item => {
          console.log('Processing item:', item)
          console.log('Item keys:', Object.keys(item || {}))
          return {
            description: item.description || item.name || item.item_name || '',
            quantity: Number(item.quantity || item.qty || item.amount) || 1,
            price: Number(item.unit_price || item.price || item.rate || item.cost) || 0
          }
        })
      } else {
        console.log('No items found, creating default item')
        // Create a default item if none exist
        processedItems = [
          {
            description: 'Sample Item',
            quantity: 1,
            price: 0
          }
        ]
      }
      
      console.log('Processed items:', processedItems)
      
      // Map API field names to form field names
      this.form = {
        id: invoice.id, // Ensure ID is set
        client_name: invoice.client_name || '',
        client_email: invoice.client_email || '',
        client_address: invoice.client_address || '',
        invoice_date: formatDateForInput(invoice.invoice_date),
        due_date: formatDateForInput(invoice.due_date),
        tax_rate: Number(invoice.tax_rate) || 10.00,
        status: invoice.status || 'draft',
        notes: invoice.notes || '',
        items: processedItems
      }
      console.log('Form data after mapping:', this.form)
      console.log('Form ID after mapping:', this.form.id)
    },
    addItem() {
      this.form.items.push({
        description: '',
        quantity: 1,
        price: 0
      })
    },
    removeItem(index) {
      if (this.form.items.length > 1) {
        this.form.items.splice(index, 1)
      }
    },
    handleSubmit() {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      console.log('User data:', user)
      
      // Serialize items to JSON string for database storage
      const itemsJson = JSON.stringify(this.form.items.map(item => ({
        description: item.description,
        quantity: Number(item.quantity),
        price: Number(item.price)
      })))
      console.log('Items JSON:', itemsJson)
      
      const invoiceData = {
        client_name: this.form.client_name,
        client_email: this.form.client_email || null,
        client_address: this.form.client_address || null,
        invoice_date: this.form.invoice_date,
        due_date: this.form.due_date || null,
        subtotal: Number(this.subtotal.toFixed(2)),
        tax_rate: Number(this.form.tax_rate || 10.00),
        tax_amount: Number(this.tax.toFixed(2)),
        total_amount: Number(this.totalAmount.toFixed(2)),
        status: this.form.status || 'draft',
        notes: this.form.notes || '',
        items: itemsJson, // Store as JSON string
        user_id: user.userId || user.id // Use user_id as per database schema
      }
      
      // Only include ID when editing
      if (this.isEditing && this.form.id) {
        invoiceData.id = this.form.id
        console.log('Including ID for edit:', this.form.id)
      }
      
      console.log('Form data before sending:', this.form)
      console.log('Calculated values:', {
        subtotal: this.subtotal,
        tax: this.tax,
        totalAmount: this.totalAmount
      })
      console.log('Sending invoice data:', invoiceData)
      console.log('All invoice data keys:', Object.keys(invoiceData))
      
      this.$emit('save', invoiceData)
    }
  }
}
</script>

<style scoped>
.invoice-form {
  max-width: 800px;
  margin: 0 auto;
}

.form-section {
  background: white;
  border-radius: 0.5rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-section h3 {
  margin-bottom: 1.5rem;
  color: #2c3e50;
  border-bottom: 2px solid #007bff;
  padding-bottom: 0.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h3 {
  margin: 0;
  border: none;
  padding: 0;
}

.items-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.item-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr auto;
  gap: 1rem;
  align-items: end;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 0.375rem;
  border: 1px solid #dee2e6;
}

.item-description {
  grid-column: 1;
}

.item-quantity {
  grid-column: 2;
}

.item-price {
  grid-column: 3;
}

.item-total {
  grid-column: 4;
}

.item-actions {
  grid-column: 5;
}

.total-display {
  padding: 0.75rem;
  background: white;
  border: 1px solid #ced4da;
  border-radius: 0.375rem;
  font-weight: 600;
  color: #28a745;
  text-align: center;
}

.btn-small {
  padding: 0.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.total-section {
  background: #f8f9fa;
  border: 2px solid #dee2e6;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #dee2e6;
}

.total-row:last-child {
  border-bottom: none;
}

.total-row.total-final {
  font-size: 1.25rem;
  font-weight: 700;
  color: #28a745;
  border-top: 2px solid #28a745;
  margin-top: 0.5rem;
  padding-top: 1rem;
}

.total-label {
  font-weight: 600;
  color: #495057;
}

.total-value {
  font-weight: 600;
  color: #2c3e50;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .item-row {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .item-description,
  .item-quantity,
  .item-price,
  .item-total,
  .item-actions {
    grid-column: 1;
  }
  
  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .form-section {
    padding: 1rem;
  }
  
  .item-row {
    padding: 0.5rem;
  }
}
</style> 