import type { AxiosResponse } from "axios";
import { ref } from "vue";
import type {Ref} from "vue";


// apiFn: (values: T1) values are the payloads
// Promise<AxiosResponse<T2>> T2 is the data in axios response
export function useAuthForm<T1, T2>(apiFn: (values: T1) => Promise<AxiosResponse<T2>>) {
    const success: Ref<boolean> = ref(false);
    const loading: Ref<boolean> = ref(false);
    const errorMessages: Ref<string[]> = ref([]);

    const onSubmitForm = async (values : T1)  => {
        try {
            success.value = false;
            loading.value = true;
            errorMessages.value = [];

            const response = await apiFn(values);
            success.value = true;      
            
            return response.data;
        } catch(err: any) {

            // Axios errors have a response property
            if (err.response) {
                const data = err.response.data; // data that server sends

                // Laravel errors
                if (data.errors) {
                    errorMessages.value = Object.values(data.errors).flat() as string[];
                } else if (data.message) {
                    errorMessages.value.push(data.message);
                } else {
                    errorMessages.value.push("Network error or server not responding.");
                }
            }

        } finally{
            loading.value = false; 
        }
    }


    return {
        success, 
        loading, 
        errorMessages, 
        onSubmitForm
    }
}

// items=> CRUD