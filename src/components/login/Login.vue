<script setup>
import {ref} from 'vue';
import {useForm} from 'vee-validate';
import * as rules from '@vee-validate/rules';
import FormField from '@/components/input/FormField.vue';
import PasswordField from "@/components/input/PasswordField.vue";
import {requestLogin} from '@/services/loginService';
import {useI18n} from "vue-i18n";
import router from "@/router/index.js";

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
    const response = await requestLogin(loginForm, t);

    if (response.success) {
      successMessage.value = 'Login successful! Welcome, ' + form.email + '.';
      await router.push('/');
      resetForm();
    } else {
      errorMessage.value = response.error || 'Login failed';
    }
  } catch (error) {
    errorMessage.value = error.message;
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
        <div v-if="successMessage" aria-live="polite" class="text-kf-green text-center mb-4">
          {{ successMessage }}
        </div>
        <div v-if="errorMessage" aria-live="polite" class="text-kf-red text-center mb-4">
          {{ errorMessage }}
        </div>

        <!-- Email Field -->
        <div class="">
          <FormField
              field-name="email"
              :label="t('login.email')"
              type="email"
              class="w-full"
          />
        </div>

        <!-- Password Field -->
        <div class="">
          <PasswordField
              field-name="password"
              :label="t('login.password')"
              class="w-full"
          />
        </div>

        <!-- Submit Button -->
        <button
            :disabled="isSubmitting"
            type="submit"
            class="w-full bg-kf-red text-kf-white py-2 rounded disabled:opacity-50 cursor-pointer"
        >
          {{ t('login.login') }}
        </button>

        <!-- Forgot Password Link -->
        <div class="text-center">
          <router-link to="/password-reset-request" class="text-kf-link-blue hover:underline">
            {{ t('login.forgotPassword') }}
          </router-link>
        </div>

        <!-- Create User Link -->
        <div class="text-center">
          <router-link to="/register-account" class="text-kf-link-blue hover:underline">
            {{ t('login.createUser') }}
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>

</style>
