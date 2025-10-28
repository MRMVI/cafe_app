<template>
  <section class="login">
    <h2 class="heading">Login</h2>

    <div class="form_container">
      <Form @submit="handleLogin" :validation-schema="schema">
        <!-- Email -->
        <div class="form_row">
          <div class="col-25">
            <label for="email">Email: </label>
          </div>
          <div class="col-75">
            <Field name="email" type="email" placeholder="Email..." />
          </div>
        </div>
        <div class="error-text">
          <ErrorMessage name="email" />
        </div>

        <!-- Password -->
        <div class="form_row">
          <div class="col-25">
            <label for="password">Password: </label>
          </div>
          <div class="col-75">
            <Field
              name="password"
              type="password"
              placeholder="Your password..."
            />
          </div>
        </div>
        <div class="error-text">
          <ErrorMessage name="password" />
        </div>

        <button type="submit" :disabled="loading" class="submit_btn">
          {{ loading ? "logging in ..." : "login" }}
        </button>
      </Form>
      <div class="go_back_container">
        <router-link to="/" class="go_back" @click="uiStore.toggleCTA"
          >go back</router-link
        >
      </div>
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
import { useUIStore } from "@/stores/useUIStore";

const uiStore = useUIStore();

const router = useRouter();

const schema = yup.object({
  email: yup
    .string()
    .required("* Email is required")
    .email("* Please enter a valid email."),
  password: yup.string().required("* Please enter your password."),
});

const { success, loading, errors, onSubmit } = useAuthForm(login);

async function handleLogin(values) {
  try {
    // remove old token if exists (force)
    localStorage.removeItem("access_token");

    const response = await onSubmit(values);
    if (response) {
      const { access_token, role } = response;

      if (role !== "user") {
        errors.value = ["Access denied. This portal is for users only."];
        success.value = false;
        return;
      }

      localStorage.setItem("access_token", access_token);

      router.push("/dashboard");
    }
  } catch (err) {
    console.error("Error: ", err);
  }
}
</script>

<style lang="scss">
@use "@/assets/styles/variables" as *;
@use "@/assets/styles/mixins" as *;

.heading {
  @include responsive-font(1rem, 3vw, 2rem);
  margin: 0.5rem;
  font-family: $font-heading;
  font-weight: 400;
  text-align: center;
}
</style>
