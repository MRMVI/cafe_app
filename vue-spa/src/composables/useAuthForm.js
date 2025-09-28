import { ref } from "vue";

export function useAuthForm(apiFn) {
  const success = ref(false);
  const loading = ref(false);
  const error = ref(null);

  const onSubmit = async (values) => {
    try {
      loading.value = true;
      error.value = null;

      const response = await apiFn(values);

      success.value = true;

      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || "Something went wrong!";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  return {
    success,
    loading,
    error,
    onSubmit,
  };
}
