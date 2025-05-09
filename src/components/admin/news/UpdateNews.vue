<script setup>
import { ref, onMounted } from 'vue';
import { useForm } from 'vee-validate';
import FormField from '@/components/input/FormField.vue';
import { createNews } from '@/services/newsService.js';
import { useI18n } from "vue-i18n";
import { useRoute } from 'vue-router';

const { t } = useI18n();
const route = useRoute();

const isSubmitting = ref(false);
const successMessage = ref('');
const errorMessage = ref('');
const caseId = ref('');

const { validate, values: form, resetForm, setFieldValue } = useForm({
  validationSchema: {
    caseId: (v) => v ? true : 'Case ID is required',
    title: (v) => v ? true : 'Title is required',
    content: (v) => v ? true : 'Content is required',
    district: (v) => v ? true : 'District is required',
  },
});

onMounted(() => {
  const caseIdFromUrl = route.params.caseId || route.query.caseId;
  if (caseIdFromUrl) {
    caseId.value = caseIdFromUrl;
    setFieldValue('caseId', caseIdFromUrl);
  }
});

const submitForm = async () => {
  const result = await validate();
  if (!result.valid) return;

  isSubmitting.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    await createNews(form, t);
    successMessage.value = 'News updated successfully!';
    resetForm();
    setFieldValue('caseId', caseId.value);
    setTimeout(() => {
      window.location.href = '/admin-settings/news';
    }, 1500);
  } catch (error) {
    errorMessage.value = error.message || 'Failed to create news';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="flex items-center justify-center px-4">
    <div class="w-full max-w-md bg-white shadow-md rounded-lg p-6">
      <form @submit.prevent="submitForm" class="flex flex-col gap-4">
        <h1 class="text-2xl font-bold text-center text-gray-800 mb-2">{{ t('admin-settings.news.updateTitle') }}</h1>

        <div class="text-center text-gray-600 text-base font-semibold">
          Case ID: <span class="text-black">{{ caseId }}</span>
        </div>

        <div v-if="successMessage" class="text-green-600 text-center">{{ successMessage }}</div>
        <div v-if="errorMessage" class="text-red-600 text-center">{{ errorMessage }}</div>

        <FormField field-name="title" label="Title" />
        <FormField field-name="content" label="Content" />
        <FormField field-name="district" label="District" />

        <button
          :disabled="isSubmitting"
          type="submit"
          class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          Submit News
        </button>
      </form>
    </div>
  </div>
</template>
