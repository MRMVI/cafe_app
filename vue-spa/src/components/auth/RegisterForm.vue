<template>
  <section class="register">
    <h2 class="heading">Register</h2>

    <div class="form_container">
      <Form
        @submit="onSubmit"
        :validation-schema="schema"
        :initial-values="{ role: 'user' }"
      >
        <!-- Name -->
        <div class="form_row">
          <div class="col-25">
            <label for="name">Name: </label>
          </div>
          <div class="col-75">
            <Field name="name" type="text" placeholder="Name..." as="input" />
          </div>
        </div>
        <div class="error-text">
          <ErrorMessage name="name" />
        </div>

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

        <!-- Password Confirmation -->
        <div class="form_row">
          <div class="col-25">
            <label for="password_confirmation">Confirm password: </label>
          </div>
          <div class="col-75">
            <Field
              name="password_confirmation"
              type="password"
              placeholder="Confirm password..."
            />
          </div>
        </div>
        <div class="error-text">
          <ErrorMessage name="password_confirmation" />
        </div>

        <button type="submit" :disabled="loading" class="submit_btn">
          {{ loading ? "registering ..." : "register" }}
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
        <p>✅ User registered successfully!</p>
      </div>
      <div v-for="(error, index) in errors" :key="index">
        <p style="color: red">❌ {{ error }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useAuthForm } from "@/composables/useAuthForm";
import { Form, Field, ErrorMessage } from "vee-validate";
import { register } from "@/api/auth";
import * as yup from "yup";
import { useUIStore } from "@/stores/useUIStore";

const uiStore = useUIStore();

const schema = yup.object({
  name: yup.string().required("* Name is required!"),
  email: yup
    .string()
    .required("* Email is required!")
    .email("* Please enter a valid email!"),
  password: yup
    .string()
    .required("* Password is required!")
    .min(8, "* At least 8 characters!"),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref("password")], "* Passwords must match!")
    .required("* Please confirm your password."),
});

const { success, loading, errors, onSubmit } = useAuthForm(register);
</script>

<style lang="scss">
@use "@/assets/styles/variables" as *;
@use "@/assets/styles/mixins" as *;

.heading {
  @include responsive-font(1rem, 3vw, 2rem);
  @include heading();
}
</style>
