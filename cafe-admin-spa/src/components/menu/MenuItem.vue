<template>
  <section class="menu_item">
    <!-- Item Image -->
    <img
      :src="imagePreview || `http://127.0.0.1:8000/storage/${item?.photo_path}`"
      alt="Item photo"
      class="menu_photo"
    />
    <!-- Display Mode -->
    <div class="details" v-if="!isEditing">
      <h3 class="details-heading">{{ item?.name }}</h3>
      <p>{{ item?.description }}</p>
      <p>
        <strong>{{ item?.price }} AMD</strong>
      </p>
      <p v-if="item?.is_available" style="color: green">Available</p>
      <p v-else style="color: red">Unavailable</p>
    </div>
    <!-- Edit Mode -->
    <div class="edit-form" v-else>
      <form @submit.prevent="handleSave">
        <!-- Name -->

        <div class="input-field">
          <label>
            Name:
            <Field name="name" type="text" :placeholder="item.name" />
          </label>

          <div class="error-text"><ErrorMessage name="name" /></div>
        </div>
        <!-- Description -->
        <div class="input-field">
          <label>
            Description:
            <Field
              name="description"
              as="textarea"
              :placeholder="item.description"
              class="textarea"
            />
          </label>
          <div class="error-text"><ErrorMessage name="description" /></div>
        </div>
        <!-- Price -->
        <div class="input-field">
          <label>
            Price:
            <Field name="price" type="number" :placeholder="item.price" />
          </label>
          <div class="error-text"><ErrorMessage name="price" /></div>
        </div>
        <!-- Is available -->
        <div class="input-field">
          <label>
            Available
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
            Category:
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
            Upload photo:
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              @change="handleFileChange"
            />
          </label>
        </div>

        <div class="buttons">
          <button type="submit" title="Save">💾</button>
          <button type="button" @click="handleCancel" title="Cancel">❌</button>
        </div>
      </form>
    </div>

    <!-- Actions -->
    <div class="buttons" v-if="!isEditing">
      <button type="button" @click="handleDelete" title="Delete">🗑️</button>
      <button type="button" @click="startEdit" title="Edit">✏️</button>
    </div>
  </section>
</template>
<script setup lang="ts">
import type { Item, MenuItemFromValues } from "../../types";
import { useMenuStore } from "../../stores/menuStore";
import { computed, defineProps, onMounted, reactive, ref } from "vue";

import { useForm, useField, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

const props = defineProps<{ id: number }>();

const menuStore = useMenuStore();

let item = reactive({ ...menuStore.getItem(props.id) });

const handleDelete = async () => {
  const confirmed = confirm(`Are you sure you want to delete "${item?.name}"?`);
  if (!confirmed) return;

  try {
    await menuStore.deleteMenuItem(`${item?.id}`);
    alert(`"${item?.name}" was deleted successfully.`);
  } catch (err) {
    alert("Failed to delete the item from the menu.");
  }
};

// Define validation schema
const schema = yup.object({
  name: yup.string(),
  description: yup.string(),
  price: yup.number().min(0, "* Price cannot be negative."),
  is_available: yup.boolean().default(false),
  category: yup
    .mixed<MenuItemFromValues["category"]>()
    .oneOf(
      ["beverages", "food", "specials", "extras"],
      "*Select a valid category"
    ),
});

const { handleSubmit, resetForm } = useForm<MenuItemFromValues>({
  validationSchema: schema,
  initialValues: {
    is_available: item.is_available,
  },
});

const { value: isAvailable } = useField<boolean>("is_available");

// reactive state
const isEditing = ref(false);
const imageFile = ref<File | null>(null);
const imagePreview = ref<string | null>(null);

const startEdit = () => {
  isEditing.value = true;
  imagePreview.value = null;
  imageFile.value = null;

  resetForm({
    values: {
      is_available: item?.is_available,
    },
  });
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const selectedFile = target.files?.[0];

  if (selectedFile) {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(selectedFile.type)) {
      imageFile.value = null;
      return;
    }

    imageFile.value = selectedFile;
    imagePreview.value = URL.createObjectURL(selectedFile);
  }
};

const handleSave = handleSubmit(async (values: MenuItemFromValues) => {
  // Remove undefined keys
  let editedFields = Object.fromEntries(
    Object.entries(values).filter(([_, v]) => v !== undefined && v !== "")
  );

  // if (imageFile.value) {
  //   editedFields = { ...editedFields, photo: imageFile.value };
  // }

  console.log(editedFields);

  try {
    const updatedItem = await menuStore.updateMenuItem(props.id, editedFields);
    console.log("Updated Item", updatedItem);
    item = { ...updatedItem };
    alert("Item updated successfully.");
  } catch (err) {
    alert("Failed to update the item.");
  } finally {
    imagePreview.value = null;
    isEditing.value = false;
  }
});
const handleCancel = () => {
  isEditing.value = false;
  imagePreview.value = null;
};
</script>

<style scoped lang="scss">
@import "@/styles/variables";
@import "@/styles/_mixins.scss";

/* 🧾 Menu Item Layout */
.menu_item {
  @include card();
  @include responsive-text();
  flex-wrap: wrap;

  .menu_photo {
    width: 160px;
    height: 120px;
    object-fit: cover;
    border: 3px solid $shadow-color;
    box-shadow: 0 4px 12px $shadow-color;
  }

  /* 🖼️ Image */

  /* 📄 Text section */
  .details {
    @include responsive-flex-center(column, center, flex-start);

    .details-heading {
      color: $primary-color;
      text-transform: capitalize;
    }

    p {
      color: $text-color;
    }

    strong {
      color: #222;
      font-weight: 600;
    }

    /* Status text */
    p[style*="color: green"] {
      color: #2ecc71 !important;
      font-weight: 500;
    }

    p[style*="color: red"] {
      color: #e74c3c !important;
      font-weight: 500;
    }
  }

  /* 🔘 Buttons */
  button {
    background: none;
    border: none;
    cursor: pointer;
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.2);
    }
  }

  max-width: 50%;
  margin: 0px auto;

  @media (max-width: $breakpoint-desktop) {
    background-color: blue;
  }

  @media (max-width: $breakpoint-tablet) {
    background-color: green;
  }

  @media (max-width: $breakpoint-mobile) {
    background-color: yellow;
    margin-left: 0px;
    margin-right: 0px;
    padding-left: 0px;
    padding-right: 0px;
  }
}

.edit-form {
  @include responsive-form();
}
</style>
