<template>
  <div class="register-page">
    <div class="container">
      <div class="auth-container">
        <div class="auth-card">
          <div class="auth-header">
            <h1>Create Account</h1>
            <p>Join us to start creating professional invoices</p>
          </div>
          
          <form @submit.prevent="handleRegister" class="auth-form">
            <div class="form-row">
              <div class="form-group">
                <label for="firstName" class="form-label">First Name *</label>
                <input
                  id="firstName"
                  v-model="form.firstName"
                  type="text"
                  class="form-control"
                  :class="{ 'error': errors.firstName }"
                  required
                  placeholder="Enter first name"
                />
                <span v-if="errors.firstName" class="error-message">{{ errors.firstName }}</span>
              </div>
              
              <div class="form-group">
                <label for="lastName" class="form-label">Last Name *</label>
                <input
                  id="lastName"
                  v-model="form.lastName"
                  type="text"
                  class="form-control"
                  :class="{ 'error': errors.lastName }"
                  required
                  placeholder="Enter last name"
                />
                <span v-if="errors.lastName" class="error-message">{{ errors.lastName }}</span>
              </div>
            </div>
            
            <div class="form-group">
              <label for="email" class="form-label">Email Address *</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                class="form-control"
                :class="{ 'error': errors.email }"
                required
                placeholder="Enter your email"
              />
              <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
            </div>
            
            <div class="form-group">
              <label for="companyName" class="form-label">Company Name</label>
              <input
                id="companyName"
                v-model="form.companyName"
                type="text"
                class="form-control"
                placeholder="Enter company name (optional)"
              />
            </div>
            
            <div class="form-group">
              <label for="phone" class="form-label">Phone Number</label>
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                class="form-control"
                placeholder="Enter phone number (optional)"
              />
            </div>
            
            <div class="form-group">
              <label for="password" class="form-label">Password *</label>
              <input
                id="password"
                v-model="form.password"
                type="password"
                class="form-control"
                :class="{ 'error': errors.password }"
                required
                placeholder="Create a password"
              />
              <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
            </div>
            
            <div class="form-group">
              <label for="confirmPassword" class="form-label">Confirm Password *</label>
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                type="password"
                class="form-control"
                :class="{ 'error': errors.confirmPassword }"
                required
                placeholder="Confirm your password"
              />
              <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
            </div>
            
            <div class="form-group">
              <label class="checkbox-label">
                <input
                  v-model="form.agreeToTerms"
                  type="checkbox"
                  class="checkbox-input"
                  required
                />
                <span class="checkbox-text">
                  I agree to the 
                  <a href="#" class="terms-link">Terms of Service</a> and 
                  <a href="#" class="terms-link">Privacy Policy</a>
                </span>
              </label>
            </div>
            
            <button type="submit" class="btn btn-primary btn-full" :disabled="loading">
              {{ loading ? 'Creating Account...' : 'Create Account' }}
            </button>
          </form>
          
          <div class="auth-footer">
            <p>Already have an account? 
              <router-link to="/login" class="auth-link">Sign in here</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apiService from '../services/api.js'

export default {
  name: 'RegisterPage',
  data() {
    return {
      form: {
        firstName: '',
        lastName: '',
        email: '',
        companyName: '',
        phone: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false
      },
      errors: {},
      loading: false
    }
  },
  methods: {
    validateForm() {
      this.errors = {}
      
      if (!this.form.firstName.trim()) {
        this.errors.firstName = 'First name is required'
      }
      
      if (!this.form.lastName.trim()) {
        this.errors.lastName = 'Last name is required'
      }
      
      if (!this.form.email) {
        this.errors.email = 'Email is required'
      } else if (!this.isValidEmail(this.form.email)) {
        this.errors.email = 'Please enter a valid email address'
      }
      
      if (!this.form.password) {
        this.errors.password = 'Password is required'
      } else if (this.form.password.length < 8) {
        this.errors.password = 'Password must be at least 8 characters'
      } else if (!this.isValidPassword(this.form.password)) {
        this.errors.password = 'Password must contain at least one letter and one number'
      }
      
      if (!this.form.confirmPassword) {
        this.errors.confirmPassword = 'Please confirm your password'
      } else if (this.form.password !== this.form.confirmPassword) {
        this.errors.confirmPassword = 'Passwords do not match'
      }
      
      if (!this.form.agreeToTerms) {
        this.errors.agreeToTerms = 'You must agree to the terms and conditions'
      }
      
      return Object.keys(this.errors).length === 0
    },
    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    },
    isValidPassword(password) {
      return /[a-zA-Z]/.test(password) && /[0-9]/.test(password)
    },
    async handleRegister() {
      if (!this.validateForm()) {
        return
      }
      
      this.loading = true
      
      try {
        // Prepare registration data
        const registrationData = {
          firstName: this.form.firstName.trim(),
          lastName: this.form.lastName.trim(),
          email: this.form.email.trim().toLowerCase(),
          password: this.form.password,
          ...(this.form.companyName && { companyName: this.form.companyName.trim() }),
          ...(this.form.phone && { phone: this.form.phone.trim() })
        }
        
        console.log('Registration data being sent:', registrationData)
        
        // Call the real API
        const response = await apiService.register(registrationData)
        
        // Store user data and token
        localStorage.setItem('token', response.token)
        localStorage.setItem('user', JSON.stringify(response.user))
        
        // Redirect to dashboard
        this.$router.push('/dashboard')
        
      } catch (error) {
        console.error('Registration error:', error)
        alert(error.message || 'Registration failed. Please try again.')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
}

.auth-container {
  width: 100%;
  max-width: 500px;
}

.auth-card {
  background: white;
  border-radius: 1rem;
  padding: 2.5rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-header h1 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 2rem;
}

.auth-header p {
  color: #6c757d;
  font-size: 1rem;
}

.auth-form {
  margin-bottom: 2rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #495057;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.form-control.error {
  border-color: #dc3545;
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  cursor: pointer;
  font-size: 0.9rem;
  color: #495057;
  line-height: 1.4;
}

.checkbox-input {
  margin-right: 0.5rem;
  width: 1rem;
  height: 1rem;
  margin-top: 0.125rem;
  flex-shrink: 0;
}

.checkbox-text {
  user-select: none;
}

.terms-link {
  color: #007bff;
  text-decoration: none;
}

.terms-link:hover {
  text-decoration: underline;
}

.btn-full {
  width: 100%;
  padding: 0.875rem;
  font-size: 1rem;
  font-weight: 500;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.auth-footer {
  text-align: center;
  border-top: 1px solid #dee2e6;
  padding-top: 1.5rem;
}

.auth-footer p {
  color: #6c757d;
  font-size: 0.9rem;
}

.auth-link {
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.auth-link:hover {
  color: #0056b3;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .auth-card {
    padding: 2rem 1.5rem;
    margin: 0 1rem;
  }
  
  .auth-header h1 {
    font-size: 1.75rem;
  }
}
</style> 