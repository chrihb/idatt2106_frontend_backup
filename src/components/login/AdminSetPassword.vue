<script setup>
import {onMounted, ref} from 'vue';
import {useForm} from 'vee-validate';
import PasswordField from "@/components/input/PasswordField.vue";

import {useI18n} from "vue-i18n";
import {executePasswordReset} from "@/services/emailService.js";
import { useRoute, useRouter } from "vue-router";
import {setAdminPassword} from "@/services/adminLoginService.js";

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const {validate, values: form, resetForm} = useForm({
  validationSchema: {
    password: (value) => {
      if (!value) return t('register.passwordRequired');
      if (value.length < 8) return t('register.passwordLengthError');
      return true;
    },
    repeatPassword: (value) => {
      if (!value) return t('register.confirmPasswordRequired');
      if (value !== form.password) return t('register.confirmPasswordError');
      return true;
    },
  },
});

const isSubmitting = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const handleSubmit = async () => {
  const result = await validate();
  if (!result.valid) return;

  isSubmitting.value = true;
  successMessage.value = '';
  errorMessage.value = '';

  try {
    const newPasswordForm = {
      password: form.password,
      repeatPassword: form.repeatPassword,
    };
    const verificationToken = route.query.token;
    const response = await setAdminPassword(verificationToken, newPasswordForm.password);

    if (response) {
      successMessage.value = 'Password set successful! You can now log in with your password.';
      resetForm();
      await router.push('/login');
    } else {
      errorMessage.value = response.error || 'Failed to reset password';
    }
  } catch (error) {
    errorMessage.value = 'An unexpected error occurred. Please try again.';
  } finally {
    isSubmitting.value = false;
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

      <!-- Form -->
      <form @submit.prevent="handleSubmit">
        <!-- Success/Error Messages -->
        <div v-if="successMessage" aria-live="polite" class="text-green-600 text-center mb-4">
          {{ successMessage }}
        </div>
        <div v-if="errorMessage" aria-live="polite" class="text-red-600 text-center mb-4">
          {{ errorMessage }}
        </div>

        <!-- Password Field -->
        <div class="mb-4">
          <PasswordField
              field-name="password"
              :label="t('register.password')"
              class="w-full p-2"
          />
        </div>

        <!-- Repeat Password Field -->
        <div class="mb-4">
          <PasswordField
              field-name="repeatPassword"
              :label="t('register.confirmPassword')"
              class="w-full p-2"
          />
        </div>

        <!-- Submit Button -->
        <button
            :disabled="isSubmitting"
            type="submit"
            class="w-full bg-kf-red text-white p-2 rounded disabled:opacity-50 cursor-pointer"
        >
          {{ t('password-reset.setNewPassword') }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>

</style>
