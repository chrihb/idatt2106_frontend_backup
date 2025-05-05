<script setup>
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import {ArrowLeftIcon} from "@heroicons/vue/24/solid/index.js";
import {ref} from "vue";
import {useForm} from "vee-validate";
import FormField from "@/components/input/FormField.vue";

const { t } = useI18n();
const router = useRouter();


const { validate, values: form, errors, setFieldError, resetForm } = useForm({
  validationSchema: {
    nickname: (value) => {
      if (!value) return t('my-home.nicknameRequired');
      return true;
    },
    address: (value) => {
      if (!value) return t('my-home.addressRequired');
      return true;
    },
  },
});


const isSubmitting = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const handleSubmit = async () => {
  const result = await validate();
  if (!result.valid) {
    console.log('Validation failed:', errors.value); // Debug validation errors
    return;
  }

  isSubmitting.value = true;
  successMessage.value = '';
  errorMessage.value = '';

  try {
    const registerForm = {
      address: form.address,
    };
    console.log('Submitting registration form:', registerForm); // Debug the form data
    const response = 1 //await requestRegister(registerForm, t);

    if (response.success) {
      successMessage.value = t('register.successMessage');
      resetForm();
    } else {
      if (response.error.includes('Address')) {
        setFieldError('address', response.error);
      } else {
        errorMessage.value = response.error || 'Registration failed';
      }
    }
  } catch (error) {
    console.error('Submission error:', error); // Debug submission errors
    errorMessage.value = 'An unexpected error occurred. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="h-full flex justify-center py-4">
    <div class="flex flex-col items-center">

      <!-- Form -->
      <form class="flex flex-col gap-2" @submit.prevent="handleSubmit">
        <!-- Success/Error Messages -->
        <div v-if="successMessage" class="text-kf-green text-center" aria-live="polite">
          {{ successMessage }}
        </div>
        <div v-if="errorMessage" class="text-kf-red text-center" aria-live="polite">
          {{ errorMessage }}
        </div>

          <!-- Nickname -->
          <div class="">
            <FormField
                field-name="nickname"
                :label="t('my-home.nickname')"
                type="text"
                class="w-full"
            />
          </div>
          <!-- Address -->
          <div class="">
            <FormField
                field-name="address"
                :label="t('my-home.address')"
                type="text"
                class="w-full"
            />
          </div>

        <!-- Submit Button -->
        <button
            :disabled="isSubmitting"
            type="submit"
            class="w-full bg-kf-red text-white py-2 rounded transition disabled:opacity-50 cursor-pointer"
        >
          {{ t('my-home.create-household') }}
        </button>
      </form>

      <ArrowLeftIcon @click="router.push('/household/options')" class="cursor-pointer row-1 col-1 mt-2 size-8 rounded-full hover:bg-kf-grey"/>
    </div>
  </div>

</template>

<style scoped>
</style>
