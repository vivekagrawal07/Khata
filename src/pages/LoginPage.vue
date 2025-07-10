<template>
  <div class="login-page">
    <div class="container">
      <div class="auth-container">
        <div class="auth-card">
          <div class="auth-header">
            <h1>Welcome Back</h1>
            <p>Sign in to your account to continue</p>
          </div>
          
          <form @submit.prevent="handleLogin" class="auth-form">
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
              <label for="password" class="form-label">Password *</label>
              <input
                id="password"
                v-model="form.password"
                type="password"
                class="form-control"
                :class="{ 'error': errors.password }"
                required
                placeholder="Enter your password"
              />
              <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
            </div>
            
            <div class="form-group">
              <label class="checkbox-label">
                <input
                  v-model="form.rememberMe"
                  type="checkbox"
                  class="checkbox-input"
                />
                <span class="checkbox-text">Remember me</span>
              </label>
            </div>
            
            <button type="submit" class="btn btn-primary btn-full" :disabled="loading">
              {{ loading ? 'Signing in...' : 'Sign In' }}
            </button>
          </form>
          
          <div class="auth-footer">
            <p>Don't have an account? 
              <router-link to="/register" class="auth-link">Sign up here</router-link>
            </p>
            <router-link to="/forgot-password" class="auth-link">Forgot password?</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apiService from '../services/api.js'

export default {
  name: 'LoginPage',
  data() {
    return {
      form: {
        email: '',
        password: '',
        rememberMe: false
      },
      errors: {},
      loading: false
    }
  },
  methods: {
    validateForm() {
      this.errors = {}
      
      if (!this.form.email) {
        this.errors.email = 'Email is required'
      } else if (!this.isValidEmail(this.form.email)) {
        this.errors.email = 'Please enter a valid email address'
      }
      
      if (!this.form.password) {
        this.errors.password = 'Password is required'
      } else if (this.form.password.length < 6) {
        this.errors.password = 'Password must be at least 6 characters'
      }
      
      return Object.keys(this.errors).length === 0
    },
    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    },
    async handleLogin() {
      if (!this.validateForm()) {
        return
      }
      
      this.loading = true
      
      try {
        // Call the real API
        const response = await apiService.login({
          email: this.form.email,
          password: this.form.password
        })
        
        // Store user data and token
        localStorage.setItem('authToken', response.token)
        localStorage.setItem('user', JSON.stringify(response.user))
        
        // Show success message
        alert('Login successful! Welcome back.')
        
        // Redirect to dashboard
        this.$router.push('/dashboard')
        
      } catch (error) {
        console.error('Login error:', error)
        alert(error.message || 'Login failed. Please check your credentials and try again.')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
}

.auth-container {
  width: 100%;
  max-width: 400px;
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
  align-items: center;
  cursor: pointer;
  font-size: 0.9rem;
  color: #495057;
}

.checkbox-input {
  margin-right: 0.5rem;
  width: 1rem;
  height: 1rem;
}

.checkbox-text {
  user-select: none;
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
  margin-bottom: 0.5rem;
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