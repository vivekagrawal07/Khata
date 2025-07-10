<template>
  <form @submit.prevent="handleSubmit" class="profile-form">
    <div class="form-section">
      <h3>Personal Information</h3>
      <div class="form-row">
        <div class="form-group">
          <label for="first_name" class="form-label">First Name *</label>
          <input
            id="first_name"
            v-model="form.first_name"
            type="text"
            class="form-control"
            required
            placeholder="Enter your first name"
          />
        </div>
        <div class="form-group">
          <label for="last_name" class="form-label">Last Name *</label>
          <input
            id="last_name"
            v-model="form.last_name"
            type="text"
            class="form-control"
            required
            placeholder="Enter your last name"
          />
        </div>
      </div>
      <div class="form-group">
        <label for="email" class="form-label">Email Address *</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          class="form-control"
          required
          placeholder="Enter your email address"
        />
      </div>
    </div>
    <div class="form-section">
      <h3>Company Information</h3>
      <div class="form-group">
        <label for="company_name" class="form-label">Company Name</label>
        <input
          id="company_name"
          v-model="form.company_name"
          type="text"
          class="form-control"
          placeholder="Enter your company name"
        />
      </div>
      <div class="form-group">
        <label for="phone" class="form-label">Phone Number</label>
        <input
          id="phone"
          v-model="form.phone"
          type="tel"
          class="form-control"
          placeholder="Enter your phone number"
        />
      </div>
      <div class="form-group">
        <label for="address" class="form-label">Address</label>
        <textarea
          id="address"
          v-model="form.address"
          class="form-control"
          rows="3"
          placeholder="Enter your business address"
        ></textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="city" class="form-label">City</label>
          <input
            id="city"
            v-model="form.city"
            type="text"
            class="form-control"
            placeholder="Enter your city"
          />
        </div>
        <div class="form-group">
          <label for="state" class="form-label">State/Province</label>
          <input
            id="state"
            v-model="form.state"
            type="text"
            class="form-control"
            placeholder="Enter your state"
          />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="zip_code" class="form-label">ZIP/Postal Code</label>
          <input
            id="zip_code"
            v-model="form.zip_code"
            type="text"
            class="form-control"
            placeholder="Enter your ZIP code"
          />
        </div>
        <div class="form-group">
          <label for="country" class="form-label">Country</label>
          <input
            id="country"
            v-model="form.country"
            type="text"
            class="form-control"
            placeholder="Enter your country"
          />
        </div>
      </div>
      <div class="form-group">
        <label for="GST_id" class="form-label">GST ID</label>
        <input
          id="GST_id"
          v-model="form.GST_id"
          type="text"
          class="form-control"
          placeholder="Enter your GST ID"
        />
      </div>
    </div>
    <div class="form-actions">
      <button type="button" @click="$router.go(-1)" class="btn btn-secondary">
        Cancel
      </button>
      <button type="submit" class="btn btn-primary" :disabled="loading">
        {{ loading ? 'Updating...' : 'Update Profile' }}
      </button>
    </div>
  </form>
</template>

<script>
export default {
  name: 'ProfileForm',
  props: {
    profile: {
      type: Object,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        first_name: '',
        last_name: '',
        email: '',
        company_name: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip_code: '',
        country: '',
        GST_id: ''
      }
    }
  },
  watch: {
    profile: {
      handler(newProfile) {
        if (newProfile) {
          this.loadProfileData(newProfile)
        }
      },
      immediate: true
    }
  },
  mounted() {
    if (this.profile) {
      this.loadProfileData(this.profile)
    }
  },
  methods: {
    loadProfileData(profile) {
      console.log('Loading profile data:', profile)
      this.form = {
        first_name: profile.first_name || profile.firstName || '',
        last_name: profile.last_name || profile.lastName || '',
        email: profile.email || '',
        company_name: profile.company_name || profile.companyName || '',
        phone: profile.phone || '',
        address: profile.address || '',
        city: profile.city || '',
        state: profile.state || '',
        zip_code: profile.zip_code || profile.zipCode || '',
        country: profile.country || '',
        GST_id: profile.GST_id || profile.gst_id || profile.gstId || ''
      }
      console.log('Form data loaded:', this.form)
    },
    handleSubmit() {
      console.log('Submitting profile data:', this.form)
      // Send all fields in snake_case to backend
      const profileData = { ...this.form }
      this.$emit('save', profileData)
    }
  }
}
</script>

<style scoped>
.profile-form {
  max-width: 600px;
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

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #495057;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-control:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.form-control:disabled {
  background-color: #e9ecef;
  opacity: 1;
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
  .form-section {
    padding: 1.5rem;
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
}
</style> 