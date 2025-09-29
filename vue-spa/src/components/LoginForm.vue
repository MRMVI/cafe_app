<template>
  <section class="login">
    <h2>Login</h2>

    <Form @submit="handleLogin" :validation-schema="schema">
      <!-- Email -->
      <div>
        <label>
          Email:
          <Field name="email" type="email" placeholder="Email..." />
        </label>
        <ErrorMessage name="email" />
      </div>

      <!-- Password -->
      <div>
        <label>
          Password:
          <Field name="password" type="password" placeholder="Password..." />
        </label>
        <ErrorMessage name="password" />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? "logging in ..." : "login" }}
      </button>
    </Form>

    <!-- Feedback -->
    <div v-if="success">
      <p>✅ Login successful</p>
    </div>
    <div v-if="error">
      <p style="color: red">❌ {{ error }}</p>
    </div>
  </section>
</template>

<script setup>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { login } from "@/api/auth";
import { useAuthForm } from "@/composables/useAuthForm";
import { useRouter } from "vue-router";

const router = useRouter();

const schema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email"),
  password: yup
    .string()
    .required("Password is required.")
    .min(8, "At least 8 characters"),
});

const { success, loading, error, onSubmit } = useAuthForm(login);

async function handleLogin(values) {
  try {
    const { user } = await onSubmit(values);

    // Redirect based on role
    if (user.role === "admin") {
      router.push("/dashboard");
    } else if (user.role === "user") {
    } else {
      router.push("/");
    }
  } catch (err) {
    error.value = err.message || "Login failed";
  }
}
</script>
