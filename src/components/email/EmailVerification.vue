<script setup>
import {onMounted, ref} from 'vue';
import {useI18n} from "vue-i18n";
import {requestEmailVerification} from "@/services/emailService.js";
import {useRoute} from "vue-router";

const { t } = useI18n();

const route = useRoute();
const successMessage = ref('');
const errorMessage = ref('');

const handleAccept = async () => {

  successMessage.value = '';
  errorMessage.value = '';

  try {

  } catch (error) {
    errorMessage.value = 'An unexpected error occurred. Please try again.';
  }
};

onMounted( async () => {

  const verificationToken = route.params.token;
  try {
    const checkEmailVerification = await requestEmailVerification(verificationToken);
    successMessage.value = checkEmailVerification.success;
  } catch {
    errorMessage.value = "error";
  }
});
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

      <!-- Success/Error Messages -->
      <div v-if="successMessage" aria-live="polite" class="text-green-600 text-center mb-4">
        {{ successMessage }}
      </div>
      <div v-if="errorMessage" aria-live="polite" class="text-red-600 text-center mb-4">
        {{ errorMessage }}
      </div>

      <!-- Verify Button -->
      <button
          @click ="handleAccept"
          class="w-full bg-kf-red text-white p-2 rounded disabled:opacity-50 cursor-pointer">
        {{ t('password-reset.sendResetLink') }}
      </button>
    </div>
  </div>
</template>

<style scoped>

</style>
