<template>
  <div>
    <div v-if="type === 'list'" class="skeleton-list">
      <div class="skeleton skeleton-list-row" v-for="n in rows" :key="n"></div>
    </div>
    <div v-else-if="type === 'form'" class="skeleton-form">
      <div class="skeleton skeleton-form-field" v-for="n in fields" :key="n"></div>
      <div class="skeleton skeleton-form-btn"></div>
    </div>
    <div v-else-if="type === 'card'" class="skeleton-card-grid">
      <div class="skeleton skeleton-card" v-for="n in cards" :key="n"></div>
    </div>
    <div v-else-if="type === 'profile'" class="skeleton-profile">
      <div class="skeleton skeleton-avatar"></div>
      <div class="skeleton skeleton-profile-line" v-for="n in 4" :key="n"></div>
    </div>
    <div v-else class="skeleton-default">
      <div class="skeleton skeleton-default-line" v-for="n in 3" :key="n"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SkeletonLoader',
  props: {
    type: {
      type: String,
      default: 'default'
    },
    rows: {
      type: Number,
      default: 6
    },
    fields: {
      type: Number,
      default: 5
    },
    cards: {
      type: Number,
      default: 3
    }
  }
}
</script>

<style scoped>
.skeleton {
  background: linear-gradient(90deg, #f8fafc 25%, #e3e9f7 50%, #f8fafc 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.2s infinite linear;
  border-radius: 0.7rem;
}
@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
.skeleton-list {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  margin: 2rem 0;
}
.skeleton-list-row {
  height: 32px;
  width: 100%;
}
.skeleton-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  margin: 2rem 0;
  max-width: 500px;
}
.skeleton-form-field {
  height: 28px;
  width: 100%;
}
.skeleton-form-btn {
  height: 38px;
  width: 120px;
  align-self: flex-end;
  margin-top: 0.5rem;
}
.skeleton-card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin: 2rem 0;
}
.skeleton-card {
  height: 140px;
  border-radius: 1.2rem;
}
.skeleton-profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
  margin: 2rem 0;
}
.skeleton-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}
.skeleton-profile-line {
  width: 220px;
  height: 20px;
}
.skeleton-default {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  margin: 2rem 0;
}
.skeleton-default-line {
  height: 24px;
  width: 100%;
}
@media (max-width: 900px) {
  .skeleton-card-grid {
    grid-template-columns: 1fr;
    gap: 1.2rem;
  }
}
</style> 