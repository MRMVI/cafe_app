<template>
  <section class="register">
    <h2 class="heading">Register</h2>

    <div class="register-form">
      <form @submit.prevent="onSubmit">
        <!-- Name -->
        <div>
          <label>
            Name: <br />
            <Field type="text" name="name" as="input" />
          </label>

          <ErrorMessage name="name" />
        </div>

        <!-- Email -->
        <div>
          <label>
            Email:
            <Field type="email" name="email" as="input" />
          </label>

          <ErrorMessage name="email" />
        </div>

        <!-- Password -->
        <div>
          <label>
            Password:
            <Field type="password" name="password" as="input" />
          </label>

          <ErrorMessage name="password" />
        </div>

        <!-- Password Confirmation -->
        <div>
          <label>
            Confirm Password:
            <Field type="password" name="password_confirmation" as="input" />
          </label>

          <ErrorMessage name="password_confirmation" />
        </div>

        <button type="submit" :disabled="loading" class="register-btn">
          {{ loading ? "registering ..." : "register" }}
        </button>
      </form>
    </div>

    <!-- Feedback -->
    <div class="feedback">
      <div v-if="success">
        <p>✅ User registered successfully!</p>
      </div>
      <div v-for="(error, index) in errorMessages" :key="index">
        <p style="color: red">❌ {{ error }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useAuthForm } from "../composables/useAuthForm";
import { register } from "../api/auth/auth";

import { useForm, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

// 1️⃣ Define the type of our form values
import type { RegisterResponse, RegisterValues } from "../types";
import { useRouter } from "vue-router";

const { success, loading, errorMessages, onSubmitForm } = useAuthForm<
  RegisterValues,
  RegisterResponse
>(register);

// 2️⃣ Define validation schema
const schema = yup.object({
  name: yup.string().required("Name is required."),
  email: yup.string().required("Email is required."),
  password: yup.string().required("Password is required."),
  password_confirmation: yup.string().required("Confirm the password."),
});

// 3️⃣ Setup useForm with explicit types
const { handleSubmit } = useForm<RegisterValues>({
  validationSchema: schema,
  initialValues: {
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  },
});

const router = useRouter();
// 4️⃣ Submission callback
const onSubmit = handleSubmit(async (values: RegisterValues) => {
  try {
    await onSubmitForm(values);
    router.push("/login");
  } catch (err) {
    console.error(err);
    throw err;
  }
});
</script>
