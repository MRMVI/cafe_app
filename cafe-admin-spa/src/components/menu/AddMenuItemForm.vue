<template>
  <section class="add_menu_item">
    <h1 class="add_menu_item__heading">Add Menu Item</h1>
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

        <!-- Description -->
        <div class="form_row">
          <div class="col-25">
            <label for="description">Description: </label>
          </div>
          <div class="col-75">
            <Field
              id="description"
              name="description"
              as="textarea"
              placeholder="Description."
              class="textarea"
            />
          </div>
        </div>
        <div class="error-text"><ErrorMessage name="description" /></div>

        <!-- Price -->
        <div class="form_row">
          <div class="col-25">
            <label for="price">Price: </label>
          </div>
          <div class="col-75">
            <Field id="price" name="price" type="number" />
          </div>
          <div class="error-text"><ErrorMessage name="price" /></div>
        </div>

        <!-- Is available -->
        <div class="form_row">
          <div class="col-25">
            <label for="isAvailable">Available: </label>
          </div>
          <div class="col-75">
            <input
              id="isAvailable"
              type="checkbox"
              :checked="isAvailable"
              @change="(e: Event) => (isAvailable = (e.target as HTMLInputElement).checked)"
            />
          </div>
        </div>
        <div class="error-text"><ErrorMessage name="is_available" /></div>

        <!-- Category -->
        <div class="form_row">
          <div class="col-25">
            <label for="category">Category: </label>
          </div>
          <div class="col-75">
            <Field as="select" name="category" class="dropdown">
              <option disabled value="">Select category</option>
              <option value="beverages">Beverages</option>
              <option value="food">Food</option>
              <option value="specials">Specials / Combos</option>
              <option value="extras">Extras / Add-ons</option>
            </Field>
          </div>
        </div>
        <div class="error-text">
          <ErrorMessage name="category" class="error" />
        </div>

        <!-- photo upload-->
        <div class="form_row">
          <div class="col-25">
            <label for="photo">Upload photo: </label>
          </div>
          <div class="col-75">
            <input
              id="photo"
              type="file"
              accept=".jpg,.jpeg,.png"
              @change="handleFileChange"
            />
            <!-- Preview -->
            <div v-if="imagePreview" class="image-preview">
              <img :src="imagePreview" alt="Image preview" />
            </div>
          </div>
        </div>
        <div class="error-text">
          <p v-if="error">{{ error }}</p>
        </div>

        <!-- Submit button -->
        <div>
          <button type="submit" :disabled="loading" class="submit_btn">
            {{ loading ? "Adding..." : "Add" }}
          </button>
        </div>
      </form>
    </div>

    <!-- Feedback -->
    <div class="feedback">
      <div v-if="success" class="success">
        <p>✅ Item added successfully!</p>
        <p>Check the menu to see the new item.</p>
      </div>
      <div v-if="errorMessage" class="error">
        <p style="color: red">❌ {{ errorMessage }}</p>
        <div v-for="errMsg in menuStore.createMenuItemErrorMessages">
          <p style="color: red">❌ {{ errMsg }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useForm, useField, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import type { MenuItemFromValues } from "../../types";
import { ref } from "vue";
import { useMenuStore } from "../../stores/menuStore";

// Validation schema
const schema = yup.object({
  name: yup.string().required("* Item name is required."),
  description: yup.string().required("* Description is required."),
  price: yup
    .number()
    .required("* Price is required.")
    .min(0, "* Price cannot be negative."),
  is_available: yup
    .boolean()
    .required("* Specify if the item is available.")
    .default(false),
  category: yup
    .mixed<MenuItemFromValues["category"]>()
    .oneOf(
      ["beverages", "food", "specials", "extras"],
      "* Select a valid category"
    )
    .required("* Category is required"),
});

// useForm
const { handleSubmit } = useForm<MenuItemFromValues>({
  validationSchema: schema,
  initialValues: {
    name: "",
    description: "",
    price: 0,
    is_available: false,
    category: "" as MenuItemFromValues["category"],
  },
});

// useField for checkbox
const { value: isAvailable } = useField<boolean>("is_available");

// photo upload
const file = ref<File | null>(null);
const imagePreview = ref<string | null>(null); // 👈 added for preview
const error = ref<string>("");

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const selectedFile = target.files?.[0];
  if (!selectedFile) {
    file.value = null;
    imagePreview.value = null;
    error.value = "* Photo is required.";
    return;
  }

  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (!allowedTypes.includes(selectedFile.type)) {
    file.value = null;
    imagePreview.value = null;
    error.value = "* Only JPG, JPEG, or PNG files are allowed";
    return;
  }

  file.value = selectedFile;
  imagePreview.value = URL.createObjectURL(selectedFile); // 👈 generate preview
  error.value = "";
}

// submission state
const success = ref(false);
const errorMessage = ref("");
const loading = ref(false);
const menuStore = useMenuStore();

// form submit
const onSubmit = handleSubmit(async (values: MenuItemFromValues) => {
  if (!file.value) {
    error.value = "* Photo is required";
    return;
  }

  try {
    success.value = false;
    loading.value = true;
    errorMessage.value = "";

    const data = { ...values, photo: file.value };
    await menuStore.createMenuItem(data);

    success.value = true;
    file.value = null;
    imagePreview.value = null; // clear preview after successful submission
  } catch (err: unknown) {
    errorMessage.value = "Failed to add the item to the menu.";
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped lang="scss">
@import "@/styles/variables";
@import "@/styles/_mixins.scss";

.add_menu_item__heading {
  text-align: center;
  margin: 10px;
}

.add_menu_item {
  max-width: 50%;
  margin: 0px auto;

  @media (max-width: $breakpoint-desktop) {
    max-width: 80%;
  }

  @media (max-width: $breakpoint-tablet) {
    max-width: 100%;
  }
}

/* Image preview styling */
.image-preview {
  margin-top: 10px;
  img {
    max-width: 200px;
    max-height: 200px;
    border-radius: 8px;
    object-fit: cover;
  }
}
</style>
