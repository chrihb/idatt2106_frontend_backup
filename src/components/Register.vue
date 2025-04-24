<script setup>
import { onMounted, ref } from 'vue';
import { useField, useForm } from 'vee-validate';
import * as rules from '@vee-validate/rules';
import FormField from '@/components/input/FormField.vue';
import PasswordField from "@/components/input/PasswordField.vue";
import { requestRegister } from "@/services/registerService.js";


const { validate, values: form, errors, setFieldError, resetForm } = useForm({
  validationSchema: {
    email: (value) => {
      if (!value) return 'Email is required';
      if (!rules.email(value)) return 'Invalid email format';
      return true;
    },
    password: (value) => {
      if (!value) return 'Password is required';
      if (value.length < 8) return 'Password must be at least 8 characters';
      return true;
    },
    firstName: (value) => {
      if (!value) return 'First name is required';
      return true;
    },
    surname: (value) => {
      if (!value) return 'Surname is required';
      return true;
    },
    privacyAccepted: (value) => {
      if (!value) return 'You must accept the privacy policy';
      return true;
    },
    recaptcha: (value) => {
      if (!value) return 'Please complete the ReCAPTCHA';
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
/**
 * Function to handle the ReCAPTCHA validation
 */
onMounted(() => {
  if (recaptchaToken.value) return;
  const script = document.createElement('script');
  script.src = 'https://www.google.com/recaptcha/api.js?render=6Le5biErAAAAAJi7PY0N8A-011kW48niKklfRhAb';
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);

  script.onload = () => {
    if (window.grecaptcha) {
      window.grecaptcha.ready(() => {
        window.grecaptcha
            .execute('6Le5biErAAAAAJi7PY0N8A-011kW48niKklfRhAb', {action: 'register'})
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

  script.onerror = () => {
    console.error('Failed to load ReCAPTCHA script');
    setFieldError('recaptcha', 'ReCAPTCHA failed to load');
  };
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
      firstName: form.firstName,
      surname: form.surname,
      recaptchaToken: recaptchaToken.value,
    };
    console.log('Submitting registration form:', registerForm); // Debug the form data
    const response = await requestRegister(registerForm);

    if (response.success) {
      successMessage.value = 'Registration successful!';
      resetForm();
      recaptchaToken.value = '';
    } else {
      if (response.error === 'ReCAPTCHA verification failed') {
        setFieldError('recaptcha', response.error);
      } else if (response.error.includes('First name')) {
        setFieldError('firstName', response.error);
      } else if (response.error.includes('Surname')) {
        setFieldError('surname', response.error);
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
  <form @submit.prevent="handleSubmit">
    <div v-if="successMessage" class="success-message" aria-live="polite">
      {{ successMessage }}
    </div>
    <div v-if="errorMessage" class="error-message" aria-live="polite">
      {{ errorMessage }}
    </div>
    <FormField
        field-name="email"
        label="Email"
        type="email"
    />
    <PasswordField
        field-name="password"
        label="Password"
    />
    <FormField
        field-name="firstName"
    label="First Name"
    type="text"
    />
    <FormField
        field-name="surname"
    label="Surname"
    type="text"
    />
    <div class="form-field">
      <label>
        <input
            v-model="privacyAccepted"
            name="privacyAccepted"
            type="checkbox"
            @change="validatePrivacy"
        />
        I accept the
        <a
            href="/privacy-policy"
            rel="noopener noreferrer"
            target="_blank">
          Privacy Policy</a>
      </label>
      <span
          v-if="privacyError"
          id="privacyAccepted-error"
          aria-live="polite"
          class="error"
      >
        {{ privacyError }}
      </span>
    </div>
    <div class="form-field">
      <span
          v-if="recaptchaError"
          id="recaptcha-error"
          class="error"
          aria-live="polite"
      >
        {{ recaptchaError }}
      </span>
    </div>
    <button :disabled="isSubmitting" type="submit">Register</button>
  </form>
</template>

<style scoped>
</style>
