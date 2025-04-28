<script setup>
import {ref} from 'vue';
import {useForm} from 'vee-validate';
import * as rules from '@vee-validate/rules';
import FormField from '@/components/input/FormField.vue';
import {useI18n} from "vue-i18n";
import {requestPasswordReset} from "@/services/emailService.js";

const { t } = useI18n();

const {validate, values: form, resetForm} = useForm({
  validationSchema: {
    email: (value) => {
      if (!value) return  t('login.emailRequired') ;
      if (!rules.email(value)) return t('login.emailError');
      return true;
    },
  },
});

const isRequesting = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const handleSubmit = async () => {
  const result = await validate();
  if (!result.valid) return;

  isRequesting.value = true;
  successMessage.value = '';
  errorMessage.value = '';

  try {
    const passwordResetRequest = {
      email: form.email,
    };
    const response = await requestPasswordReset(passwordResetRequest);

    if (response.success) {
      successMessage.value = 'Password reset link sent to ' + form.email + '.';
      resetForm();
    } else {
      errorMessage.value = response.error || 'Failed to send password reset link';
    }
  } catch (error) {
    errorMessage.value = 'An unexpected error occurred. Please try again.';
  } finally {
    isRequesting.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
      <!-- Logo -->
      <div class="flex justify-center mb-4">
        <img src="@/assets/logo.png" alt="Logo" class="w-16 h-16" />
      </div>

      <!-- Title -->
      <h1 class="text-2xl font-bold text-center mb-6">Krisefikser</h1>

      <!-- Request Reset Link Label -->
      <h2 class="text-lg font-semibold text-center mb-4">
        {{ t('password-reset.sendResetLabel') }}
      </h2>

      <!-- Form -->
      <form @submit.prevent="handleSubmit">
        <!-- Success/Error Messages -->
        <div v-if="successMessage" aria-live="polite" class="text-green-600 text-center mb-4">
          {{ successMessage }}
        </div>
        <div v-if="errorMessage" aria-live="polite" class="text-red-600 text-center mb-4">
          {{ errorMessage }}
        </div>

        <!-- Email Field -->
        <div class="mb-4">
          <FormField
              field-name="email"
              :label="t('login.email')"
              type="email"
              class="w-full p-2 "
          />
        </div>

        <!-- Request Button -->
        <button
            :disabled="isRequesting"
            type="submit"
            class="w-full bg-kf-red text-white p-2 rounded disabled:opacity-50 cursor-pointer"
        >
          {{ t('password-reset.sendResetLink') }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>

</style>
