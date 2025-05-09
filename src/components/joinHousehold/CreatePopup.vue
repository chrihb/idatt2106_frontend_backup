<script setup>
import {useI18n} from "vue-i18n";
import {XMarkIcon, CheckCircleIcon, XCircleIcon, ArrowLeftIcon} from "@heroicons/vue/24/solid/index.js";
import {useForm} from "vee-validate";
import {ref, computed} from "vue";
import {getAddressSuggestions} from "@/utils/addressTranslationUtil.js";
import FormField from "@/components/input/FormField.vue";
import {createHousehold} from "@/services/householdService.js";
import {useRouter} from "vue-router";
import { useUserStore } from "@/stores/userStore.js";

const { t } = useI18n();
const router = useRouter();
const userStore = useUserStore();


const props = defineProps({
  onClose: {
    type: Function,
    required: true,
  },
});

const { validate, values: form, errors, setFieldError, setFieldValue, resetForm } = useForm({
  initialValues: {
    nickname: "",
    address: "",
    lat: null,
    lon: null,
  },
  validationSchema: {
    nickname: (value) => {
      if (!value) return t("my-home.nicknameRequired");
      return true;
    },
    address: (value) => {
      if (!value) return t("my-home.addressRequired");
      return true;
    },
  },
});

const isSubmitting = ref(false);
const successMessage = ref("");
const errorMessage = ref("");
const addressSuggestions = ref([]);

const fetchAddressSuggestions = async (query) => {
  addressSuggestions.value = await getAddressSuggestions(query);
};

function selectSuggestion(suggestion) {
  setFieldValue("address", suggestion.displayName);
  setFieldValue("lat", parseFloat(suggestion.lat));
  setFieldValue("lon", parseFloat(suggestion.lon));
  addressSuggestions.value = [];
}


const handleSubmit = async () => {
  const result = await validate();
  if (!result.valid) {
    return;
  }

  isSubmitting.value = true;
  successMessage.value = "";
  errorMessage.value = "";

  try {
    const registerForm = {
      nickname: form.nickname,
      lat: form.lat,
      lon: form.lon,
    };
    const response = await createHousehold(registerForm.nickname, registerForm.lat, registerForm.lon);

    if (response.success) {
      successMessage.value = t("household.create-success");
      resetForm();
      await userStore.fetchHouseholds()
      const household = userStore.getHouseholdByName(registerForm.nickname);
      await router.push(`/household/${household.id}`);
    } else {
      if (response.error.includes("Address")) {
        setFieldError("address", response.error);
      } else {
        errorMessage.value = response.error || "Registration failed";
      }
    }
  } catch (error) {
    errorMessage.value = "An unexpected error occurred. Please try again.";
  } finally {
    isSubmitting.value = false;
  }
};

const locationSelected = computed(() => {
  return form.lat !== null && form.lon !== null;
});


</script>

<template>
  <div class="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50 ">
    <div class="flex bg-kf-white p-6 rounded-lg shadow-lg max-w-lg w-md relative border border-kf-blue justify-center">
      <XMarkIcon @click="onClose" class="absolute top-2 right-2 cursor-pointer size-6 rounded-full hover:bg-kf-grey text-kf-blue" />
      <div class="flex flex-col items-center">
        <!-- Form -->
        <form class="flex flex-col gap-2 w-full sm:min-w-sm" @submit.prevent="handleSubmit">

          <h1 class="text-kf-blue font-bold text-2xl mb-2">{{t('my-home.create-household')}}</h1>
          <!-- Success/Error Messages -->
          <div v-if="successMessage" class="text-kf-green text-center" aria-live="polite">
            {{ successMessage }}
          </div>
          <div v-if="errorMessage" class="text-kf-red text-center" aria-live="polite">
            {{ errorMessage }}
          </div>

          <!-- Nickname -->
          <div>
            <FormField
                field-name="nickname"
                :label="t('my-home.nickname')"
                type="text"
                v-model="form.nickname"
                class="w-full"
            />
          </div>

          <!-- Address -->
          <div class="relative">
            <FormField
                field-name="address"
                :label="t('my-home.address')"
                type="text"
                v-model="form.address"
                @input="fetchAddressSuggestions($event.target.value)"
                class="w-full"
            />
            <ul
                v-if="addressSuggestions.length"
                class="absolute z-50 w-full bg-kf-white border rounded mt-1 shadow max-h-48 overflow-y-auto"
            >
              <li
                  v-for="(suggestion, index) in addressSuggestions"
                  :key="index"
                  class="px-4 py-2 hover:bg-kf-grey-100 cursor-pointer"
                  @click="selectSuggestion(suggestion)"
              >
                {{ suggestion.displayName }}
              </li>
            </ul>
          </div>


          <!-- Submit Button -->
          <button
              :disabled="isSubmitting || !locationSelected"
              type="submit"
              class="w-full bg-kf-red text-white py-2 rounded transition disabled:opacity-50 cursor-pointer"
          >
            {{ t('my-home.create-household') }}
          </button>

        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
