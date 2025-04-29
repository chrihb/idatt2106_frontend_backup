<script setup>
import {onMounted, onUnmounted, ref} from 'vue';
import { useField, useForm } from 'vee-validate';
import * as rules from '@vee-validate/rules';
import FormField from '@/components/input/FormField.vue';
import PasswordField from "@/components/input/PasswordField.vue";
import { requestRegister } from "@/services/registerService.js";
import {useI18n} from "vue-i18n";

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
  recaptchaScript.value.src = 'https://www.google.com/recaptcha/api.js?render=6Le5biErAAAAAJi7PY0N8A-011kW48niKklfRhAb';
  recaptchaScript.value.async = true;
  recaptchaScript.value.defer = true;
  document.head.appendChild(recaptchaScript.value);

  recaptchaScript.value.onload = () => {
    if (window.grecaptcha) {
      window.grecaptcha.ready(() => {
        window.grecaptcha
            .execute('6Le5biErAAAAAJi7PY0N8A-011kW48niKklfRhAb', { action: 'register' })
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

        <div class="flex gap-2">
          <!-- First Name Field -->
          <div class="">
            <FormField
                field-name="firstName"
                :label="t('register.firstName')"
                type="text"
                class="w-full"
            />
          </div>

          <!-- Last Name Field -->
          <div class="">
            <FormField
                field-name="lastName"
                :label="t('register.lastName')"
                type="text"
                class="w-full"
            />
          </div>
        </div>

        <!-- Email Field -->
        <div class="">
          <FormField
              field-name="email"
              :label="t('register.email')"
              type="email"
              class="w-full"
          />
        </div>

        <!-- Phone number Field -->
        <div class="">
          <FormField
              field-name="phoneNumber"
              :label="t('register.phone')"
              type="text"
              class="w-full"
          />
        </div>

        <!-- Password Field -->
        <div class="">
          <PasswordField
              field-name="password"
              :label="t('register.password')"
              class="w-full"
          />
        </div>

        <!-- Repeat Password Field -->
        <div class="">
          <PasswordField
              field-name="repeatPassword"
              :label="t('register.confirmPassword')"
              class="w-full"
          />
        </div>

        <!-- Privacy Policy Checkbox -->
        <div class="">
          <label class="flex items-center text-sm text-kf-blue gap-2">
            <input
                v-model="privacyAccepted"
                name="privacyAccepted"
                type="checkbox"
                @change="validatePrivacy"
                class="size-4 text-kf-link-blue focus:ring-kf-link-blue border-kf-grey rounded"
            />
            <span>
              {{ t('register.privacyPolicyText') }}
              <a
                  href="/privacy-policy"

                  rel="noopener noreferrer"
                  target="_blank"
                  class="text-kf-link-blue hover:underline"
              >
                {{ t('footer.privacy-policy') }}
              </a>
            </span>
          </label>
          <span
              v-if="privacyError"
              id="privacyAccepted-error"
              class="error-message block text-kf-red text-sm "
              aria-live="polite"
          >
            {{ privacyError }}
          </span>
        </div>

        <!-- ReCAPTCHA Error -->
        <div class="form-field">
          <span
              v-if="recaptchaError"
              id="recaptcha-error"
              class="error-message block text-kf-red text-sm"
              aria-live="polite"
          >
            {{ recaptchaError }}
          </span>
        </div>

        <!-- Submit Button -->
        <button
            :disabled="isSubmitting"
            type="submit"
            class="w-full bg-kf-red text-white py-2 rounded transition disabled:opacity-50 cursor-pointer"
        >
          {{ t('register.register') }}
        </button>
        <!-- Toggle Link to Login -->
        <div class="text-center">
          <p class="text-kf-blue">
            {{ t('register.hasAccount') }}
            <router-link to="/login" class="text-kf-link-blue hover:underline">
              {{ t('register.loginHere') }}
            </router-link>
          </p>
        </div>
      </form>

    </div>
  </div>
</template>

<style scoped>
</style>
