<template>
  <div class="invoice-list">
    <div v-if="invoices.length === 0" class="empty-state">
      <div class="empty-icon">📄</div>
      <h3>No Invoices Yet</h3>
      <p>Create your first invoice to get started!</p>
      <router-link to="/create" class="btn btn-primary">
        Create Invoice
      </router-link>
    </div>
    
    <div v-else class="invoices-container">
      <div class="list-header">
        <h3>All Invoices ({{ invoices.length }})</h3>
        <div class="list-actions">
          <input
            v-model="searchTerm"
            type="text"
            class="form-control search-input"
            placeholder="Search by client name..."
          />
        </div>
      </div>
      
      <!-- Desktop Table View -->
      <div class="table-responsive desktop-view">
        <table class="table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Client Name</th>
              <th>Date</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="invoice in filteredInvoices" :key="invoice.id">
              <td>{{ invoice.invoice_number }}</td>
              <td>{{ invoice.client_name }}</td>
              <td>{{ formatDate(invoice.invoice_date) }}</td>
              <td class="amount">${{ (Number(invoice.total_amount) || 0).toFixed(2) }}</td>
              <td>
                <span class="status-badge" :class="getStatusClass(invoice)">
                  {{ invoice.status }}
                </span>
              </td>
              <td class="actions">
                <button
                  @click="viewInvoice(invoice)"
                  class="btn btn-secondary btn-small"
                  title="View Invoice"
                >
                  👁️
                </button>
                <button
                  @click="editInvoice(invoice)"
                  class="btn btn-primary btn-small"
                  title="Edit Invoice"
                >
                  ✏️
                </button>
                <button
                  @click="deleteInvoice(invoice)"
                  class="btn btn-danger btn-small"
                  title="Delete Invoice"
                >
                  🗑️
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Mobile Card View -->
      <div class="mobile-view">
        <div class="invoice-cards">
          <div 
            v-for="invoice in filteredInvoices" 
            :key="invoice.id"
            class="invoice-card"
          >
            <div class="card-header">
              <div class="card-title">
                <h4>Invoice #{{ invoice.invoice_number }}</h4>
                <span class="status-badge" :class="getStatusClass(invoice)">
                  {{ invoice.status }}
                </span>
              </div>
              <div class="card-amount">
                ${{ (Number(invoice.total_amount) || 0).toFixed(2) }}
              </div>
            </div>
            
            <div class="card-details">
              <div class="detail-item">
                <span class="detail-label">Client:</span>
                <span class="detail-value">{{ invoice.client_name }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Date:</span>
                <span class="detail-value">{{ formatDate(invoice.invoice_date) }}</span>
              </div>
            </div>
            
            <div class="card-actions">
              <button
                @click="viewInvoice(invoice)"
                class="btn btn-secondary btn-mobile"
                title="View Invoice"
              >
                <span class="btn-icon">👁️</span>
                <span class="btn-text">View</span>
              </button>
              <button
                @click="editInvoice(invoice)"
                class="btn btn-primary btn-mobile"
                title="Edit Invoice"
              >
                <span class="btn-icon">✏️</span>
                <span class="btn-text">Edit</span>
              </button>
              <button
                @click="deleteInvoice(invoice)"
                class="btn btn-danger btn-mobile"
                title="Delete Invoice"
              >
                <span class="btn-icon">🗑️</span>
                <span class="btn-text">Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Invoice View Modal -->
    <div v-if="selectedInvoice" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Invoice #{{ selectedInvoice.id }}</h3>
          <button @click="closeModal" class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <div class="invoice-details">
            <div class="detail-row">
              <span class="detail-label">Invoice Number:</span>
              <span class="detail-value">{{ selectedInvoice.invoice_number }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Client Name:</span>
              <span class="detail-value">{{ selectedInvoice.client_name }}</span>
            </div>
            <div class="detail-row" v-if="selectedInvoice.client_email">
              <span class="detail-label">Client Email:</span>
              <span class="detail-value">{{ selectedInvoice.client_email }}</span>
            </div>
            <div class="detail-row" v-if="selectedInvoice.client_address">
              <span class="detail-label">Client Address:</span>
              <span class="detail-value">{{ selectedInvoice.client_address }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Invoice Date:</span>
              <span class="detail-value">{{ formatDate(selectedInvoice.invoice_date) }}</span>
            </div>
            <div class="detail-row" v-if="selectedInvoice.due_date">
              <span class="detail-label">Due Date:</span>
              <span class="detail-value">{{ formatDate(selectedInvoice.due_date) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Status:</span>
              <span class="detail-value">
                <span class="status-badge" :class="getStatusClass(selectedInvoice)">
                  {{ selectedInvoice.status }}
                </span>
              </span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Created:</span>
              <span class="detail-value">{{ formatDate(selectedInvoice.created_at) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Last Updated:</span>
              <span class="detail-value">{{ formatDate(selectedInvoice.updated_at) }}</span>
            </div>
          </div>
          
          <div class="invoice-items">
            <h4>Items</h4>
            <div class="items-table">
              <div class="item-header">
                <span>Description</span>
                <span>Qty</span>
                <span>Price</span>
                <span>Total</span>
              </div>
              <div 
                v-for="item in parsedInvoiceItems" 
                :key="item.description"
                class="item-row"
              >
                <span>{{ item.description }}</span>
                <span>{{ item.quantity }}</span>
                <span>${{ (Number(item.price) || 0).toFixed(2) }}</span>
                <span>${{ ((Number(item.quantity) || 0) * (Number(item.price) || 0)).toFixed(2) }}</span>
              </div>
            </div>
          </div>
          
          <div class="invoice-summary">
            <div class="summary-row">
              <span>Subtotal:</span>
              <span>${{ (Number(selectedInvoice.subtotal) || 0).toFixed(2) }}</span>
            </div>
            <div class="summary-row">
              <span>Tax Rate:</span>
              <span>{{ (Number(selectedInvoice.tax_rate) || 0).toFixed(2) }}%</span>
            </div>
            <div class="summary-row">
              <span>Tax Amount:</span>
              <span>${{ (Number(selectedInvoice.tax_amount) || 0).toFixed(2) }}</span>
            </div>
            <div class="summary-row total-row">
              <span>Total Amount:</span>
              <span class="total-amount">${{ (Number(selectedInvoice.total_amount) || 0).toFixed(2) }}</span>
            </div>
          </div>
          
          <div v-if="selectedInvoice.notes" class="invoice-notes">
            <h4>Notes</h4>
            <p>{{ selectedInvoice.notes }}</p>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="editInvoice(selectedInvoice)" class="btn btn-primary">
            Edit Invoice
          </button>
          <button @click="closeModal" class="btn btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InvoiceList',
  props: {
    invoices: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      searchTerm: '',
      selectedInvoice: null
    }
  },
  computed: {
    filteredInvoices() {
      if (!this.searchTerm) return this.invoices
      
      return this.invoices.filter(invoice =>
        invoice.client_name.toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    },
    parsedInvoiceItems() {
      if (!this.selectedInvoice || !this.selectedInvoice.items) return []
      
      try {
        // If items is a string, parse it as JSON
        if (typeof this.selectedInvoice.items === 'string') {
          const parsed = JSON.parse(this.selectedInvoice.items)
          return Array.isArray(parsed) ? parsed : []
        }
        // If items is already an array, use it directly
        else if (Array.isArray(this.selectedInvoice.items)) {
          return this.selectedInvoice.items
        }
        // Otherwise, return empty array
        else {
          return []
        }
      } catch (error) {
        console.error('Error parsing invoice items:', error)
        return []
      }
    }
  },
  methods: {
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString()
    },
    getStatusText(invoice) {
      // Simple status logic - you can enhance this
      const daysSinceCreation = Math.floor(
        (new Date() - new Date(invoice.createdAt)) / (1000 * 60 * 60 * 24)
      )
      
      if (daysSinceCreation <= 7) return 'Recent'
      if (daysSinceCreation <= 30) return 'Active'
      return 'Archived'
    },
    getStatusClass(invoice) {
      const status = invoice.status
      switch (status) {
        case 'paid': return 'status-paid'
        case 'sent': return 'status-sent'
        case 'draft': return 'status-draft'
        case 'overdue': return 'status-overdue'
        case 'cancelled': return 'status-cancelled'
        default: return 'status-draft'
      }
    },
    viewInvoice(invoice) {
      this.selectedInvoice = invoice
    },
    editInvoice(invoice) {
      this.$router.push(`/edit/${invoice.id}`)
    },
    deleteInvoice(invoice) {
      if (confirm(`Are you sure you want to delete invoice #${invoice.id}?`)) {
        this.$emit('delete', invoice.id)
      }
    },
    closeModal() {
      this.selectedInvoice = null
    }
  }
}
</script>

<style scoped>
.invoice-list {
  width: 100%;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin: 1rem 0;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

.empty-state h3 {
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-size: 1.5rem;
}

.empty-state p {
  color: #6c757d;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 0 0.5rem;
}

.list-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
}

.search-input {
  max-width: 300px;
  border-radius: 0.7rem;
  border: 2px solid #e3e9f7;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #5c6bc0;
  box-shadow: 0 0 0 3px rgba(92, 107, 192, 0.1);
}

.amount {
  font-weight: 600;
  color: #28a745;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: capitalize;
}

.status-recent {
  background-color: #d4edda;
  color: #155724;
}

.status-active {
  background-color: #fff3cd;
  color: #856404;
}

.status-archived {
  background-color: #f8d7da;
  color: #721c24;
}

.status-draft {
  background-color: #e9ecef;
  color: #495057;
}

.status-sent {
  background-color: #fff3cd;
  color: #856404;
}

.status-paid {
  background-color: #d4edda;
  color: #155724;
}

.status-overdue {
  background-color: #f8d7da;
  color: #721c24;
}

.status-cancelled {
  background-color: #f5c6cb;
  color: #721c24;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn-small {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  min-width: auto;
}

/* Desktop Table Styles */
.desktop-view {
  display: block;
}

.table-responsive {
  overflow-x: auto;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 1rem;
}

.table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
}

.table th {
  background: linear-gradient(135deg, #1a237e 0%, #5c6bc0 100%);
  color: white;
  padding: 1rem;
  text-align: left;
  font-weight: 700;
  font-size: 1rem;
}

.table td {
  padding: 1rem;
  border-bottom: 1px solid #f1f3f4;
  vertical-align: middle;
}

.table tbody tr:hover {
  background-color: #f8f9fa;
  transform: translateY(-1px);
  transition: all 0.2s ease;
}

/* Mobile Card Styles */
.mobile-view {
  display: none;
}

.invoice-cards {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.invoice-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f3f4;
  transition: all 0.3s ease;
}

.invoice-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
}

.card-title {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.card-title h4 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.2rem;
  font-weight: 700;
}

.card-amount {
  font-size: 1.3rem;
  font-weight: 700;
  color: #28a745;
  text-align: right;
}

.card-details {
  margin-bottom: 1.5rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f8f9fa;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: 600;
  color: #6c757d;
  font-size: 0.9rem;
}

.detail-value {
  color: #2c3e50;
  font-weight: 500;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn-mobile {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 0.7rem;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  flex: 1;
  justify-content: center;
  min-width: 0;
}

.btn-icon {
  font-size: 1rem;
}

.btn-text {
  display: block;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 1rem;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #dee2e6;
  background: linear-gradient(135deg, #1a237e 0%, #5c6bc0 100%);
  color: white;
  border-radius: 1rem 1rem 0 0;
}

.modal-header h3 {
  margin: 0;
  color: white;
  font-size: 1.3rem;
}

.modal-close {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: white;
  padding: 0.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.2s;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.3);
}

.modal-body {
  padding: 1.5rem;
}

.invoice-details {
  margin-bottom: 2rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f8f9fa;
}

.detail-label {
  font-weight: 600;
  color: #495057;
}

.detail-value {
  color: #2c3e50;
}

.invoice-items {
  margin-bottom: 2rem;
}

.invoice-items h4 {
  margin-bottom: 1rem;
  color: #2c3e50;
  font-size: 1.2rem;
}

.items-table {
  border: 1px solid #dee2e6;
  border-radius: 0.7rem;
  overflow: hidden;
  background: white;
}

.item-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  background: #f8f9fa;
  padding: 1rem;
  font-weight: 600;
  color: #495057;
}

.item-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  padding: 1rem;
  border-top: 1px solid #dee2e6;
}

.item-row:nth-child(even) {
  background: #f8f9fa;
}

.invoice-summary {
  text-align: right;
  margin-bottom: 2rem;
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 0.7rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e9ecef;
}

.summary-row:last-child {
  border-bottom: none;
}

.total-row {
  font-size: 1.25rem;
  font-weight: 700;
  color: #28a745;
  padding-top: 0.5rem;
}

.total-amount {
  font-size: 1.4rem;
}

.invoice-notes {
  border-top: 1px solid #dee2e6;
  padding-top: 1rem;
}

.invoice-notes h4 {
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-size: 1.2rem;
}

.invoice-notes p {
  color: #6c757d;
  line-height: 1.6;
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 0.7rem;
  margin: 0;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #dee2e6;
  background: #f8f9fa;
  border-radius: 0 0 1rem 1rem;
}

/* Responsive Breakpoints */
@media (max-width: 1024px) {
  .list-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-input {
    max-width: none;
  }
  
  .table-responsive {
    overflow-x: auto;
  }
  
  .actions {
    flex-direction: column;
    gap: 0.25rem;
  }
}

@media (max-width: 768px) {
  .desktop-view {
    display: none;
  }
  
  .mobile-view {
    display: block;
  }
  
  .list-header {
    padding: 0;
  }
  
  .list-header h3 {
    font-size: 1.3rem;
  }
  
  .search-input {
    font-size: 1rem;
    padding: 0.8rem 1rem;
  }
  
  .invoice-card {
    padding: 1.25rem;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .card-amount {
    align-self: flex-end;
    font-size: 1.2rem;
  }
  
  .card-actions {
    flex-direction: column;
  }
  
  .btn-mobile {
    flex-direction: row;
    justify-content: center;
  }
  
  .modal-content {
    margin: 0.5rem;
    max-height: calc(100vh - 1rem);
  }
  
  .modal-header {
    padding: 1rem;
  }
  
  .modal-body {
    padding: 1rem;
  }
  
  .modal-footer {
    padding: 1rem;
    flex-direction: column;
  }
  
  .item-header,
  .item-row {
    grid-template-columns: 1fr;
    gap: 0.5rem;
    padding: 0.75rem;
  }
  
  .item-header span,
  .item-row span {
    padding: 0.25rem 0;
  }
  
  .item-header span:not(:first-child)::before,
  .item-row span:not(:first-child)::before {
    content: attr(data-label) ': ';
    font-weight: 600;
    color: #495057;
  }
  
  .detail-row {
    flex-direction: column;
    gap: 0.25rem;
    align-items: flex-start;
  }
  
  .summary-row {
    flex-direction: column;
    gap: 0.25rem;
    align-items: flex-start;
    text-align: left;
  }
}

@media (max-width: 480px) {
  .empty-state {
    padding: 2rem 1rem;
  }
  
  .empty-icon {
    font-size: 3rem;
  }
  
  .empty-state h3 {
    font-size: 1.3rem;
  }
  
  .empty-state p {
    font-size: 1rem;
  }
  
  .list-header h3 {
    font-size: 1.2rem;
  }
  
  .invoice-card {
    padding: 1rem;
  }
  
  .card-title h4 {
    font-size: 1.1rem;
  }
  
  .card-amount {
    font-size: 1.1rem;
  }
  
  .btn-mobile {
    padding: 0.6rem 0.8rem;
    font-size: 0.85rem;
  }
  
  .btn-icon {
    font-size: 0.9rem;
  }
  
  .modal-content {
    margin: 0.25rem;
    max-height: calc(100vh - 0.5rem);
  }
  
  .modal-header {
    padding: 0.75rem;
  }
  
  .modal-body {
    padding: 0.75rem;
  }
  
  .modal-footer {
    padding: 0.75rem;
  }
}

@media (max-width: 360px) {
  .invoice-card {
    padding: 0.75rem;
  }
  
  .card-title h4 {
    font-size: 1rem;
  }
  
  .card-amount {
    font-size: 1rem;
  }
  
  .btn-mobile {
    padding: 0.5rem 0.6rem;
    font-size: 0.8rem;
  }
  
  .btn-text {
    font-size: 0.8rem;
  }
}
</style> 