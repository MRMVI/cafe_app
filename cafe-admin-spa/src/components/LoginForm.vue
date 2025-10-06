<template>
  <section class="login">
    <h2 class="login">Login</h2>

    <div class="login-form">
      <form @submit.prevent="onSubmit">
        <!-- Name -->
        <div>
          <label>
            Email: <br />
            <Field type="email" name="email" as="input" />
          </label>

          <ErrorMessage name="email" />
        </div>

        <!-- Email -->
        <div>
          <label>
            Password:
            <Field type="password" name="password" as="input" />
          </label>

          <ErrorMessage name="password" />
        </div>

        <button type="submit" :disabled="loading" class="register-btn">
          {{ loading ? "logging in ..." : "log in" }}
        </button>
      </form>
    </div>

    <!-- Feedback -->
    <div class="feedback">
      <div v-if="success">
        <p>✅ User logged in successfully!</p>
      </div>
      <div v-for="(error, index) in errorMessages" :key="index">
        <p style="color: red">❌ {{ error }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useForm, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

import { useAuthForm } from "../composables/useAuthForm";
import { login } from "../api/auth/auth";
import { useRouter } from "vue-router";

// 1️⃣ Define the type of our form values
import type { LoginValues, LoginResponse } from "../types";

const { success, loading, errorMessages, onSubmitForm } = useAuthForm<
  LoginValues,
  LoginResponse
>(login);

// 2️⃣ Define validation schema
const schema = yup.object({
  email: yup.string().required("Email is required."),
  password: yup.string().required("Password is required."),
});

// 3️⃣ Setup useForm with explicit types
const { handleSubmit } = useForm<LoginValues>({
  validationSchema: schema,
  initialValues: {
    email: "",
    password: "",
  },
});

const router = useRouter();
// 4️⃣ Submission callback
const onSubmit = handleSubmit(async (values: LoginValues) => {
  try {
    const response = await onSubmitForm(values);
    if (response) {
      const { access_token } = response;

      localStorage.setItem("access_token", access_token);

      router.push("/dashboard");
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
});
</script>
