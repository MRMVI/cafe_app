<template>
  <section class="register">
    <h2 class="heading">Register</h2>

    <div class="register-form">
      <Form
        @submit="onSubmit"
        :validation-schema="schema"
        :initial-values="{ role: 'user' }"
      >
        <!-- Name -->
        <div>
          <label>
            Name: <br />
            <Field name="name" type="text" placeholder="Name..." />
          </label>
          <div class="error-message">
            <ErrorMessage name="name" />
          </div>
        </div>

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

          <div class="error-message"><ErrorMessage name="password" /></div>
        </div>

        <!-- Password Confirmation -->
        <div>
          <label>
            Confirm password: <br />
            <Field
              name="password_confirmation"
              type="password"
              placeholder="Confirm password..."
            />
          </label>

          <div class="error-message">
            <ErrorMessage name="password_confirmation" />
          </div>
        </div>

        <!-- Role -->
        <div>
          <label> <Field name="role" type="radio" value="user" /> User </label>
          <label>
            <Field name="role" type="radio" value="admin" /> Admin
          </label>
          <div class="error-message">
            <ErrorMessage name="role" />
          </div>
        </div>

        <button type="submit" :disabled="loading" class="register-btn">
          {{ loading ? "registering ..." : "register" }}
        </button>
      </Form>
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

const schema = yup.object({
  name: yup.string().required("*Name is required!"),
  email: yup
    .string()
    .required("*Email is required!")
    .email("*Please enter a valid email!"),
  password: yup
    .string()
    .required("*Password is required!")
    .min(8, "*At least 8 characters!"),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref("password")], "*Passwords must match!")
    .required("*Please confirm your password."),
  role: yup
    .string()
    .oneOf(["user", "admin"], "*Role must be either user or admin!")
    .required("*Please select a role."),
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

.register-form {
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

  .register-btn {
    @include button-style($color-accent, $color-primary);
    width: 100%;
  }
}
</style>
