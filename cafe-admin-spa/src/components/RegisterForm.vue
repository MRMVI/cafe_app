<template>
  <section class="register">
    <h2 class="heading">Register</h2>

    <div class="register-form">
      <form @submit.prevent="onSubmit">
        <!-- Name -->
        <div class="input-field">
          <label>
            Name:
            <Field
              type="text"
              name="name"
              as="input"
              placeholder="Enter your name..."
            />
          </label>
          <div class="error-text">
            <ErrorMessage name="name" />
          </div>
        </div>

        <!-- Email -->
        <div class="input-field">
          <label>
            Email:
            <Field
              type="email"
              name="email"
              as="input"
              placeholder="Enter your email address ..."
            />
          </label>
          <div class="error-text">
            <ErrorMessage name="email" />
          </div>
        </div>

        <!-- Password -->
        <div class="input-field">
          <label>
            Password:
            <Field
              type="password"
              name="password"
              as="input"
              placeholder="Enter password ..."
            />
          </label>
          <div class="error-text">
            <ErrorMessage name="password" />
          </div>
        </div>

        <!-- Password Confirmation -->
        <div class="input-field">
          <label>
            Confirm Password:
            <Field
              type="password"
              name="password_confirmation"
              as="input"
              placeholder="Confirm your password..."
            />
          </label>
          <div class="error-text">
            <ErrorMessage name="password_confirmation" />
          </div>
        </div>
        <div>
          <button type="submit" :disabled="loading" class="submit-btn">
            {{ loading ? "registering ..." : "register" }}
          </button>
        </div>
      </form>
    </div>

    <!-- Feedback -->
    <div class="feedback">
      <div v-if="success" class="success">
        <p>✅ User registered successfully!</p>
      </div>
      <div v-for="(error, index) in errorMessages" :key="index" class="error">
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

const { success, loading, errorMessages, onSubmitForm } = useAuthForm<
  RegisterValues,
  RegisterResponse
>(register);

// 2️⃣ Define validation schema
const schema = yup.object({
  name: yup.string().required("*Name is required."),
  email: yup.string().required("*Email is required."),
  password: yup.string().required("*Password is required."),
  password_confirmation: yup.string().required("*Confirm the password."),
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

// const router = useRouter();
// 4️⃣ Submission callback
const onSubmit = handleSubmit(async (values: RegisterValues) => {
  try {
    await onSubmitForm(values);
    // router.push("/login");
  } catch (err) {
    console.error(err);
  }
});
</script>

<style scoped lang="scss">
@import "@/styles/variables";
@import "@/styles/_mixins.scss";

.register {
  border: 1px solid $border-color;
  @include responsive-flex-center();
  @include responsive-padding();

  .register-form {
    @include responsive-form();
  }
}

.feedback {
  @include responsive-feedback();
}
</style>
