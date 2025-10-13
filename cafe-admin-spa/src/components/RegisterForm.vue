<template>
  <section class="register">
    <h2 class="register_heading">Register</h2>

    <div class="form_container">
      <form @submit.prevent="onSubmit">
        <!-- Name -->
        <div class="form_row">
          <div class="col-25">
            <label for="name">Name: </label>
          </div>

          <div class="col-75">
            <Field
              id="name"
              name="name"
              type="text"
              placeholder="Item name..."
            />
          </div>
        </div>
        <div class="error-text"><ErrorMessage name="name" /></div>

        <!-- Email -->
        <div class="form_row">
          <div class="col-25">
            <label for="email">Email: </label>
          </div>

          <div class="col-75">
            <Field
              id="email"
              name="email"
              type="email"
              placeholder="Email address..."
              as="input"
            />
          </div>
        </div>
        <div class="error-text"><ErrorMessage name="email" /></div>

        <!-- Password -->
        <div class="form_row">
          <div class="col-25">
            <label for="password">Password: </label>
          </div>

          <div class="col-75">
            <Field
              id="password"
              name="password"
              type="password"
              placeholder="Enter Password ..."
              as="input"
            />
          </div>
        </div>
        <div class="error-text"><ErrorMessage name="password" /></div>

        <!-- Password Confirmation -->
        <div class="form_row">
          <div class="col-25">
            <label for="password_confirmation">Confirm Password:: </label>
          </div>

          <div class="col-75">
            <Field
              id="password_confirmation"
              name="password_confirmation"
              type="password"
              placeholder="Enter Password ..."
              as="input"
            />
          </div>
        </div>
        <div class="error-text">
          <ErrorMessage name="password_confirmation" />
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="submit_btn"
            :style="{ width: '100%' }"
          >
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

.register_heading {
  text-align: center;
  margin: 10px;
}

.feedback {
  @include responsive-feedback();
}
</style>
