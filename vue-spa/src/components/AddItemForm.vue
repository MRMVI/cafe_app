<template>
  <section class="addItem">
    <h2>Add Item to the menu</h2>

    <Form :validation-schema="schema" @submit="handleSubmit">
      <!-- Name -->
      <div>
        <label>
          Name:
          <Field name="name" type="text" placeholder="Name..." />
        </label>
        <ErrorMessage name="name" />
      </div>
      <!-- Description -->
      <div>
        <label>
          Description:
          <Field name="description" as="textarea" />
        </label>
        <ErrorMessage name="description" />
      </div>
      <!-- Price -->
      <div>
        <label>
          Price:
          <Field name="price" type="number" />
        </label>
        <ErrorMessage name="price" />
      </div>

      <!-- Is_available -->
      <div>
        <label> <Field name="is_available" type="checkbox" /> Available</label>
        <ErrorMessage name="is_available" />
      </div>
      <!-- photo upload-->
      <div>
        <label>
          Photo:
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            @change="handleFileChange"
          />
        </label>
        <p v-if="error">{{ error }}</p>
      </div>

      <!-- Submit button -->
      <button type="submit">Submit</button>
    </Form>
  </section>
</template>

<script setup>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { ref } from "vue";
import { createItem } from "@/api/items";

const schema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .max(255, "Name must be at most 255 characters"),
  description: yup.string().nullable(),
  price: yup
    .number()
    .required("Price is required")
    .min(0, "Price must be at least 0"),
  is_available: yup.boolean(),
});

// hold selected file
const file = ref(null);
const error = ref(null);

function handleFileChange(event) {
  const selectedFile = event.target.files[0];
  if (!selectedFile) {
    file.value = null;
    error.value = "Photo is required";
    return;
  }

  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (!allowedTypes.includes(selectedFile.type)) {
    file.value = null;
    error.value = "Only JPG, JPEG, or PNG files are allowed";
    return;
  }

  file.value = selectedFile;
  error.value = null;
}

function handleSubmit(values) {
  if (!file.value) {
    error.value = "Photo is required";
    return;
  }
  const data = { ...values, photo: file.value };
  console.log("Form submitted", data);

  // Here you can send 'values' to your API
  try {
    const response = createItem(data);
    console.log(response.data);

    return response;
  } catch (err) {
    console.error(err);
  }
}
</script>
