<script setup>
import {ref, onMounted} from 'vue';
import {useForm} from 'vee-validate';
import * as rules from '@vee-validate/rules';
import FormField from '@/components/input/FormField.vue';
import PasswordField from "@/components/input/PasswordField.vue";
import {requestLogin} from '@/services/adminLoginService.js';
import {useI18n} from "vue-i18n";
import {useAuthRedirect} from "@/utils/useAuthRedirect.js";
import {useRoute} from "vue-router";

const { t } = useI18n();
const route = useRoute();


const {validate, values: form, resetForm} = useForm({
  validationSchema: {
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

onMounted(() => {
  if (route.query.success === 'true') {
    successMessage.value = t('login.redirectSuccessMessage');
  }
});

const handleSubmit = async () => {
  const result = await validate()
  if (!result.valid) return

  isSubmitting.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    const loginForm = {
      username: form.username,
      password: form.password,
    }

    const response = await requestLogin(loginForm, t)

    if (response.success) {
      successMessage.value = 'Login successful! Welcome, ' + form.username + '.'
      resetForm()

    } else {
      errorMessage.value = response.error || 'Login failed'
    }
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isSubmitting.value = false
  }
}
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

        <!-- Username Field -->
        <div class="">
          <FormField
              field-name="username"
              :label="t('login.username')"
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
      </form>
    </div>
  </div>
</template>