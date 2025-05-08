<script setup>
import {onMounted, onUnmounted, ref} from 'vue';
import { useField, useForm } from 'vee-validate';
import FormField from '@/components/input/FormField.vue';
import PasswordField from "@/components/input/PasswordField.vue";
import { requestRegister } from "@/services/registerService.js";
import {useI18n} from "vue-i18n";

const { t } = useI18n();

const { validate, values: form, errors, setFieldError, resetForm } = useForm({
  validationSchema: {
    username: (value) => {
      if (!value) return t('register.admin.usernameRequired');
      return true;
    },
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
  if (!result.valid) {
    console.log('Validation failed:', errors.value);
    return;
  }

  isSubmitting.value = true;
  successMessage.value = '';
  errorMessage.value = '';

  try {
    const registerForm = {
      username: form.firstName,
      password: form.password,
    };
    console.log('Submitting registration form:', registerForm);
    const response = 1//await requestRegister(registerForm, t);

    if (response.success) {
      successMessage.value = t('register.successMessage');
      resetForm();
    } else {
      if (response.error.includes('Username')) {
        setFieldError('username', response.error);
      } else {
        errorMessage.value = response.error || 'Registration failed';
      }
    }
  } catch (error) {
    console.error('Submission error:', error);
    errorMessage.value = 'An unexpected error occurred. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="flex items-center justify-center">
    <div class="w-full max-w-sm">

      <!-- Form -->
      <form class="flex flex-col gap-2" @submit.prevent="handleSubmit">
        <!-- Success/Error Messages -->
        <div v-if="successMessage" class="text-kf-green text-center" aria-live="polite">
          {{ successMessage }}
        </div>
        <div v-if="errorMessage" class="text-kf-red text-center" aria-live="polite">
          {{ errorMessage }}
        </div>

        <div class="">
          <FormField field-name="username"
                     :label="t('register.admin.username')"
                     type="text"
                     class="w-full"/>
        </div>

        <div class="">
          <PasswordField
              field-name="password"
              :label="t('register.password')"
              class="w-full"
          />
        </div>

        <div class="">
          <PasswordField
              field-name="repeatPassword"
              :label="t('register.confirmPassword')"
              class="w-full"
          />
        </div>

        <button
            :disabled="isSubmitting"
            type="submit"
            class="w-full bg-kf-red text-white py-2 rounded transition disabled:opacity-50 cursor-pointer"
        >
          {{ t('register.admin.register-admin') }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
</style>
