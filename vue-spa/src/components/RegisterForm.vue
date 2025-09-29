<template>
  <section class="register">
    <h2>Register</h2>
    <Form
      @submit="onSubmit"
      :validation-schema="schema"
      :initial-values="{ role: 'user' }"
    >
      <!-- Name -->
      <div>
        <label>
          Name:
          <Field name="name" type="text" placeholder="Name..." />
        </label>

        <ErrorMessage name="name" />
      </div>

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

      <!-- Password Confirmation -->
      <div>
        <label>
          Password:
          <Field
            name="password_confirmation"
            type="password"
            placeholder="Confirm password..."
          />
        </label>

        <ErrorMessage name="password_confirmation" />
      </div>

      <!-- Role -->
      <div>
        <label> <Field name="role" type="radio" value="user" /> User </label>
        <label> <Field name="role" type="radio" value="admin" /> Admin </label>
        <ErrorMessage name="role" />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? "registering ..." : "register" }}
      </button>
    </Form>

    <!-- Feedback -->
    <div v-if="success">
      <p>✅ User registered successfully</p>
    </div>
    <div v-if="error">
      <p style="color: red">❌ {{ error }}</p>
    </div>
  </section>
</template>

<script setup>
import { useAuthForm } from "@/composables/useAuthForm";
import { Form, Field, ErrorMessage } from "vee-validate";
import { register } from "@/api/auth";
import * as yup from "yup";

const schema = yup.object({
  name: yup.string().required("Name is required."),
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email"),
  password: yup
    .string()
    .required("Password is required.")
    .min(8, "At least 8 characters"),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
  role: yup
    .string()
    .oneOf(["user", "admin"], "Role must be either user or admin")
    .required("Please select a role"),
});

const { success, loading, error, onSubmit } = useAuthForm(register);
</script>
