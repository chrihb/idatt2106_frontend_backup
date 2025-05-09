<script setup>
import {ref, onMounted, reactive} from 'vue';
import {useForm} from 'vee-validate';
import * as rules from '@vee-validate/rules';
import FormField from '@/components/input/FormField.vue';
import PasswordField from "@/components/input/PasswordField.vue";
import {requestLogin} from '@/services/adminLoginService.js';
import {useI18n} from "vue-i18n";
import {useAuthRedirect} from "@/utils/useAuthRedirect.js";
import {useRoute, useRouter} from "vue-router";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const { redirectAfterAuth } = useAuthRedirect();

const {validate, values: form, resetForm} = useForm({
  validationSchema: {
    username: (value) => {
      if (!value) return t('register.admin.usernameRequired');
      return true;
    },
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
    twoFactorCode: (value) => {
      if (!value && twoFactorSent.value) return t('login.twoFactorRequired');
      return true;
    }
  },
});

const isSubmitting = ref(false);
const successMessage = ref('');
const errorMessage = ref('');
const twoFactorSent = ref(false);
const twoFactorCode = ref('');

onMounted(() => {
  if (route.query.success === 'true') {
    successMessage.value = t('login.redirectSuccessMessage');
  }
});

const submitForm = async () => {
  if (twoFactorSent.value) {
    await handleSubmit();
  } else {
    await sendTwoFactorCode();
  }
};

const sendTwoFactorCode = async () => {
  const result = await validate(['email', 'username', 'password']);
  if (!result.valid) return;

  isSubmitting.value = true;
  successMessage.value = '';
  errorMessage.value = '';

  try {
    const response = await fetch(`${window.backendURL}/api/admin/2fa`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: form.email })
    });

    if (response.ok) {
      twoFactorSent.value = true;
      successMessage.value = t('login.twoFactorSent');
    } else {
      const data = await response.json();
      errorMessage.value = data.error || t('login.twoFactorError');
    }
  } catch (error) {
    console.error("Error sending 2FA code:", error);
    errorMessage.value = error.message || t('login.twoFactorError');
  } finally {
    isSubmitting.value = false;
  }
};

const handleSubmit = async () => {
  const result = await validate();
  if (!result.valid) return;

  isSubmitting.value = true;
  successMessage.value = '';
  errorMessage.value = '';

  try {
    const loginForm = {
      username: form.username,
      email: form.email,
      password: form.password,
      twoFactorCode: form.twoFactorCode
    };

    const response = await requestLogin(loginForm, t);

    if (response.success) {
      successMessage.value = t('login.loginSuccess', { username: form.username });
      resetForm();

      setTimeout(() => {
        redirectAfterAuth('/');
      }, 1500);
    } else {
      errorMessage.value = response.error || t('login.loginError');
    }
  } catch (error) {
    console.error("Login error:", error);
    errorMessage.value = error.message || t('login.networkError');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="flex items-center justify-center">
    <div class="w-full max-w-sm">
      <!-- Form -->
      <form class="flex flex-col gap-2" @submit.prevent="submitForm">
        <h1 class="text-2xl font-bold text-center mb-4">{{ t('login.adminLogin') }}</h1>

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
              :label="t('register.admin.username')"
              class="w-full"
              :disabled="twoFactorSent"
          />
        </div>

        <!-- Email Field -->
        <div class="">
          <FormField
              field-name="email"
              :label="t('login.email')"
              type="email"
              class="w-full"
              :disabled="twoFactorSent"
          />
        </div>

        <!-- Password Field -->
        <div class="">
          <PasswordField
              field-name="password"
              :label="t('login.password')"
              class="w-full"
              :disabled="twoFactorSent"
          />
        </div>

        <!-- Two Factor Code Field (shown after sending code) -->
        <div v-if="twoFactorSent" class="">
          <FormField
              field-name="twoFactorCode"
              :label="t('login.twoFactorCode')"
              class="w-full"
          />
          <p class="text-sm mt-1">{{ t('login.twoFactorInstructions') }}</p>
        </div>

        <!-- Submit Button -->
        <button
            :disabled="isSubmitting"
            type="submit"
            class="w-full bg-kf-red text-kf-white py-2 rounded disabled:opacity-50 cursor-pointer"
        >
          <span v-if="!twoFactorSent">{{ t('login.sendTwoFactor') }}</span>
          <span v-else>{{ t('login.login') }}</span>
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