<script setup>
import {onMounted, onUnmounted, ref} from 'vue';
import { useField, useForm } from 'vee-validate';
import * as rules from '@vee-validate/rules';
import FormField from '@/components/input/FormField.vue';
import PasswordField from "@/components/input/PasswordField.vue";
import { requestRegister } from "@/services/registerService.js";
import {useI18n} from "vue-i18n";
import HomeButton from "@/components/HomeButton.vue";

const { t } = useI18n();

const { validate, values: form, errors, setFieldError, resetForm } = useForm({
  validationSchema: {
    email: (value) => {
      if (!value) return t('register.emailRequired');
      if (!rules.email(value)) return t('register.emailError');
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
    firstName: (value) => {
      if (!value) return t('register.firstNameRequired');
      return true;
    },
    lastName: (value) => {
      if (!value) return t('register.lastNameRequired');
      return true;
    },
    phoneNumber: (value) => {
      if (!value) return t('register.phoneRequired');
      if (typeof value !== 'string') return t('register.phoneRequired');
      const phoneRegex = /^\+?[0-9]{7,15}$/;
      if (!phoneRegex.test(value)) return t('register.phoneRequired');
      return true;
    },
    privacyAccepted: (value) => {
      if (!value) return t('register.privacyPolicyRequired');
      return true;
    },
    recaptcha: (value) => {
      if (!value) return t('register.recaptchaRequired');
      return true;
    },
  },
});

const {value: privacyAccepted, errorMessage: privacyError, validate: validatePrivacy} = useField('privacyAccepted');
const {value: recaptchaValue, errorMessage: recaptchaError} = useField('recaptcha');

const isSubmitting = ref(false);
const recaptchaToken = ref('');
const successMessage = ref('');
const errorMessage = ref('');
const recaptchaScript = ref(null);

// Function to clean up reCAPTCHA
const cleanupRecaptcha = () => {
  // Remove the reCAPTCHA script
  if (recaptchaScript.value && document.head.contains(recaptchaScript.value)) {
    document.head.removeChild(recaptchaScript.value);
  }

  // Remove the reCAPTCHA badge
  const badge = document.querySelector('.grecaptcha-badge');
  if (badge && badge.parentNode) {
    badge.parentNode.removeChild(badge);
  }

  // Reset reCAPTCHA-related state
  recaptchaToken.value = '';
  recaptchaValue.value = '';
  if (window.grecaptcha) {
    window.grecaptcha = undefined; // Optional: Clear grecaptcha object
  }
};

onMounted(() => {
  if (recaptchaToken.value) return;

  recaptchaScript.value = document.createElement('script');
  recaptchaScript.value.src = 'https://www.google.com/recaptcha/api.js?render=6LdJUSgrAAAAAJAeQH5nUAago8wTqrshaVAcitBP';
  recaptchaScript.value.async = true;
  recaptchaScript.value.defer = true;
  document.head.appendChild(recaptchaScript.value);

  recaptchaScript.value.onload = () => {
    if (window.grecaptcha) {
      window.grecaptcha.ready(() => {
        window.grecaptcha
            .execute('6LdJUSgrAAAAAJAeQH5nUAago8wTqrshaVAcitBP', { action: 'register' })
            .then((token) => {
              recaptchaToken.value = token;
              recaptchaValue.value = token;
            })
            .catch((error) => {
              console.error('ReCAPTCHA execution failed:', error);
              setFieldError('recaptcha', 'Failed to verify ReCAPTCHA');
            });
      });
    } else {
      console.error('ReCAPTCHA script loaded but grecaptcha is not available');
      setFieldError('recaptcha', 'ReCAPTCHA failed to load');
    }
  };

  recaptchaScript.value.onerror = () => {
    console.error('Failed to load ReCAPTCHA script');
    setFieldError('recaptcha', 'ReCAPTCHA failed to load');
  };
});

onUnmounted(() => {
  cleanupRecaptcha(); // Clean up reCAPTCHA on component unmount
});


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
      email: form.email,
      password: form.password,
      firstname: form.firstName,
      lastname: form.lastName,
      phoneNumber: form.phoneNumber,
      reCaptchaToken: recaptchaToken.value,
    };
    console.log('Submitting registration form:', registerForm); // Debug the form data
    const response = await requestRegister(registerForm, t);

    if (response.success) {
      successMessage.value = t('register.successMessage');
      resetForm();
      recaptchaToken.value = '';
    } else {
      if (response.error === 'ReCAPTCHA verification failed') {
        setFieldError('recaptcha', response.error);
      } else if (response.error.includes('First name')) {
        setFieldError('firstName', response.error);
      } else if (response.error.includes('Surname')) {
        setFieldError('lastName', response.error);
      }else if (response.error.includes('PhoneNumber')) {
          setFieldError('phoneNumber', response.error);
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
        <div v-if="successMessage" class="text-green-600 text-center mb-4" aria-live="polite">
          {{ successMessage }}
        </div>
        <div v-if="errorMessage" class="text-red-600 text-center mb-4" aria-live="polite">
          {{ errorMessage }}
        </div>

        <!-- Email Field -->
        <div class="mb-4">
          <FormField
              field-name="email"
              :label="t('register.email')"
              type="email"
              class="w-full p-2"
          />
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

        <!-- First Name Field -->
        <div class="mb-4">
          <FormField
              field-name="firstName"
              :label="t('register.firstName')"
              type="text"
              class="w-full p-2"
          />
        </div>

        <!-- Last Name Field -->
        <div class="mb-4">
          <FormField
              field-name="lastName"
              :label="t('register.lastName')"
              type="text"
              class="w-full p-2"
          />
        </div>

        <!-- Phone number Field -->
        <div class="mb-4">
          <FormField
              field-name="phoneNumber"
              :label="t('register.phone')"
              type="text"
              class="w-full p-2"
          />
        </div>

        <!-- Privacy Policy Checkbox -->
        <div class="form-field mb-4">
          <label class="flex items-center text-sm text-gray-700">
            <input
                v-model="privacyAccepted"
                name="privacyAccepted"
                type="checkbox"
                @change="validatePrivacy"
                class="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span>
              {{ t('register.privacyPolicyText') }}
              <a
                  href="/privacy-policy"
                  rel="noopener noreferrer"
                  target="_blank"
                  class="text-blue-600 hover:underline"
              >
                {{ t('footer.privacy-policy') }}
              </a>
            </span>
          </label>
          <span
              v-if="privacyError"
              id="privacyAccepted-error"
              class="error-message block text-red-600 text-sm mt-1"
              aria-live="polite"
          >
            {{ privacyError }}
          </span>
        </div>

        <!-- ReCAPTCHA Error -->
        <div class="form-field mb-4">
          <span
              v-if="recaptchaError"
              id="recaptcha-error"
              class="error-message block text-red-600 text-sm"
              aria-live="polite"
          >
            {{ recaptchaError }}
          </span>
        </div>

        <!-- Submit Button -->
        <button
            :disabled="isSubmitting"
            type="submit"
            class="w-full bg-kf-red text-white p-2 rounded transition disabled:opacity-50 cursor-pointer"
        >
          {{ t('register.register') }}
        </button>
      </form>
      <!-- Toggle Link to Login -->
      <div class="mt-4 text-center">
        <p class="text-gray-600">
          {{ t('register.hasAccount') }}
          <router-link to="/login" class="text-blue-600 hover:underline">
            {{ t('register.loginHere') }}
          </router-link>
        </p>
      </div>
      <HomeButton />
    </div>
  </div>
</template>

<style scoped>
</style>
