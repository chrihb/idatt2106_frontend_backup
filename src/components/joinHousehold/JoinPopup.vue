<script setup>
import {useI18n} from "vue-i18n";
import {XMarkIcon, CheckCircleIcon, XCircleIcon, ArrowLeftIcon} from "@heroicons/vue/24/solid/index.js";
import {useForm} from "vee-validate";
import {ref} from "vue";
import {getAddressSuggestions} from "@/utils/addressTranslationUtil.js";
import FormField from "@/components/input/FormField.vue";

const { t } = useI18n();

const props = defineProps({
  onClose: {
    type: Function,
    required: true,
  },
  defaultInviteCode: {
    type: String,
    default: '',
  },
});

const { validate, values: form, errors, setFieldError, resetForm } = useForm({
  initialValues: {
    inviteCode: props.defaultInviteCode || '',
  },
  validationSchema: {
    inviteCode: (value) => {
      if (!value) return t("my-home.invite-codeRequired");
      return true;
    }
  },
});

const isSubmitting = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

const handleSubmit = async () => {
  const result = await validate();
  if (!result.valid) {
    console.log("Validation failed:", errors.value); // Debug validation errors
    return;
  }

  isSubmitting.value = true;
  successMessage.value = "";
  errorMessage.value = "";

  try {
    const registerForm = {
      inviteCode: form.inviteCode,
    };
    console.log("Submitting registration form:", registerForm); // Debug the form data
    const response = 1; // await requestRegister(registerForm, t);

    if (response.success) {
      successMessage.value = t("register.successMessage");
      resetForm();
    } else {
      if (response.error.includes("Address")) {
        setFieldError("address", response.error);
      } else {
        errorMessage.value = response.error || "Registration failed";
      }
    }
  } catch (error) {
    console.error("Submission error:", error); // Debug submission errors
    errorMessage.value = "An unexpected error occurred. Please try again.";
  } finally {
    isSubmitting.value = false;
  }
};

</script>

<template>
  <div class="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50 ">
    <div class="flex bg-kf-white p-6 rounded-lg shadow-lg max-w-lg w-md relative border border-kf-blue justify-center">
      <XMarkIcon @click="onClose" class="absolute top-2 right-2 cursor-pointer size-6 rounded-full hover:bg-kf-grey text-kf-blue" />
      <div class="flex flex-col items-center">
        <!-- Form -->
        <form class="flex flex-col gap-2 w-full sm:min-w-sm" @submit.prevent="handleSubmit">

          <h1 class="text-kf-blue font-bold text-2xl mb-2">{{t('my-home.join-household')}}</h1>
          <!-- Success/Error Messages -->
          <div v-if="successMessage" class="text-kf-green text-center" aria-live="polite">
            {{ successMessage }}
          </div>
          <div v-if="errorMessage" class="text-kf-red text-center" aria-live="polite">
            {{ errorMessage }}
          </div>

          <!-- Invite Code -->
          <div>
            <FormField
                field-name="inviteCode"
                :label="t('my-home.invite-code')"
                type="text"
                v-model="form.inviteCode"
                class="w-full"
            />
          </div>

          <!-- Submit Button -->
          <button
              :disabled="isSubmitting"
              type="submit"
              class="w-full bg-kf-red text-white py-2 rounded transition disabled:opacity-50 cursor-pointer"
          >
            {{ t('my-home.join-household') }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
