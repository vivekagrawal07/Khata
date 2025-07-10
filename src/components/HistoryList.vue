<template>
  <div class="history-list">
    <div v-if="historyItems.length === 0" class="empty-state">
      <div class="empty-icon">📋</div>
      <h3>No History Yet</h3>
      <p>Create your first invoice to see history here!</p>
      <router-link to="/create" class="btn btn-primary">
        Create Invoice
      </router-link>
    </div>
    
    <div v-else class="history-container">
      <div class="list-header">
        <h3>Invoice History ({{ historyItems.length }} entries)</h3>
        <div class="list-actions">
          <input
            v-model="searchTerm"
            type="text"
            class="form-control search-input"
            placeholder="Search by client name..."
          />
        </div>
      </div>
      
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Client Name</th>
              <th>Created</th>
              <th>Last Modified</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredHistory" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.client_name }}</td>
              <td>{{ formatDateTime(item.created_at) }}</td>
              <td>{{ formatDateTime(item.updated_at) }}</td>
            </tr>
          </tbody>
        </table>
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
              <span class="detail-label">Client:</span>
              <span class="detail-value">{{ selectedInvoice.client_name }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Created:</span>
              <span class="detail-value">{{ formatDateTime(selectedInvoice.created_at) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Last Updated:</span>
              <span class="detail-value">{{ formatDateTime(selectedInvoice.updated_at) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Total Amount:</span>
              <span class="detail-value">${{ selectedInvoice.totalAmount.toFixed(2) }}</span>
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
                v-for="item in selectedInvoice.items" 
                :key="item.description"
                class="item-row"
              >
                <span>{{ item.description }}</span>
                <span>{{ item.quantity }}</span>
                <span>${{ item.price.toFixed(2) }}</span>
                <span>${{ (item.quantity * item.price).toFixed(2) }}</span>
              </div>
            </div>
          </div>
          
          <div v-if="selectedInvoice.notes" class="invoice-notes">
            <h4>Notes</h4>
            <p>{{ selectedInvoice.notes }}</p>
          </div>
        </div>
        <div class="modal-footer">
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
  name: 'HistoryList',
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
    historyItems() {
      return this.invoices.map(invoice => ({
        id: invoice.id,
        client_name: invoice.client_name,
        created_at: invoice.created_at,
        updated_at: invoice.updated_at,
        totalAmount: invoice.totalAmount,
        items: invoice.items,
        notes: invoice.notes
      }))
    },
    filteredHistory() {
      if (!this.searchTerm) return this.historyItems
      
      return this.historyItems.filter(item =>
        item.client_name.toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    }
  },
  methods: {
    formatDateTime(dateString) {
      const date = new Date(dateString)
      return date.toLocaleString()
    },
    closeModal() {
      this.selectedInvoice = null
    }
  }
}
</script>

<style scoped>
.history-list {
  width: 100%;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.empty-state p {
  color: #6c757d;
  margin-bottom: 1.5rem;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.list-header h3 {
  margin: 0;
  color: #2c3e50;
}

.search-input {
  max-width: 300px;
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
  border-radius: 0.5rem;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #dee2e6;
}

.modal-header h3 {
  margin: 0;
  color: #2c3e50;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
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
  padding: 0.5rem 0;
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
}

.items-table {
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  overflow: hidden;
}

.item-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  background: #f8f9fa;
  padding: 0.75rem;
  font-weight: 600;
  color: #495057;
}

.item-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  padding: 0.75rem;
  border-top: 1px solid #dee2e6;
}

.invoice-notes {
  border-top: 1px solid #dee2e6;
  padding-top: 1rem;
}

.invoice-notes h4 {
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.invoice-notes p {
  color: #6c757d;
  line-height: 1.6;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #dee2e6;
}

/* Responsive Design */
@media (max-width: 768px) {
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
  
  .modal-content {
    margin: 1rem;
    max-height: calc(100vh - 2rem);
  }
  
  .item-header,
  .item-row {
    grid-template-columns: 1fr;
    gap: 0.25rem;
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
}
</style> 