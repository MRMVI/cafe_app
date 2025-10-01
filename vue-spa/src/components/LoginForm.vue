<template>
  <section class="login">
    <h2 class="heading">Login</h2>

    <div class="login-form">
      <Form @submit="handleLogin" :validation-schema="schema">
        <!-- Email -->
        <div>
          <label>
            Email: <br />
            <Field name="email" type="email" placeholder="Email..." />
          </label>
          <div class="error-message">
            <ErrorMessage name="email" />
          </div>
        </div>

        <!-- Password -->
        <div>
          <label>
            Password: <br />
            <Field name="password" type="password" placeholder="Password..." />
          </label>
          <div class="password">
            <ErrorMessage name="password" />
          </div>
        </div>

        <button type="submit" :disabled="loading" class="login-btn">
          {{ loading ? "logging in ..." : "login" }}
        </button>
      </Form>
    </div>

    <!-- Feedback -->
    <div class="feedback">
      <div v-if="success">
        <p>✅ User logged in successfully!</p>
      </div>
      <div v-for="(error, index) in errors" :key="index">
        <p style="color: red">❌ {{ error }}</p>
      </div>
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
});

const { success, loading, errors, onSubmit } = useAuthForm(login);

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
    console.error("Error: ", err);
    return;
  }
}
</script>

<style lang="scss">
@use "@/assets/styles/variables" as *;
@use "@/assets/styles/mixins" as *;

.heading {
  @include responsive-font(1rem, 3vw, 2rem);
  @include heading();
}

.login-form {
  @include form-container();

  h2 {
    @include form-heading();
  }

  input {
    @include form-input();
  }

  .error-message {
    @include form-error();
  }

  .login-btn {
    @include button-style($color-accent, $color-primary);
    width: 100%;
  }
}
</style>
