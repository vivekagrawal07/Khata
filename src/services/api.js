const API_BASE_URL = 'https://server-virid-two.vercel.app/api'

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  // Helper method to get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('authToken')
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  }

  // Helper method to handle API responses
  async handleResponse(response) {
    if (!response.ok) {
      if (response.status === 401) {
        // Auto-logout and redirect to login on Unauthorized
        this.logout();
        window.location.href = '/login';
      }
      const errorData = await response.json().catch(() => ({}))
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        errorData,
        fullError: errorData
      })
      throw new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`)
    }
    return response.json()
  }

  // Authentication APIs
  async login(credentials) {
    console.log('Attempting login with:', { email: credentials.email, password: '***' })
    const response = await fetch(`${this.baseURL}/invoice-auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
    console.log('Login response status:', response.status)
    return this.handleResponse(response)
  }

  async register(userData) {
    console.log('Sending registration data:', userData)
    const response = await fetch(`${this.baseURL}/invoice-auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })
    return this.handleResponse(response)
  }

  async getProfile() {
    const response = await fetch(`${this.baseURL}/invoice-auth/profile`, {
      headers: this.getAuthHeaders()
    })
    return this.handleResponse(response)
  }

  async updateProfile(profileData) {
    const response = await fetch(`${this.baseURL}/invoice-auth/profile`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(profileData)
    })
    return this.handleResponse(response)
  }

  // Invoice APIs (all require Authorization header)
  /**
   * Fetch all invoices (optionally filtered by params)
   * @param {Object} params - Query parameters for filtering/searching
   * @returns {Promise<Array>} List of invoices
   */
  async getInvoices(params = {}) {
    // const queryString = new URLSearchParams(params).toString()
    const url = `${this.baseURL}/invoices`
    const headers = this.getAuthHeaders();
    console.log('Invoice API Request Headers:', headers); // Debug log
    const response = await fetch(url, {
      headers
    })
    return this.handleResponse(response)
  }

  /**
   * Search invoices by query parameters
   * @param {Object} query - Search parameters (e.g., { clientName: 'John' })
   * @returns {Promise<Array>} Filtered list of invoices
   */
  async searchInvoices(query = {}) {
    return this.getInvoices(query);
  }

  /**
   * Fetch a single invoice by ID
   * @param {string|number} id - Invoice ID
   * @returns {Promise<Object>} Invoice data
   */
  async getInvoice(id) {
    const response = await fetch(`${this.baseURL}/invoices/${id}`, {
      headers: this.getAuthHeaders()
    })
    return this.handleResponse(response)
  }

  /**
   * Create a new invoice
   * @param {Object} invoiceData - Invoice data
   * @returns {Promise<Object>} Created invoice
   */
  async createInvoice(invoiceData) {
    const response = await fetch(`${this.baseURL}/invoices`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(invoiceData)
    })
    return this.handleResponse(response)
  }

  /**
   * Update an existing invoice
   * @param {string|number} id - Invoice ID
   * @param {Object} invoiceData - Updated invoice data
   * @returns {Promise<Object>} Updated invoice
   */
  async updateInvoice(id, invoiceData) {
    const response = await fetch(`${this.baseURL}/invoices/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(invoiceData)
    })
    return this.handleResponse(response)
  }

  /**
   * Delete an invoice by ID
   * @param {string|number} id - Invoice ID
   * @returns {Promise<Object>} Deletion result
   */
  async deleteInvoice(id) {
    const response = await fetch(`${this.baseURL}/invoices/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    })
    return this.handleResponse(response)
  }

  /**
   * Generate a PDF for an invoice
   * @param {string|number} id - Invoice ID
   * @returns {Promise<Blob>} PDF blob
   */
  async generateInvoicePDF(id) {
    const response = await fetch(`${this.baseURL}/invoices/${id}/pdf`, {
      headers: this.getAuthHeaders()
    })
    return response.blob()
  }

  /**
   * Send an invoice via email
   * @param {string|number} id - Invoice ID
   * @param {Object} emailData - Email details
   * @returns {Promise<Object>} Send result
   */
  async sendInvoice(id, emailData) {
    const response = await fetch(`${this.baseURL}/invoices/${id}/send`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(emailData)
    })
    return this.handleResponse(response)
  }

  // Invoice Items APIs
  async getInvoiceItems(invoiceId) {
    const response = await fetch(`${this.baseURL}/invoices/${invoiceId}/items`, {
      headers: this.getAuthHeaders()
    })
    return this.handleResponse(response)
  }

  async addInvoiceItem(invoiceId, itemData) {
    const response = await fetch(`${this.baseURL}/invoices/${invoiceId}/items`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(itemData)
    })
    return this.handleResponse(response)
  }

  async updateInvoiceItem(invoiceId, itemId, itemData) {
    const response = await fetch(`${this.baseURL}/invoices/${invoiceId}/items/${itemId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(itemData)
    })
    return this.handleResponse(response)
  }

  async deleteInvoiceItem(invoiceId, itemId) {
    const response = await fetch(`${this.baseURL}/invoices/${invoiceId}/items/${itemId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    })
    return this.handleResponse(response)
  }

  // History APIs
  async getInvoiceHistory(invoiceId) {
    const response = await fetch(`${this.baseURL}/invoices/${invoiceId}/history`, {
      headers: this.getAuthHeaders()
    })
    return this.handleResponse(response)
  }

  async getAllHistory(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    const url = queryString ? `${this.baseURL}/history?${queryString}` : `${this.baseURL}/history`
    
    const response = await fetch(url, {
      headers: this.getAuthHeaders()
    })
    return this.handleResponse(response)
  }

  // Utility method to check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('authToken')
  }

  // Utility method to set auth token
  setAuthToken(token) {
    localStorage.setItem('authToken', token)
  }

  // Utility method to remove auth token
  logout() {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
  }

  // Health check method to test server connectivity
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL.replace('/api', '')}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      console.log('Server Health Check:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      })
      return response
    } catch (error) {
      console.error('Server Health Check Error:', error)
      throw error
    }
  }

  // Test method to check API endpoint
  async testEndpoint() {
    try {
      const response = await fetch(`${this.baseURL}/invoice-auth/register`, {
        method: 'OPTIONS',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      console.log('API Test Response:', response)
      return response
    } catch (error) {
      console.error('API Test Error:', error)
      throw error
    }
  }
}

// Create and export a single instance
const apiService = new ApiService()
export default apiService 