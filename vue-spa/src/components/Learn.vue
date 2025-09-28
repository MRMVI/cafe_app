<template>
  <section class="register">
    <h2>Register</h2>
    <form @submit.prevent="submitForm">
      <!-- Name -->
      <label>
        Name:
        <input type="text" v-model="form.name" />
      </label>
      <!-- Email -->
      <label>
        Email:
        <input type="email" v-model="form.email" />
      </label>

      <!-- Password -->
      <label>
        Password:
        <input type="password" v-model="form.password" />
      </label>

      <!-- Confirm Password -->
      <label>
        Confirm Password:
        <input type="password" v-model="form.password_confirmation" />
      </label>

      <!-- Role -->
      <label>
        Role:
        <select v-model="form.role">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </label>

      <!-- Submit Button -->
      <button type="submit">Register</button>
    </form>

    <!-- Messages -->
    <p v-if="error">{{ error }}</p>
    <p v-if="success">Registration successful ✅</p>
  </section>
</template>

<script setup>
import { register } from "@/api/auth";
import { ref } from "vue";

// form state
const form = ref({
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
  role: "user",
});

// Error & success messages
const error = ref(null);
const success = ref(false);

async function submitForm() {
  error.value = null;
  success.value = null;

  try {
    const response = await register(form.value);
    success.value = true;
    console.log(response);
  } catch (err) {
    error.value = "Registration failed";
    console.log(err);
  }
}
</script>
