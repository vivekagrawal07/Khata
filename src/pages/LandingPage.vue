<template>
  <div class="landing-page">
    <NavBar landing />
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title">Professional Invoice Generator</h1>
            <p class="hero-subtitle">
              Create, manage, and track your invoices with ease. 
              A simple and powerful tool for businesses of all sizes.
            </p>
            <div class="hero-buttons">
              <router-link to="/register" class="btn btn-primary btn-large">
                Get Started
              </router-link>
              <router-link to="/login" class="btn btn-secondary btn-large">
                Sign In
              </router-link>
            </div>
          </div>
          <div class="hero-image">
            <div class="invoice-preview">
              <div class="invoice-header">
                <h3>INVOICE</h3>
                <span>#001</span>
              </div>
              <div class="invoice-body">
                <div class="invoice-row">
                  <span>Client:</span>
                  <span>John Doe</span>
                </div>
                <div class="invoice-row">
                  <span>Date:</span>
                  <span>2024-01-15</span>
                </div>
                <div class="invoice-row">
                  <span>Amount:</span>
                  <span>$1,250.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <div class="container">
        <h2 class="section-title text-center">Why Choose Our Invoice Generator?</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">📄</div>
            <h3>Easy to Use</h3>
            <p>Simple and intuitive interface that makes invoice creation a breeze.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📱</div>
            <h3>Responsive Design</h3>
            <p>Works perfectly on desktop, tablet, and mobile devices.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">💾</div>
            <h3>Secure Storage</h3>
            <p>Your invoices are safely stored locally on your device.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">⚡</div>
            <h3>Fast & Efficient</h3>
            <p>Generate professional invoices in seconds, not minutes.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="about">
      <div class="container">
        <div class="about-content">
          <div class="about-text">
            <h2>About InvoiceGen</h2>
            <p>
              InvoiceGen is a modern, user-friendly invoice generator designed to help 
              businesses and freelancers create professional invoices quickly and easily. 
              Our platform combines simplicity with powerful features to streamline your 
              billing process.
            </p>
            <p>
              Whether you're a small business owner, freelancer, or consultant, 
              our tool provides everything you need to manage your invoicing efficiently.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import NavBar from '../components/NavBar.vue'
export default {
  name: 'LandingPage',
  components: { NavBar }
}
</script>

<style scoped>
.landing-page {
  min-height: 100vh;
}

/* Hero Section */
.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 0;
  min-height: 80vh;
  display: flex;
  align-items: center;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: white;
}

.hero-subtitle {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.6;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-large {
  padding: 1rem 2rem;
  font-size: 1.1rem;
}

/* Invoice Preview */
.hero-image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.invoice-preview {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  color: #333;
  max-width: 400px;
  width: 100%;
}

.invoice-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #007bff;
}

.invoice-header h3 {
  color: #007bff;
  margin: 0;
}

.invoice-body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.invoice-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
}

.invoice-row:last-child {
  font-weight: 600;
  font-size: 1.1rem;
  color: #28a745;
}

/* Features Section */
.features {
  padding: 4rem 0;
  background: white;
}

.section-title {
  margin-bottom: 3rem;
  color: #2c3e50;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-card {
  text-align: center;
  padding: 2rem;
  border-radius: 0.5rem;
  background: #f8f9fa;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.feature-card p {
  color: #6c757d;
  line-height: 1.6;
}

/* About Section */
.about {
  padding: 4rem 0;
  background: #f8f9fa;
}

.about-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.about-text h2 {
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.about-text p {
  font-size: 1.1rem;
  line-height: 1.7;
  color: #6c757d;
  margin-bottom: 1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 2rem;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-buttons {
    justify-content: center;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .invoice-preview {
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
  }
  
  .btn-large {
    width: 100%;
  }
  
  .hero-buttons {
    flex-direction: column;
  }
}
</style> 