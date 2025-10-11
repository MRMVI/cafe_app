<template>
  <section class="add_menu_item">
    <h2 class="add_menu_item__header">Add Menu Item</h2>
    <div class="add_menu_item__form">
      <form @submit.prevent="onSubmit">
        <!-- Name -->
        <div class="input-field">
          <label>
            <span>Name:</span>
            <Field name="name" type="text" placeholder="Item name..." />
          </label>

          <div class="error-text"><ErrorMessage name="name" /></div>
        </div>
        <!-- Description -->
        <div class="input-field">
          <label>
            <span>Description:</span>
            <Field
              name="description"
              as="textarea"
              placeholder="Description."
              class="textarea"
            />
          </label>
          <div class="error-text"><ErrorMessage name="description" /></div>
        </div>
        <!-- Price -->
        <div class="input-field">
          <label>
            Price: <br />
            <Field name="price" type="number" />
          </label>
          <div class="error-text"><ErrorMessage name="price" /></div>
        </div>
        <!-- Is available -->
        <div class="input-field">
          <label>
            <span>Available</span>
            <input
              type="checkbox"
              :checked="isAvailable"
              @change="(e: Event) => (isAvailable = (e.target as HTMLInputElement).checked)"
            />
          </label>
          <div class="error-text"><ErrorMessage name="is_available" /></div>
        </div>
        <!-- Category -->
        <div class="input-field">
          <label for="category">
            <span>Category:</span>
            <Field as="select" name="category" class="dropdown">
              <option disabled value="">Select category</option>
              <option value="beverages">Beverages</option>
              <option value="food">Food</option>
              <option value="specials">Specials / Combos</option>
              <option value="extras">Extras / Add-ons</option>
            </Field>
          </label>

          <div class="error-text">
            <ErrorMessage name="category" class="error" />
          </div>
        </div>

        <!-- photo upload-->
        <div class="input-field">
          <label>
            <span>Upload photo:</span>
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              @change="handleFileChange"
            />
          </label>

          <div class="error-text">
            <p v-if="error">{{ error }}</p>
          </div>
        </div>

        <!-- Submit button -->
        <div>
          <button type="submit" :disabled="loading" class="submit-btn">
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

// 1️⃣ Define the type of our form values
import type { MenuItemFromValues } from "../../types";
import { onMounted, ref } from "vue";
import { useMenuStore } from "../../stores/menuStore";

// 2️⃣ Define validation schema
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

// 3️⃣ Setup useForm with explicit types
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

const { value: isAvailable } = useField<boolean>("is_available");

// photo
const file = ref<File | null>(null);
const error = ref<string>("");

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const selectedFile = target.files?.[0];
  if (!selectedFile) {
    file.value = null;
    error.value = "* Photo is required.";
    return;
  }

  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (!allowedTypes.includes(selectedFile.type)) {
    file.value = null;
    error.value = "* Only JPG, JPEG, or PNG files are allowed";
    return;
  }

  file.value = selectedFile;
  error.value = "";
}

const success = ref(false);
const errorMessage = ref("");
const loading = ref(false);
const menuStore = useMenuStore();

// 4️⃣ Submission callback
const onSubmit = handleSubmit(async (values: MenuItemFromValues) => {
  if (!file.value) {
    error.value = "*Photo is required";
    return;
  }

  try {
    success.value = false;
    loading.value = true;
    errorMessage.value = "";

    const data = { ...values, photo: file.value };
    await menuStore.createMenuItem(data);

    success.value = true;
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

.add_menu_item {
  @include responsive-flex-center();
  @include responsive-padding();
  @include responsive-margin();

  .add_menu_item__form {
    @include responsive-form();
    border: 1px solid $border-color;
  }
}

.feedback {
  @include responsive-feedback();
}
</style>
