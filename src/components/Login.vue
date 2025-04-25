<script setup>
import {ref} from 'vue';
import {useForm} from 'vee-validate';
import * as rules from '@vee-validate/rules';
import FormField from '@/components/input/FormField.vue';
import PasswordField from "@/components/input/PasswordField.vue";
import {requestLogin} from '@/services/loginService';
import {useI18n} from "vue-i18n";
import HomeButton from "@/components/HomeButton.vue";

const { t } = useI18n();

const {validate, values: form, resetForm} = useForm({
  validationSchema: {
    email: (value) => {
      if (!value) return  t('login.emailRequired') ;
      if (!rules.email(value)) return t('login.emailError');
      return true;
    },
    password: (value) => {
      if (!value) return t('login.passwordRequired');
      if (value.length < 8) return t('login.passwordLengthError');
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
    const loginForm = {
      email: form.email,
      password: form.password,
    };
    const response = await requestLogin(loginForm);

    if (response.success) {
      successMessage.value = 'Login successful! Welcome, ' + form.email + '.';
      resetForm();
    } else {
      errorMessage.value = response.error || 'Login failed';
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

        <!-- Email Field -->
        <div class="mb-4">
          <FormField
              field-name="email"
              :label="t('login.email')"
              type="email"
              class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Password Field -->
        <div class="mb-6">
          <PasswordField
              field-name="password"
              :label="t('login.password')"
              class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Submit Button -->
        <button
            :disabled="isSubmitting"
            type="submit"
            class="w-full bg-kf-red text-white p-2 rounded disabled:opacity-50 cursor-pointer"
        >
          {{ t('login.login') }}
        </button>

        <!-- Create User Link -->
        <div class="mt-4 text-center">
          <router-link to="/register-account" class="text-blue-600 hover:underline">
            {{ t('login.createUser') }}
          </router-link>
        </div>
      </form>
      <HomeButton />
    </div>
  </div>
</template>

<style scoped>

</style>
