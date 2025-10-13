<template>
  <section class="login">
    <h2 class="loagin__heading">Login</h2>

    <div class="form_container">
      <form @submit.prevent="onSubmit">
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
        <div class="error-text"><ErrorMessage name="email" /></div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="submit_btn"
            :style="{ width: '100%' }"
          >
            {{ loading ? "logging in ..." : "log in" }}
          </button>
        </div>
      </form>
    </div>

    <!-- Feedback -->
    <div class="feedback">
      <div v-if="success" class="success">
        <p>✅ User logged in successfully!</p>
      </div>
      <div v-for="(error, index) in errorMessages" :key="index" class="error">
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
import { useUserStore } from "../stores/userStore";

const { success, loading, errorMessages, onSubmitForm } = useAuthForm<
  LoginValues,
  LoginResponse
>(login);

// 2️⃣ Define validation schema
const schema = yup.object({
  email: yup.string().required("*Email is required."),
  password: yup.string().required("*Password is required."),
});

// 3️⃣ Setup useForm with explicit types
const { handleSubmit } = useForm<LoginValues>({
  validationSchema: schema,
  initialValues: {
    email: "",
    password: "",
  },
});

// 4️⃣ Submission callback
const router = useRouter();
const userStore = useUserStore();

const onSubmit = handleSubmit(async (values: LoginValues) => {
  try {
    // remove old token if exists (force)
    localStorage.removeItem("access_token");

    const response = await onSubmitForm(values);
    if (response) {
      const { access_token, role } = response;

      if (role !== "admin") {
        errorMessages.value = [
          "Access denied. This portal is for admins only.",
        ];
        success.value = false;
        return;
      }

      localStorage.setItem("access_token", access_token);
      await userStore.fetchUser();
      router.push("/dashboard");
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
});
</script>

<style scoped lang="scss">
@import "@/styles/variables";
@import "@/styles/_mixins.scss";

.loagin__heading {
  text-align: center;
  margin: 10px;
}
.feedback {
  @include responsive-feedback();
}
</style>
