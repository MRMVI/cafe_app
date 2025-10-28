<template>
  <section
    class="menu_item"
    :style="{ flexDirection: isEditing ? 'column' : 'row' }"
  >
    <!-- Item Image -->
    <img
      :src="`http://127.0.0.1:8000/storage/${item?.photo_path}`"
      alt="Item photo"
      class="menu_photo"
    />
    <!-- Display Mode -->
    <div class="menu_item_container" v-if="!isEditing">
      <h3 class="details-heading">{{ item?.name }}</h3>
      <p>Description: {{ item?.description }}</p>
      <p>
        Price: <span class="strong">{{ item?.price }} AMD</span>
      </p>
      <p v-if="item?.is_available" class="available">Available</p>
      <p v-else class="unavailable">Unavailable</p>
    </div>
    <!-- Edit Mode -->
    <div class="form-container" v-else>
      <form @submit.prevent="handleSave">
        <!-- Name -->
        <div class="form_row">
          <div class="col-25">
            <label for="name">Name: </label>
          </div>

          <div class="col-75">
            <Field id="name" name="name" type="text" :placeholder="item.name" />
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
              :placeholder="item.description"
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
            <Field
              id="price"
              name="price"
              type="number"
              :placeholder="item.price"
            />
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
import type { MenuItemFromValues } from "../../types";
import { useMenuStore } from "../../stores/menuStore";
import { defineProps, reactive, ref } from "vue";

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
    category: item?.category,
  },
});

const { value: isAvailable } = useField<boolean>("is_available");

// reactive state
const isEditing = ref(false);

const startEdit = () => {
  isEditing.value = true;

  resetForm({
    values: {
      is_available: item?.is_available,
      category: item?.category,
    },
  });
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
    isEditing.value = false;
  }
});
const handleCancel = () => {
  isEditing.value = false;
};
</script>

<style scoped lang="scss">
@import "@/styles/variables";
@import "@/styles/_mixins.scss";

/* 🧾 Menu Item Layout */
.menu_item {
  @include card();
  @include responsive-text();

  .menu_photo {
    max-width: 300px;
    max-height: 300px;
    border-radius: 8px;
    object-fit: cover;

    @include tablet {
      max-width: 200px;
      max-height: 200px;
    }
    @include mobile {
      max-width: 200px;
      max-height: 200px;
    }

    // border: 3px solid $border-color;
    // box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }

  /* 🖼️ Image */

  /* 📄 Text section */
  .menu_item_container {
    color: $text-color;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .details-heading {
      color: $primary-color;
      text-transform: capitalize;
    }

    .strong {
      color: #222;
      font-weight: 600;
    }

    .available {
      color: $secondary-color;
    }

    .unavailable {
      color: $accent-color;
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

  min-width: 50%;
  margin: 0px auto;

  @media (max-width: $breakpoint-desktop) {
    min-width: 100%;
  }
}
</style>
