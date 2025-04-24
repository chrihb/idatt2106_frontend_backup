<script setup>
import {ref} from 'vue';
import {useForm} from 'vee-validate';
import * as rules from '@vee-validate/rules';
import FormField from '@/components/input/FormField.vue';
import PasswordField from "@/components/input/PasswordField.vue";
import {requestLogin} from '@/services/loginService';
import {useI18n} from "vue-i18n";

const { t } = useI18n();
const localeOptions = [
  { code: 'en-US', nameKey: "navbar.language.en"},
  { code: 'nb-NO', nameKey: "navbar.language.nb"},
]
const {validate, values: form, resetForm} = useForm({
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
  <form @submit.prevent="handleSubmit">
    <div v-if="successMessage" aria-live="polite" class="success-message">
      {{ successMessage }}
    </div>
    <div v-if="errorMessage" aria-live="polite" class="error-message">
      {{ errorMessage }}
    </div>
    <FormField
        field-name="email"
        label= "{{t('login.email')}}"
        type="email"
    />
    <PasswordField
        field-name="password"
        label="t('login.password')"
    />
    <button :disabled="isSubmitting" type="submit">Login</button>
  </form>
</template>

<style scoped>

</style>
