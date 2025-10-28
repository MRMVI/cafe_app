import { ref } from "vue";

export function useAuthForm(apiFn) {
  const success = ref(false);
  const loading = ref(false);
  const errors = ref([]);

  const onSubmit = async (values) => {
    try {
      success.value = false;
      loading.value = true;
      errors.value = [];

      const response = await apiFn(values);
      success.value = true;

      return response.data;
    } catch (err) {
      console.error("Error: ", err);
      if (err.response) {
        const data = err.response.data;

        // Laravel validation errors
        if (data.errors) {
          errors.value = Object.values(data.errors).flat();
        }
        // Other error messages
        else if (data.message) {
          errors.value.push(data.message);
        }
      } else {
        errors.value.push("Network error or server not responding.");
      }
    } finally {
      loading.value = false;
    }
  };

  return {
    success,
    loading,
    errors,
    onSubmit,
  };
}
